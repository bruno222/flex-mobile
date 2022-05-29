in progress....

# TO-DO

### Tech Debt

    - [ ] Implement token renewal - I guess I need to install FlexSDK for that, for having the listener(onTokenUpdate)
    - [ ] When a Premise fails, show a Toast
    - [ ] Update README: Add how to install/run locally
    - [ ] Update README: Add how to install and run the .apk
    - [ ] Update README: Add screenshots (or an animated gif?)

### Bugs

    - [ ] When a task is accept on Mobile, it cant be complete in the Desktop. Why? I think I am missing something when Accepting a task.
    - [ ] When a task is complete on Mobile, the customer cannot send another SMS to start a new task. Somehow, the SMS goes to the old conversation instead of starting a new one. What I am missing?

### Features

    - [ ] Add Push
    - [ ] Add a way to set the runtime domain (so Customers and SEs can try on their own without installing the whole toolchain)
    - [ ] Add a screen to print out the task.attributes (similary as we have in the INFO tab on Tasktop)
    - [ ] Add a button to start an outbound call
    - [ ] Add Voice Calls: receive the call via PSTN (contact_url: +49123123) - Or install that voice-sdk repo to receive calls on ReactNative
    - [ ] Change icons and splashscreen (/assets folder + app.json)
