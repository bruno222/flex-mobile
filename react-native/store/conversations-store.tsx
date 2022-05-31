import { store } from '@risingstack/react-easy-state';
import { unreadBadgeStore } from './unread-badge-store';

export interface MessageStore {
  body: string;
  index: number;
  sid: string;
  author: string;
  isMe: boolean;
}

export interface Conversation {
  messages: MessageStore[];
  sendMessage: (text: string) => Promise<any>;
}

interface Conversations {
  [key: string]: Conversation;
}

const emptyObj: Conversation = {
  sendMessage: async (text: string) => {},
  messages: [],
};
export const conversationsStore = store({
  all: {} as Conversations,
  addMessage(chSid: string, message: MessageStore) {
    conversationsStore.all[chSid].messages.push(message);
    unreadBadgeStore.add(chSid);
  },
  startNewChat(chSid: string, sendMessage: (text: string) => Promise<any>, messages: MessageStore[]) {
    console.log('@@b startNewChat', chSid, messages);
    conversationsStore.all[chSid] = {
      sendMessage,
      messages,
    };
  },
  get(chSid: string) {
    return conversationsStore.all[chSid] || emptyObj;
  },
  exists(chSid: string) {
    return !!conversationsStore.all[chSid];
  },
  getLastMessage(chSid: string) {
    const { messages } = conversationsStore.get(chSid);

    if (messages.length === 0) {
      return '';
    }

    const message = messages[messages.length - 1].body;
    return message;
  },
});
