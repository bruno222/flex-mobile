import { Badge } from 'native-base';

export const UnreadMsgs = ({ unreadMsgs }: { unreadMsgs: number }) => {
  const hideBadge = unreadMsgs <= 0;

  if (hideBadge) {
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
};
