## How to work with these files

If you want to change these files, go to https://github.com/bruno222/reactnative-twilio-taskrouter.js and follow the instructions of the readme there. 

## Why these files instead of the original "@twilio/taskrouter" package?

  1. one of the packages of taskrouter, [loglevel](https://github.com/bruno222/reactnative-twilio-taskrouter.js/commit/7c22ad5daffd952a46fe13aff532fcee2dce86a1#diff-86bdbbcb39f24ccc04edce5a45602e1b5c0da2f29f028e5f9a25bfc696da080e), was breaking ReactNative... So I had no option but to fork @twilio/taskrouter to disable loglevel.
  2. as I was forking and changing taskrouter, I took advantage to [change a bit one of the contracts](https://github.com/bruno222/reactnative-twilio-taskrouter.js/commit/360bfb165d048649cf9f852934b0937d0c59bd79)... to expose externally the error (e.g "error because token is invalid", so ReactNative [could show the login screen once again](https://github.com/bruno222/flex-mobile/blob/de05b5a872ca2d83f3b16790bf7aa62cb3ba89c4/react-native/helper/taskrouter-sdk.tsx#L185))


