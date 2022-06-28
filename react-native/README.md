## What is it?

This is a React Native project, based on Expo. Expo is an awesome open-source platform for making universal native apps for Android and iOS in a straightforward way.

For now, this project was built and tested on Android phones only. It is absolutely possible to run it on iOS as well, but the Push Notification part has to be extended to include iOS logic.

## Why do you need this?

Why do you need this? This is the mobile app itself that will run on Agent mobile phones.

## Before installing it:

1. Create an [Expo](https://expo.dev/) account and install the [Expo CLI](https://docs.expo.dev/get-started/installation/) on your computer.
2. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) on your Android phone.
3. Sign up to [Firebase](https://firebase.google.com/) to be able to send Push Notifications.

## How to install

1. You probably already did this step, but just to make sure: go to the root folder (`cd ..` from here) and rename `/.env-example` to `/.env` and follow the instructions in the `.env` file.
2. Go back to this folder (`cd ./react-native`) and execute `yarn` to install the packages into your computer.
3. You need to replace the [google-services.json](https://github.com/bruno222/flex-mobile/blob/main/react-native/google-services.json) file with the file you will download from Firebase. [This blog post](https://medium.com/geekculture/first-class-push-notifications-for-expo-apps-4bd7bbb9a01a) gives direction on how to do it.
4. Change [this line of code](https://github.com/bruno222/flex-mobile/blob/main/react-native/screens/Login.tsx#L6) with the "Login link" of your Flex instance ([get it here](https://console.twilio.com/us1/develop/flex/manage/single-sign-on?frameUrl=%2Fconsole%2Fflex%2Fsingle-sign-on%3Fx-target-region%3Dus1))
5. Execute `npm start` to execute the script - a QR Code will show up in your terminal, open Expo Go that you have installed in your Android phone and scan this QR Code.

If everything went well, you are now running Flex Mobile locally!

Push Notifications won't work on Expo Go. You need to build your own Android App (.apk) and install it on your phone to test Push Notifications... Leave Push notifications aside for now.

## Testing the Chat

1. Sending an SMS as a customer: You can test the App pretending to be the customer sending messages. If you haven't configured yet, configure a [Flex Conversation channel](https://www.twilio.com/docs/flex/conversations) (SMS is the quickest channel) and send a SMS.
2. Receiving the SMS as an Agent on Flex Desktop: Make sure your task was created nicely on Flex Desktop, just to confirm your Flex Conversation set up was properly done.
3. Receiving the SMS as an Agent on Flex Mobile: Now go to Flex Mobile, toggle the on/off button to ON to move yourself to "Available on Mobile" statuses and see if you have the Task there - then you can click on it and start interacting with the customer.

## Testing the Inbound Calls

Ignore this step for now, you probably haven't installed the `./twilio-functions` folder yet.  We will cover this test scenario there.

## Testing Push Notifications

Ignore this step for now for the same reason as above.

## Building the App

For building the App and later being able to install the .APK file in your Android phone:

1. execute `yarn build`
2. wait for Expo to finish it (it will take a bit less than 15 minutes)
3. Expo will tell the directions on how to install the App on your phone.

## Updating the App

Once you have the App installed in your phone, if you change things on the project, you don't need to build a new .APK file, just doing a `yarn publish` is enough.

You will need to open the App twice in your phone: One to let it install the update in the background (you won't see anything), and minutes later force-close and open again to see the new version published.

How to make sure your code was pushed to your App? Just click on the `gear icon` within the main screen of the App, it will show you the `last update` of it, if it didn't get updated, repeat the force-close-and-open method or force a whole new install doing `yarn build`.
