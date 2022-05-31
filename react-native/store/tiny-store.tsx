/**
 * All those small things that needs to be shared among components goes here,
 * instead of creating thousands of small files...
 */
import { store } from '@risingstack/react-easy-state';

export const tinyStore = store({
  isAvailable: false,
});
