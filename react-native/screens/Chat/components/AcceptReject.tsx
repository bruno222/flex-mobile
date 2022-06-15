import { Box, Button, Center, HStack, Spinner, Text } from 'native-base';
import { useState } from 'react';
import { conversationSdk } from '../../../helper/conversations-sdk';
import flexInteractions from '../../../helper/flex-interactions-sdk';
import { ReservationActions, taskrouterSdk } from '../../../helper/taskrouter-sdk';
import { Task } from '../../../store/reservations-store';

interface Props {
  task: Task;
  reservationSid: string;
  goBack?: Function;
}
export const AcceptReject = ({ task, reservationSid, goBack }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  console.log('@@AcceptReject', goBack);

  const onAccept = async () => {
    console.log('@@onAccept', reservationSid);
    setIsLoading(true);
    // await conversationSdk.addAgentAsParticipant(chSid);
    task.isVoice && (await taskrouterSdk.reservationAction(reservationSid, ReservationActions.accept));
    !task.isVoice && (await flexInteractions.accept(task));
    setIsLoading(false);
  };

  const onReject = async () => {
    console.log('@@onReject', reservationSid);
    goBack && goBack();
    await taskrouterSdk.reservationAction(reservationSid, ReservationActions.reject);
  };

  if (isLoading) {
    return (
      <Box safeAreaBottom={12} bottom="50px" position="absolute" backgroundColor="#e5ded4" w="100%">
        <HStack justifyContent="center" top="20px">
          <Center>
            <Spinner accessibilityLabel="Please wait" size="lg" />
          </Center>
        </HStack>
      </Box>
    );
  }

  return (
    <HStack justifyContent="center" top="20px">
      <Center paddingRight="40px">
        <Button size="lg" backgroundColor="#1db054" onPress={onAccept} ena>
          <Text w="120px" textAlign="center">
            Accept
          </Text>
        </Button>
      </Center>
      <Center>
        <Button size="lg" backgroundColor="#d61f20" onPress={onReject}>
          <Text w="120px" textAlign="center">
            Reject
          </Text>
        </Button>
      </Center>
    </HStack>
  );
};
