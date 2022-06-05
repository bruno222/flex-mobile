import 'react-native-gesture-handler';
import { Login } from './screens/Login';
import { Main } from './screens/Main';
import { view } from '@risingstack/react-easy-state';
import { tinyStore } from './store/tiny-store';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from './helper/push-notification';
import { flexTokenStore } from './store/flex-token-store';
import { Loading } from './components/Loading';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  const { isStarting, token } = flexTokenStore;

  useEffect(() => {
    // Get push notification token
    registerForPushNotificationsAsync().then((pushToken) => {
      tinyStore.pushToken = pushToken!;
    });

    // Get Flex token from localStorage
    (async () => {
      await flexTokenStore.start();
    })();
  }, []);

  if (isStarting) {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Loading />
        </NavigationContainer>
      </NativeBaseProvider>
    );
  }

  // Open browser with the Login URL in case token does not exist.
  if (!token) {
    return <Login />;
  }

  // Start the App, showing all the Tasks
  return <Main />;
}

export default view(App);
