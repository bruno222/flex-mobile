/**
 * All those small things that needs to be shared among components goes here,
 * instead of creating thousands of small files...
 */
import { store } from '@risingstack/react-easy-state';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONST_TOKEN = 'FLEX_TOKEN';
const CONST_EXPIRE_AT = 'FLEX_TOKEN_EXPIRE_AT';

export const flexTokenStore = store({
  token: '',
  isStarting: true,
  async set(token: string) {
    const oneHourLater = new Date();
    oneHourLater.setMinutes(oneHourLater.getMinutes() + 55); // 55 mins and not 60 to give a margin for the token to be still validated when used

    flexTokenStore.token = token;

    await AsyncStorage.setItem(CONST_TOKEN, token);
    await AsyncStorage.setItem(CONST_EXPIRE_AT, oneHourLater.toISOString());
    console.log('token: ', token);
  },
  async start() {
    const expireAt = new Date((await AsyncStorage.getItem(CONST_EXPIRE_AT)) || new Date(1).toISOString());
    const now = new Date();
    console.log('@@flexTokenStore start - now: ', now.toISOString(), ' - expireAt: ', expireAt.toISOString());

    if (now > expireAt) {
      flexTokenStore.isStarting = false;
      return '';
    }

    flexTokenStore.token = (await AsyncStorage.getItem(CONST_TOKEN)) || '';
    flexTokenStore.isStarting = false;
  },
});
