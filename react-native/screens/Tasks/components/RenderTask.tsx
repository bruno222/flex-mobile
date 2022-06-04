import { view } from '@risingstack/react-easy-state';
import { Avatar, Box, HStack, Spacer, Text, VStack } from 'native-base';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { timeAgo } from '../../../helper/helper';
import { isReservationPending } from '../../../helper/taskrouter-sdk';
import { conversationsStore } from '../../../store/conversations-store';
// import { conversationState } from '../../../state/state';
import { UnreadMsgs } from './UnreadMsgs';

export const RenderTask = view(({ task, navigation }: any) => {
  // Not a conversation task
  if (!task || !task.attributes || !task.attributes.conversationSid) {
    return null;
  }

  console.log('@@atask', task);

  const {
    reservationSid,
    attributes: { conversationSid: chSid },
  } = task;
  const name: string = task.attributes.name || task.attributes.from;

  const lastMessage = conversationsStore.getLastMessage(chSid);

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
                  <UnreadMsgs chSid={chSid} />
                </VStack>
              </VStack>
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    </Box>
  );
});
