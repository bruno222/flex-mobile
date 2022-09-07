- If you want to change these files, go to https://github.com/bruno222/reactnative-twilio-taskrouter.js and follow the instructions of the readme there. I did this instead of using the original @twilio/taskrouter because:

  1. one of the packages of taskrouter, loglevel, was breaking ReactNative... So I had to disabled it.
  2. as I was touching taskrouter, I took advantage to [change a bit one of the contracts](https://github.com/bruno222/reactnative-twilio-taskrouter.js/commit/360bfb165d048649cf9f852934b0937d0c59bd79)... to expose externally the error (e.g "error because token is invalid", so ReactNative could show the login once again)
