import { ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging, TokenMessage } from 'firebase-admin/messaging';

export const ohNoCatch = (e: any, callback: ServerlessCallback) => {
  console.error('Exception: ', typeof e, e);
  const response = new Twilio.Response();
  response.setStatusCode(403);
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');
  response.setBody({ error: typeof e === 'string' ? e : e.message });
  callback(null, response);
};

export const ResponseOK = (obj: any, callback: ServerlessCallback) => {
  console.error('Response: ', typeof obj, obj);
  const response = new Twilio.Response();
  response.setStatusCode(200);
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');
  response.setBody(typeof obj === 'string' ? { obj } : obj);
  callback(null, response);
};

export interface PushMessage {
  token: string;
  title: string;
  body: string;
  tag: string;
}

let pushInitExecuted = false;
export const pushInit = () => {
  if (pushInitExecuted) {
    console.log('pushInit - aborting as it was executed before');
    return;
  }

  (process.env as any).GOOGLE_APPLICATION_CREDENTIALS = Runtime.getAssets()['/service-account.json'].path;
  initializeApp();
  pushInitExecuted = true;
};
export const pushSend = async ({ token, title, body, tag }: PushMessage) => {
  const message: TokenMessage = {
    token,
    notification: {
      title,
      body,
    },
    android: {
      priority: 'high',
      notification: {
        tag,
      },
    },
    // data: {
    //   experienceId: '@bruno222/com.bruno222.flexmobile',
    //   'content-active': 'test',
    //   bruno: 'show2',
    // },
  };

  const response = await getMessaging().send(message);
  console.log('(sendPush) sent:', response);
};
