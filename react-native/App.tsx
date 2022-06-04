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

  // Push Notification
  useEffect(() => {
    registerForPushNotificationsAsync();
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
