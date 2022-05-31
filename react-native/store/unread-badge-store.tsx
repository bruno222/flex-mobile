import { store } from '@risingstack/react-easy-state';

interface Badges {
  [key: string]: number | string;
}

export const unreadBadgeStore = store({
  all: {} as Badges,
  activeChSid: '',
  add(chSid: string) {
    if (chSid === unreadBadgeStore.activeChSid) {
      return;
    }
    const current = unreadBadgeStore.all[chSid] || 0;
    unreadBadgeStore.all[chSid] = +current + 1;
  },
  resetActiveChSid(chSid: string) {
    unreadBadgeStore.activeChSid = '';
    // delete unreadBadgeStore.all[chSid];
  },
  setActiveChSid(chSid: string) {
    unreadBadgeStore.activeChSid = chSid;
    delete unreadBadgeStore.all[chSid];
  },
  get(chSid: string) {
    return unreadBadgeStore.all[chSid];
  },
});
