import { atom } from 'recoil';

export interface ConversationsState {
  [key: string]: {
    messages?: any[];
    sendMessage: (text: string) => Promise<null>;
  };
}

// -1 means "this chat window is the current window, do not increase the value of it"
export interface UnreadBadge {
  [key: string]: number;
}

export const taskState = atom({
  key: 'taskState',
  default: {},
});

export const conversationState = atom({
  key: 'conversationState',
  default: {} as ConversationsState,
});

export const isAvailableState = atom({
  key: 'isAvailableState',
  default: false,
});

export const unreadBadgeState = atom({
  key: 'unreadBadgeState',
  default: {} as UnreadBadge,
});
