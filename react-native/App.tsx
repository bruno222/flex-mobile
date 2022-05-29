import 'react-native-gesture-handler';
import { Login } from './screens/Login';
import { useState } from 'react';
import { Main } from './screens/Main';
import { RecoilRoot } from 'recoil';
import { TOKEN_TEMP } from './token';

function App() {
  const [token, setToken] = useState(TOKEN_TEMP);
  console.log('token:', token);

  // Open browser with the Login URL in case token does not exist.
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // Start the App, showing all the Tasks
  return (
    <RecoilRoot>
      <Main token={token} setToken={setToken} />
    </RecoilRoot>
  );
}

export default App;
