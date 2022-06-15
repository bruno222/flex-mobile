import '@twilio-labs/serverless-runtime-types';
import { ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
import * as HelperType from './helper.private';
import { Twilio as TwilioInterface } from 'twilio';

const { ohNoCatch, pushSend, pushInit } = <typeof HelperType>require(Runtime.getFunctions()['helper'].path);

type MyContext = {};
type MyEvent = {
  EventType: 'onMessageAdded' | string;
  Author: string;
  ConversationSid: string;
  Body: string;
};

pushInit();

let cacheWorkspaceSid = '';
const ACTIVITY_WHEN_ONLINE = 'Available on Mobile';

export const getTaskrouterSid = async (twilioClient: TwilioInterface) => {
  if (cacheWorkspaceSid) {
    console.log('getTaskrouterSid: From Cache...');
    return cacheWorkspaceSid;
  }
  console.log('getTaskrouterSid: Executing once...');
  const workspaces = await twilioClient.taskrouter.workspaces.list();
  if (workspaces.length !== 1) {
    throw new Error('Hum.. This is not a Flex account, is it? Why do you have more than one TaskRouter Workspace? You cant!');
  }
  cacheWorkspaceSid = workspaces[0].sid;
  return cacheWorkspaceSid;
};

const cache: any = {
  tokens: {},
  expireAt: new Date(1),
};

export const getWorkerPushToken = async (twilioClient: TwilioInterface, identity: string) => {
  if (cache.tokens[identity]) {
    console.log(`getWorkerPushToken: From Cache for "${identity}"...`);
    return cache.tokens[identity];
  }
  const workspaceSid = await getTaskrouterSid(twilioClient);
  const friendlyName = decodeURIComponent(identity.replace(/_/gi, '%')); // convert user_2D_2B4917672800000 to user-+491767200000
  console.log(`getWorkerPushToken: Executing once for "${identity}"...`);
  const worker = await twilioClient.taskrouter.workspaces(workspaceSid).workers.list({ friendlyName });
  if (worker.length === 0) {
    console.log(`Warn: no worker was found with the friendlyName "${friendlyName}". Original identity was "${identity}".`);
    return;
  }

  if (worker[0].activityName !== ACTIVITY_WHEN_ONLINE) {
    console.log(`Worker "${friendlyName}" is not Available on Mobile. His/her activity is current "${worker[0].activityName}". Aborting Push...`);
    return;
  }

  const { attributes } = worker[0];
  const { pushToken } = JSON.parse(attributes);

  if (!pushToken) {
    console.log(`Worker "${friendlyName}" does not have worker.attributes.pushToken, aborting...`);
    return;
  }
  cache.tokens[identity] = pushToken;

  return pushToken;
};

const cleanCache = () => {
  const now = new Date();
  if (now > cache.expireAt) {
    cache.tokens = {};
  }
  cache.expireAt = new Date();
  cache.expireAt.setSeconds(cache.expireAt.getSeconds() + 30); // 30 seconds cache
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  try {
    cleanCache();

    console.log('event:', event);
    const { EventType, Author, ConversationSid, Body } = event;

    if (EventType !== 'onMessageAdded') {
      return callback(null, { msg: `aborting because ${EventType} !== onMessageAdded` });
    }

    if (!Author) {
      return callback(null, { msg: `aborting because Author is empty` });
    }

    const twilioClient = context.getTwilioClient();
    const participants = await twilioClient.conversations.conversations(ConversationSid).participants.list();
    const participantsWithIdentity = participants
      .filter(({ identity }) => !!identity) // agents always have identity: 'user_2D_2B4917672800000'
      .filter(({ identity }) => identity !== Author); // do not send push if it is me sending the message

    for (const { identity } of participantsWithIdentity) {
      const pushToken = await getWorkerPushToken(twilioClient, identity);

      if (!pushToken) {
        continue;
      }

      await pushSend({
        token: pushToken,
        title: Body,
        body: `from ${Author}`,
        tag: Author,
      });
    }

    return callback(null, { ok: 1 });
  } catch (e) {
    ohNoCatch(e, callback);
  }
};
