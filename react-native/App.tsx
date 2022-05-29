import 'react-native-gesture-handler';
import { Login } from './screens/Login';
import { useState } from 'react';
import { Main } from './screens/Main';
import { RecoilRoot } from 'recoil';

// While in development phase (yarn start), get the token from the console and put it here.
// this will help to bypass the slow SSO process on every time, at least for one hour.
const TOKEN_TEMP =
  'eyJ6aXAiOiJERUYiLCJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsImVuYyI6IkEyNTZHQ00iLCJhbGciOiJkaXIiLCJ0d3IiOiJ1czEiLCJraWQiOiJTQVNfUzNfX19LTVNfdjEifQ..n3TAySX5QrihotQb.-DflMPwPhjWKDFygHHreCbp1Nic77YjUcEz-S6jVbyCk8tW2IRSw3tmGPiJJc0n-oL3XqU8XXTAH_pVD1iaaSKTn3Np-KKFalIlq1qeJuXF2lPhrE06n8ynUQirICVkTwp72CuqNrFVvsHjuAS93pJi4Xgsj0GIVwhVi_tPzUEm52TCPN92yz-WM2I97O0A4Pm3i2GY39nSlTVa08BK0yllqnH-UTYobi4H-2NbzEg_YK2wC-VihkzDR6msjYdq6w_tRDa4w6FyCbrhlgVNkUy0O1iCuATl4Fek1c4Gfo3Rno_NNeXlQqPOeyOUAnkB59ATuzEfO0k1GjVHksJ8_FyYXOtUtrfxz4NkLTQEIdvoZl8OMu5WMN545h8Iv51JfpmK3ITdTrMWyumF2HnQOmIVeiGwLRLbHcrmhGwA_0413-H6oQZKGrW8wdJ3CBBeRuChK6T3r6u2eolEMe1Ex1Nai0dCmUCHPWMMDDR3jO6pC67H5_K133JfaeYbiFgJPxru8s0IyYIVCMc2rxCUUn0GxiHEZCVwe_f6PlLiskBarpa3ns3IedxyONbhytZa7RM3WRBcQ0kmxmzNEuefCemuKcYEjZjCUvlR17nenP0807qYBBuFzgJmkwI_S2dqhuunq-3rwfnZEjoBNUda8gSK9GiClRqv5cibXyZbxriYfIoaiOdqaP2VWQ5TggP19Y1iC6EYn1d2vv4lbGpcakOfKmIJNkK_MfNLFnat5O8LKgcX0jt_3MVje73HxNgChtKpoUhIkHUrAphvBoG1i9CGwPDIL7PEu4xnfKtxmxQeig55hZYNS7u_5LyuwFYeHeVgpV_RdX2n7_s9Zk-B8vTwrDeiIB2GgHaD4Tiywh07L4CQWFIx2SwNDxa_L8FJDwT4AQgNy-F8Yp1rzziYYjAuRyB85Cce8W1Z8vBYu5T66dqpRzE2ghgGJxsHaPpZ1mtbZOPWxzIOo-IIl-E-bj3Jcw_-cNiuhENgKC5hdem7vHFmUae9h90W676e8zQelAMgjnrmItjRuNQkEa2b9NzEbP2kvPEc3wqTYKBf0UZbxN11HtPUGJyTtiMm64rQv8YRscyrkj36sIvdeSdsGMT4ch8l-QZ7BC8kYis7PbPHJvYQBdUYrQXh7x5qSXpPNK6MY0MQ0T4xiM8CSmQsmgURoHlT03_1nczkVOyybG21Indx8CLQIzm0SzbiA8TK6sm9RR6AOr2aJeY2tFk8GR-s2i14WUxDoBoK-K2aWq7Oqcz4z1EfNdUnUVhSQ2w-hYwlVbWptu5JwyWF0ZfXKKPih9yUfMmi06H6kMOCZ35rpKNZ8rJsSvdL2xK5f5YadKDv28l7qsqGCDXD3nSpBux98NADRuuzIjopcQjCB6UcLYToiB9-mIjmh0HQVXnqi7wQG_1xCGezi6Hrj03xbRubpOIMrxV49ZWihI-_Kdkz1p5nfwI-iSvcuYPuSfBAvq6tRavV7XAcJSOkwu3x5-lipRVOIhLkHw1DaXSyghdkh2_Ng_575bsKGH8DELPHmh8pgwqym980fs2IFO9uUVRJ7na7EETNNfmeK-ane-ThTWMuEZNlHOwTXMbtI-B4IF7MZyZFR8n6HBuzRTo8EU4XkoxsHBH3NGBb8WaX3nSs9FVo5JD-Du40M7one84Nxm2VWf8E988rkzD-rn5ppZIrXlpNf3sEimY4PUqDEpxUmxZjPDCAbOtg6asn7j62_JRlYUUhbkDgZjTTLWQndP8soJ1p3HrlXH4d4yb6crBHYMMq7EwwBWqZ2Xe_06ohs-h10CN3lAmnYCkDTvBiwrfo0CvTxe57dCoIB5xULOhBchjw8RPoHVVzZ3ggD3FG4XZ0V9bfNxqD46Hg.o2tmxqjRRY42j3ib2pYgQA';

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
