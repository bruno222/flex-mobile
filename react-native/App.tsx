import 'react-native-gesture-handler';
import { Login } from './screens/Login';
import { Main } from './screens/Main';
import { RecoilRoot } from 'recoil';
import { view } from '@risingstack/react-easy-state';
import { tinyStore } from './store/tiny-store';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from './helper/push-notification';

function App() {
  const { token } = tinyStore;

  // Get push notification token
  useEffect(() => {
    registerForPushNotificationsAsync().then((pushToken) => {
      tinyStore.pushToken = pushToken!;
    });
  }, []);

  // Open browser with the Login URL in case token does not exist.
  if (!token) {
    return <Login />;
  }

  // Start the App, showing all the Tasks
  return (
    <RecoilRoot>
      <Main token={token} />
    </RecoilRoot>
  );
}

export default view(App);
