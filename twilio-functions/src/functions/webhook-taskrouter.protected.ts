import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
import * as HelperType from './helper.private';

const { ohNoCatch, pushSend, pushInit } = <typeof HelperType>require(Runtime.getFunctions()['helper'].path);

type MyEvent = {
  EventType: 'reservation.created' | string;
  TaskAttributes: string;
  WorkerAttributes: string;
  WorkerActivityName: string;
  WorkerName: string;
  WorkspaceSid: string;
  WorkerSid: string;
  ReservationSid: string;
  TaskSid: string;
  request: {
    [key: string]: any;
  };
};

type MyContext = {};

const ACTIVITY_WHEN_ONLINE = 'Available on Mobile';
pushInit();

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  try {
    console.log('headers:', event.request.headers);
    console.log('event:', event);
    const { EventType } = event;

    if (EventType === 'reservation.created') {
      await onReservationCreated(context, event, callback);
      return;
    }

    if (EventType === 'worker.activity.update') {
      await onWorkerActivityUpdate(context, event, callback);
      return;
    }

    return callback(null, { msg: `aborting because ${EventType} is not any of our interest.` });
  } catch (e) {
    ohNoCatch(e, callback);
  }
};

const onWorkerActivityUpdate = async (context: Context<MyContext>, event: MyEvent, callback: ServerlessCallback) => {
  const twilioClient = context.getTwilioClient();
  const { WorkerAttributes, WorkerActivityName, WorkspaceSid, WorkerSid, WorkerName } = event;
  const a = JSON.parse(WorkerAttributes);
  const isMobile = WorkerActivityName === ACTIVITY_WHEN_ONLINE;
  const workerPhoneNumber = WorkerName.replace('user-', ''); // user-+4917699999999 to +4917699999999

  // save the original contact_uri for once and for ever
  if (!a.contact_uri_original) {
    a.contact_uri_original = a.contact_uri;
  }

  // update
  const new_contact_uri = isMobile ? workerPhoneNumber : a.contact_uri_original;
  console.log('New contact_uri: ', new_contact_uri);

  // check
  if (a.contact_uri === new_contact_uri) {
    console.log('all good, nothing to do...');
    return callback(null, { msg: `all good, nothing to do...` });
  }

  // update
  a.contact_uri = new_contact_uri;

  await twilioClient.taskrouter
    .workspaces(WorkspaceSid)
    .workers(WorkerSid)
    .update({ attributes: JSON.stringify(a) });

  return callback(null, { ok: 1 });
};

const onReservationCreated = async (context: Context<MyContext>, event: MyEvent, callback: ServerlessCallback) => {
  const { DOMAIN_NAME } = context;
  const { WorkerName, WorkspaceSid, ReservationSid, TaskSid, WorkerAttributes, WorkerActivityName, WorkerSid, TaskAttributes } = event;

  if (WorkerActivityName !== ACTIVITY_WHEN_ONLINE) {
    return callback(null, { msg: `aborting because ${WorkerActivityName} !== ${ACTIVITY_WHEN_ONLINE}` });
  }

  const { pushToken } = JSON.parse(WorkerAttributes);
  const { name, from, call_sid } = JSON.parse(TaskAttributes);
  const customerName = name || from;
  const isVoice = !!call_sid;
  const workerPhoneNumber = WorkerName.replace('user-', ''); // user-+4917699999999 to +4917699999999
  const twilioClient = context.getTwilioClient();

  //
  // Voice Tasks -> Call to the agent directly
  //
  if (isVoice) {
    console.log('is a call, calling the agents phone...');
    await twilioClient.taskrouter
      .workspaces(WorkspaceSid)
      .tasks(TaskSid)
      .reservations(ReservationSid)
      .update({
        to: workerPhoneNumber,
        instruction: 'conference',
        endConferenceOnCustomerExit: true,
        endConferenceOnExit: true,
        statusCallback: `https://${DOMAIN_NAME}/webhook-conference`,
        // statusCallback: `https://bkilian.eu.ngrok.io/webhook-conference`,
        statusCallbackEvent: ['completed'], // 'answered', 'initiated', 'ringing'*/,
      });
    return callback(null, { ok: 1 });
  }

  //
  // Chat Tasks -> send push notifications
  //
  console.log('it is a chat');
  if (!pushToken) {
    console.log('pushToken is empty');
    return callback(null, { msg: `${WorkerName} with worker.attributes.pushToken is empty.` });
  }

  console.log('sending push...');
  await pushSend({
    token: pushToken,
    title: 'Hey, you have a new chat!',
    body: `from ${customerName}`,
    tag: 'reservation.created',
  });

  return callback(null, { ok: 1 });
};
