import '@twilio-labs/serverless-runtime-types';
import { ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
import * as HelperType from './helper.private';

const { ohNoCatch, pushSend, pushInit } = <typeof HelperType>require(Runtime.getFunctions()['helper'].path);

type MyEvent = {
  EventType: 'reservation.created' | string;
  TaskAttributes: string;
  WorkerAttributes: string;
  WorkerActivityName: string;
  WorkerName: string;
};

type MyContext = {
  SYNC_SERVICE_SID: string;
  SYNC_LIST_SID: string;
  VERIFY_SERVICE_SID: string;
};

const ACTIVITY_WHEN_ONLINE = 'Available on Mobile';
pushInit();

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  try {
    console.log('event:', event);
    const twilioClient = context.getTwilioClient();

    const { EventType, WorkerName, WorkerAttributes, WorkerActivityName, TaskAttributes } = event;

    if (EventType !== 'reservation.created') {
      return callback(null, { msg: `aborting because ${EventType} !== reservation.created` });
    }

    if (WorkerActivityName !== ACTIVITY_WHEN_ONLINE) {
      return callback(null, { msg: `aborting because ${WorkerActivityName} !== ${ACTIVITY_WHEN_ONLINE}` });
    }

    const { pushToken } = JSON.parse(WorkerAttributes);
    const { name, from } = JSON.parse(TaskAttributes);
    const customerName = name || from;

    if (!pushToken) {
      return callback(null, { msg: `${WorkerName} with worker.attributes.pushToken is empty.` });
    }

    await pushSend({
      token: pushToken,
      title: 'Hey, you have a new chat',
      body: `from ${customerName}`,
      tag: 'reservation.created',
    });

    return callback(null, { ok: 1 });
  } catch (e) {
    ohNoCatch(e, callback);
  }
};
