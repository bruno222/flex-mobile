in progress.... for now, [click here to see it in action](https://www.loom.com/share/91e174973bee4cf1bf873f46b8334a0c)!

# Where I am working on?

### Tech Debt

    - [ ] Remove the last piece of Recoil in favor of @risingstack/react-easy-state (Part 2 of 2)
    - [ ] Implement token renewal - I guess I need to install FlexSDK for that, for having the listener(onTokenUpdate)
    - [ ] When a Premise fails, show a Toast
    - [ ] Update README: Add how to install/run locally
    - [ ] Update README: Add how to install and run the .apk
    - [ ] Update README: Add screenshots (or an animated gif?)

### Bugs

    - [ ] When a task is accept on Mobile, it cant be complete in the Desktop.
    - [ ] When a task is complete on Mobile, the customer cannot send another SMS to start a new task.
    - [ ] When a task is already in task.complete (or conversation status=closed), hide input field to not allow the user to send a new message

### Features

    - [ ] Add Push
    - [ ] Add a way to set the runtime domain (so Customers and SEs can try on their own without installing the whole toolchain)
    - [ ] Add Voice Calls: receive the call via PSTN (contact_url: +49123123) - Or install that voice-sdk repo to receive calls on ReactNative
    - [ ] Change icons and splashscreen (/assets folder + app.json)

# Future release will come with

    - [x] Feature - Add a button to start an outbound call
    - [x] Feature - Add a screen to print out the task.attributes (similary as we have in the INFO tab on Desktop)
    - [x] Feature - Show badge with the number of unread msgs in the Tasks.tsx
    - [x] Tech Debt - Refactoring the Store to use the lovely @risingstack/react-easy-state (Part 1 of 2)
