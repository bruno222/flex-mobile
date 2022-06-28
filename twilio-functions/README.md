## What is it?

These are the functions that need to be deployed on [Twilio Functions](https://www.twilio.com/docs/runtime/functions).

## Why do you need this?

These functions allow Push Notifications and Inbound Calls to work. These functions will be executed once the Agent sets "Available on Mobile". If the Agent is in any other Activity ("Offline" or "Available"), these functions won't run, avoiding sending Push Notifications while the Agent is working on Flex Desktop.

## How to deploy these functions?

1. You probably already did this step, but just to make sure: go to the root folder (`cd ..` from here) and rename `/.env-example` to `/.env` and follow the instructions in the `.env` file.
2. Go back to this folder (`cd ./twilio-functions`) and execute `npm install` to install the packages into your computer.
3. You need to add a file called `service-account.private.json` into [this folder](https://github.com/bruno222/flex-mobile/tree/main/twilio-functions/src/assets). This file will looks like [this example](https://github.com/bruno222/flex-mobile/blob/main/twilio-functions/src/assets/service-account.private.json-EXAMPLE). The [Firebase documentation](https://firebase.google.com/docs/admin/setup) gives the direction on how to do generate and download this file. Keep this file secret, do not commit it to your repository!
4. `npm run deploy` to deploy the functions to your Twilio environment.

## How to hook together these just deployed functions with Twilio?

You have to go to 2 places to set the URL of these just-deployed functions:

** Step 1 of 2 - Taskrouter Event Callbacks**:

1. Go to `Twilio Console > Menu TaskRouter > (select your workspace) > Settings`
2. In the `EVENT CALLBACK URL` field, paste the URL of your `webhook-taskrouter` function. For example, for me it was `https://flex-mobile-7886-dev.twil.io/webhook-taskrouter`.
3. Select `SPECIFIC EVENTS` and then be patient with our bad UX here: You will have to unselect all checkboxes, just leave checked these two: `Reservation Created` and `Worker Activity Updated`
4. Save it.

** Step 2 of 2 - Conversations Event Callbacks**:

1. Go to `Twilio Console > Menu Conversations > Manage > Global webhooks`
2. Paste into `Post-Event URL` the URL of your `webhook-conversation` function. For example, for me it was `https://flex-mobile-7886-dev.twil.io/webhook-conversations`
3. Leave the `Method` as `HTTP POST`
4. On `Post-webhooks` right-hand side of the screen, only select the checkbox `onMessageAdded`.
5. Save it.

Cool! In theory, Inbound Calls and Push notifications should be working now!

## Testing the Inbound Calls

1. If you haven't done yet, get a new Phone Number on th Console and attached it to a Studio Flow to send it to flex. Call once from your celphone and see on Flex Desktop (not on mobile) if you receive it! Make sure you are in "Available" status.

2. Now open the mobile App and toggle the on/off to ON (so you will see, on Flex Desktop the activity will get changed to "Available on Mobile").

3. Call again. Now the call should go to your phone instead!

Not working?

4. Go to `Twilio Console > Menu Functions and Assets > Services > select flex-mobile` and click on `Enable live logs` and Call again... It should show you what is happening there.

## Testing Push Notifications

1. Make sure inbound calls are working first, this means your functions was properly deployed and configured.

2. Make sure you have you have the App installed via the `.APK` file (and not just the `Expo Go`... Push Notifications won't work on `Expo Go`).

3. Also, open at least once the `.APK` and log in properly... This will guarantee the App has saved the `pushToken` into your Worker's attribute.

4. Double-checking if everything is fine until here: Go to `Twilio Console > Menu TaskRouter > (select your workspace) > Worker > (select your worker)` and check in the `Attributes` field if the attribute `pushToken` exists. It should!

5. Now open the mobile App and toggle the on/off to ON (so you will see, on Flex Desktop the activity will get changed to "Available on Mobile"). Pushes won't be sent if you are not on this activity.

6. Now close the Mobile App... Pushes are not visible if the App is open.

7. Pretend to be the customer and send a SMS to your contact center.

If everything goes right, you should receive an Push Notification on your cellphone!

Not working?

8. Go to `Twilio Console > Menu Functions and Assets > Services > select flex-mobile` and click on `Enable live logs` and send another SMS... It should show you what is happening there.
