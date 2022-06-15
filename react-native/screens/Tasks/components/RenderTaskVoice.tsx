import { view } from '@risingstack/react-easy-state';
import { Avatar, Box, HStack, Spacer, StatusBar, Text, View, VStack } from 'native-base';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { timeAgo } from '../../../helper/helper';
import { isReservationPending } from '../../../helper/taskrouter-sdk';
import { conversationsStore } from '../../../store/conversations-store';
import { AcceptReject } from '../../Chat/components/AcceptReject';
// import { conversationState } from '../../../state/state';
import { UnreadMsgs } from './UnreadMsgs';

export const RenderTaskVoice = view(({ task, navigation }: any) => {
  console.log('@@atask', task);
  const name: string = task.attributes.name || task.attributes.from;

  return (
    <View>
      <StatusBar backgroundColor="#f22e45" barStyle="light-content" />
      <Box w="100%" justifyContent="center" alignItems="center" h="100%" backgroundColor="#e5ded4">
        <Box height="100%" width="100%">
          <Text isTruncated bold fontSize="sm" textAlign="center" marginTop="120px">
            Incoming call
          </Text>
          <Text isTruncated bold fontSize="4xl" textAlign="center" marginTop="30px">
            {name}
          </Text>
          <Box safeAreaBottom={12} bottom="10px" position="absolute" backgroundColor="#e5ded4" w="100%">
            {isReservationPending(task) && <AcceptReject task={task} reservationSid={task.reservationSid} />}
          </Box>
        </Box>
      </Box>
    </View>
  );
});
