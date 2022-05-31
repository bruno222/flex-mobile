import { view } from '@risingstack/react-easy-state';
import { Badge } from 'native-base';
import { unreadBadgeStore } from '../../../store/unread-badge-store';

export const UnreadMsgs = view(({ chSid }: { chSid: string }) => {
  const unreadMsgs = unreadBadgeStore.get(chSid);

  if (!unreadMsgs) {
    return null;
  }

  return (
    <Badge
      colorScheme="danger"
      rounded="full"
      variant="solid"
      alignSelf="flex-end"
      _text={{
        fontSize: 12,
      }}
    >
      {unreadMsgs}
    </Badge>
  );
});
