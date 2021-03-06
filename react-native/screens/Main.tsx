import { Tasks } from './Tasks/Tasks';
import { Chat } from './Chat/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Box, NativeBaseProvider } from 'native-base';
import { useEffect, useState } from 'react';
import { taskrouterSdk } from '../helper/taskrouter-sdk';
import { conversationSdk } from '../helper/conversations-sdk';
import { Loading } from '../components/Loading';
import { ChatInfo } from './ChatInfo/ChatInfo';
import { view } from '@risingstack/react-easy-state';
import { flexTokenStore } from '../store/flex-token-store';
const Stack = createStackNavigator();

export const Main = view(() => {
  const { token } = flexTokenStore;

  const [taskRouterHasStarted, setTaskRouterHasStarted] = useState(false);

  useEffect(() => {
    console.log('@@Main loaded');
    taskrouterSdk.startOrRefresh(setTaskRouterHasStarted, conversationSdk.startOrRefresh);

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
});
