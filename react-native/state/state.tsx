import { JSONValue } from '@twilio/conversations';
import { atom, useRecoilState } from 'recoil';

export const taskState = atom({
  key: 'taskState',
  default: {},
});

interface Conversations {
  [key: string]: {
    messages?: any[];
    sendMessage: (text: string) => Promise<null>;
  };
}

export const conversationState = atom({
  key: 'conversationState',
  default: {} as Conversations,
});

export const isAvailableState = atom({
  key: 'isAvailableState',
  default: false,
});
