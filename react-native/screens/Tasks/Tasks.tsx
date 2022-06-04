import { view } from '@risingstack/react-easy-state';
import { Box, Heading, HStack, ScrollView, StatusBar, Switch, Text, View, VStack } from 'native-base';
import { taskrouterSdk } from '../../helper/taskrouter-sdk';
import { reservationsStore } from '../../store/reservations-store';
import { tinyStore } from '../../store/tiny-store';
import { RenderTask } from './components/RenderTask';

export const Tasks = view(({ navigation }: any) => {
  const { isAvailable, pushToken } = tinyStore;
  const renderSafetyBottom = reservationsStore.length() > 5;
  const hasTasks = reservationsStore.length() > 0;

  const onChangeActivity = async (e: any) => {
    const value = e.nativeEvent.value;
    await taskrouterSdk.toggleWorkerActivity(value);
  };

  console.log('@@a tasks re-rendered');

  const RenderTasks = () => (
    <ScrollView showsVerticalScrollIndicator={false} w="100%" backgroundColor="white">
      {Object.values(reservationsStore.all).map((task: any) => (
        <RenderTask key={task.sid} task={task} navigation={navigation} />
      ))}
      {renderSafetyBottom && <Box safeAreaBottom={12} />}
    </ScrollView>
  );

  const RenderNoTasks = () => (
    <Box w="100%" justifyContent="center" alignItems="center" h="85%">
      <Heading color="red.400" fontSize="xl">
        Oh, you have no tasks.
      </Heading>
    </Box>
  );

  return (
    <View>
      <StatusBar backgroundColor="#f22e45" barStyle="light-content" />
      <Box safeAreaTop bg="blue.300" />
      <HStack bg="#f22e45" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
        <HStack alignItems="center">
          <Text color="white" fontSize="20" fontWeight="bold" paddingLeft="15px">
            Chats
          </Text>
        </HStack>
        <HStack paddingRight="10px">
          {/* <ArrowBackIcon size="5" mt="0.5" color="emerald.500" /> */}
          {/* <Text color="white" alignSelf="flex-end">
            Available
          </Text> */}
          <Switch isChecked={isAvailable} size="md" onChange={onChangeActivity} />
        </HStack>
      </HStack>
      {hasTasks ? <RenderTasks /> : <RenderNoTasks />}
    </View>
  );
});
