import { Task } from '../store/reservations-store';
import { tinyStore } from '../store/tiny-store';
import { TOKEN_TEMP } from '../token';

const accept = async (task: Task) => {
  console.log('@@acceptTask - task', task);
  const { token } = tinyStore;

  const {
    reservationSid, // WRxxx
    attributes: {
      // conversations: {
      //     conversation_id // KDxxx
      // },
      flexInteractionSid, // KDxxx
      flexInteractionChannelSid, // UOxxx
      flexChannelInviteSid, //  KGxxx
    },
  } = task as any;

  const body = {
    url: `v1/Interactions/${flexInteractionSid}/Channels/${flexInteractionChannelSid}/Invites/${flexChannelInviteSid}`,
    params: { action: 'accept', routing: { type: 'taskrouter', reservation: { sid: reservationSid } } },
    method: 'POST',
    token,
  };

  await request(body);
};

const close = async (task: Task) => {
  console.log('@@endTask - task', task);
  const { token } = tinyStore;

  const {
    attributes: {
      flexInteractionSid, // KDxxx
      flexInteractionChannelSid, // UOxxx
    },
  } = task as any;

  const body = {
    url: `v1/Interactions/${flexInteractionSid}/Channels/${flexInteractionChannelSid}`,
    params: { status: 'closed', routing: { status: 'wrapup' } },
    method: 'POST',
    token,
  };

  await request(body);
};

const request = async (body: any) => {
  const response = await fetch('https://event-bridge.twilio.com/v1/wschannels', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'text/plain' }, // Well, Flex desktop is not sending as "application/json". Lets just do the same here...
  });

  //   const data = await response.json();
  //   console.log('@@endTask - response', data);
};
export default {
  close,
  accept,
};
