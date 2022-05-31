import { Tasks } from './Tasks/Tasks';
import { Chat } from './Chat/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Box, NativeBaseProvider } from 'native-base';
import { useEffect, useState } from 'react';
import { taskrouterSdk } from '../helper/taskrouter-sdk';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { conversationSdk } from '../helper/conversations-sdk';
import { Loading } from '../components/Loading';
import { ChatInfo } from './ChatInfo/ChatInfo';
const Stack = createStackNavigator();

export const Main = ({ token, setToken }: { token: string; setToken: SetterOrUpdater<{}> }) => {
  const [taskRouterHasStarted, setTaskRouterHasStarted] = useState(false);

  useEffect(() => {
    console.log('@@Main loaded');
    taskrouterSdk.startOrRefresh(token, setToken, setTaskRouterHasStarted, conversationSdk.startOrRefresh);

    return () => {
      console.log('@@Main Unloaded');
      // TODO: removeAllListeners() ??
    };
  }, [token]);

  if (!taskRouterHasStarted) {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Loading />
        </NavigationContainer>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Box flex={1} w="100%">
          <Stack.Navigator initialRouteName="Tasks">
            <Stack.Screen
              name="Tasks"
              component={Tasks}
              // initialParams={{ tasks }}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ChatInfo"
              component={ChatInfo}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </Box>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
