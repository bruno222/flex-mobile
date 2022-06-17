import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
import * as HelperType from './helper.private';

const { ohNoCatch } = <typeof HelperType>require(Runtime.getFunctions()['helper'].path);

type MyEvent = {
  CallStatus: string;
  WorkspaceSid: string;
  TaskSid: string;
  request: {
    [key: string]: any;
  };
};

type MyContext = {};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  try {
    console.log('headers:', event.request.headers);
    console.log('event:', event);
    const { CallStatus, TaskSid, WorkspaceSid } = event;

    if (CallStatus !== 'completed') {
      return callback(null, { msg: `aborting because CallStatus !== completed` });
    }

    const twilioClient = context.getTwilioClient();

    const task = await twilioClient.taskrouter.workspaces(WorkspaceSid).tasks(TaskSid).fetch();
    await task.update({ assignmentStatus: 'completed' });
    return callback(null, { ok: 1 });
  } catch (e) {
    ohNoCatch(e, callback);
  }
};
