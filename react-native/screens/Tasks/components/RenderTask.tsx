import { Avatar, Badge, Box, HStack, Spacer, Text, VStack } from 'native-base';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useRecoilValue } from 'recoil';
import { timeAgo } from '../../../helper/helper';
import { isReservationPending } from '../../../helper/taskrouter-sdk';
import { conversationState, unreadBadgeState } from '../../../state/state';
import { UnreadMsgs } from './UnreadMsgs';

export const RenderTask = ({ task, navigation }: any) => {
  const unreadBadge = useRecoilValue(unreadBadgeState);

  // Not a conversation task
  if (!task || !task.attributes || !task.attributes.conversationSid) {
    return null;
  }

  console.log('@@task', task);

  const {
    reservationSid,
    attributes: { conversationSid: chSid },
  } = task;
  const name: string = task.attributes.name || task.attributes.from;
  const conversations = useRecoilValue(conversationState);

  const lastMessage =
    conversations && conversations[chSid] && conversations[chSid].messages && conversations[chSid].messages!.length > 0
      ? conversations[chSid].messages![conversations[chSid].messages!.length - 1].body
      : '';

  const initials = useMemo(
    () =>
      !name.includes(' ')
        ? name.replace('+', '').toUpperCase().substring(0, 2)
        : name
            .replace('+', '')
            .toUpperCase()
            .split(' ')
            .reduce((previousValue, currentValue) => previousValue.substring(0, 1) + currentValue.substring(0, 1), ''),
    [name]
  );

  const unreadMsgs = unreadBadge[chSid] || 0;

  return (
    <Box width="100%" backgroundColor={isReservationPending(task) ? 'red.100' : 'white'}>
      <TouchableOpacity onPress={() => navigation.navigate('Chat', { chSid, name, reservationSid })}>
        <Box pl="3" pr="2" py="4">
          <HStack alignItems="center" space={3}>
            <Avatar size="48px">{initials}</Avatar>
            <VStack maxWidth="62%">
              <Text isTruncated bold fontSize="lg">
                {name}
              </Text>
              <Text isTruncated>{lastMessage}</Text>
            </VStack>
            <Spacer />
            <VStack maxWidth="38%">
              <VStack>
                <VStack>
                  <Text fontSize="xs" color="coolGray.800" alignSelf="flex-start">
                    {timeAgo(task.timeAgo)}
                  </Text>
                </VStack>
                <VStack marginTop="7px">
                  <UnreadMsgs unreadMsgs={unreadMsgs} />
                </VStack>
              </VStack>
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};
