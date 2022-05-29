import { Avatar, Box, Heading, HStack, Pressable, ScrollView, Spacer, StatusBar, Switch, Text, View, VStack } from 'native-base';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { taskrouterSdk } from '../../helper/taskrouter-sdk';
import { isAvailableState, taskState } from '../../state/state';
import { RenderTask } from './components/RenderTask';

export const Tasks = ({ navigation /*, route: { params: tasks }*/ }: any) => {
  const tasks = useRecoilValue(taskState);
  const renderSafetyBottom = Object.values(tasks).length > 5;
  const isAvailable = useRecoilValue(isAvailableState);
  // console.log('@@ isAvailable2', isAvailable);

  const onChangeActivity = async (e: any) => {
    const value = e.nativeEvent.value;
    await taskrouterSdk.toggleWorkerActivity(value);
  };

  const hasTasks = Object.values(tasks).length > 0;

  const RenderTasks = () => (
    <ScrollView showsVerticalScrollIndicator={false} w="100%" backgroundColor="white">
      {Object.values(tasks).map((task: any) => (
        <RenderTask key={task.sid} task={task} navigation={navigation} />
      ))}
      {renderSafetyBottom && <Box safeAreaBottom={12} />}
    </ScrollView>
  );

  const RenderNoTasks = () => (
    <Box w="100%" justifyContent="center" alignItems="center" h="85%">
      <Heading color="primary.500" fontSize="xl">
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
};
