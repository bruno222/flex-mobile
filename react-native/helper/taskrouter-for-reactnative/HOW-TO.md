If you want to change these files, go to https://github.com/bruno222/reactnative-twilio-taskrouter.js and follow the instructions of the readme there. I did this instead of using the original @twilio/taskrouter because:

  1. one of the packages of taskrouter, [loglevel](https://github.com/bruno222/reactnative-twilio-taskrouter.js/commit/7c22ad5daffd952a46fe13aff532fcee2dce86a1), was breaking ReactNative... So I was forced to fork the project to fix it.
  2. as I was forking and changing taskrouter, I took advantage to [change a bit one of the contracts](https://github.com/bruno222/reactnative-twilio-taskrouter.js/commit/360bfb165d048649cf9f852934b0937d0c59bd79)... to expose externally the error (e.g "error because token is invalid", so ReactNative could show the login once again)
