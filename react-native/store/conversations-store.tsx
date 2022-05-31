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
  sendMessage: (text: string) => Promise<number>;
  // reservationStatus: string;
  // attributes: any;
  // sid: string;
  // workflowName: string;
  // queueName: string;
  // status: 'pending' | 'reserved' | 'assigned' | 'canceled' | 'completed' | 'wrapping';
  // priority: number;
  // timeAgo: number;
}

interface Conversations {
  [key: string]: Conversation;
}

export const conversationsStore = store({
  all: {} as Conversations,
  addMessage(chSid: string, message: MessageStore) {
    conversationsStore.all[chSid].messages.push(message);
    unreadBadgeStore.add(chSid);
  },
  startNewChat(chSid: string, sendMessage: (text: string) => Promise<number>, messages: MessageStore[]) {
    console.log('@@b startNewChat', chSid, messages);
    conversationsStore.all[chSid] = {
      sendMessage,
      messages,
    };
  },

  // del(reservationSid: string) {
  //   delete reservationsStore.all[reservationSid];
  // },
  get(chSid: string) {
    return conversationsStore.all[chSid];
  },
  exists(chSid: string) {
    return !!conversationsStore.all[chSid];
  },
  getLastMessage(chSid: string) {
    const conversation = conversationsStore.get(chSid);
    if (!conversation) {
      return '';
    }

    const { messages } = conversation;
    if (!messages || messages.length === 0) {
      return '';
    }

    const message = messages[messages.length - 1].body;
    return message;
  },
  // length() {
  //   return Object.values(reservationsStore.all).length;
  // },
});
