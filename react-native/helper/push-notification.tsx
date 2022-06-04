import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 
 When sending:

    const message: TokenMessage = {
      notification: {
        title: 'Price drop2',
        body: '5% off all electronics FIM2',
      },
      data: {
        bruno: 'show',
      },
      token: registrationToken,
    };


  If the App is opened, this is received:

      '@@Push - notification', { request: 
          { trigger: 
            { remoteMessage: 
                { originalPriority: 2,
                  sentTime: 1654357461828,
                  notification: 
                  { usesDefaultVibrateSettings: false,
                    color: null,
                    channelId: null,
                    visibility: null,
                    sound: null,
                    tag: null,
                    bodyLocalizationArgs: null,
                    imageUrl: null,
                    title: 'Price drop2',
                    vibrateTimings: null,
                    ticker: null,
                    eventTime: null,
                    body: '5% off all electronics FIM2',
                    titleLocalizationKey: null,
                    notificationPriority: null,
                    icon: null,
                    usesDefaultLightSettings: false,
                    sticky: false,
                    link: null,
                    titleLocalizationArgs: null,
                    bodyLocalizationKey: null,
                    usesDefaultSound: false,
                    clickAction: null,
                    localOnly: false,
                    lightSettings: null,
                    notificationCount: null },
                  data: { bruno: 'show' },
                  to: null,
                  ttl: 2419200,
                  collapseKey: 'com.bruno222.flexmobile',
                  messageType: null,
                  priority: 2,
                  from: '983992601449',
                  messageId: '0:1654357461835175%64e43b9064e43b90' },
              channelId: null,
              type: 'push' },
            content: 
            { title: null,
              badge: null,
              autoDismiss: true,
              data: null,
              body: null,
              sound: 'default',
              sticky: false,
              subtitle: null },
            identifier: '0:1654357461835175%64e43b9064e43b90' },
        date: 1654357461828 }

  If the App is running and user clicks in the push notification, this is received:

      '@@Push - response', { notification: 
          { request: 
            { trigger: 
                { remoteMessage: 
                  { originalPriority: 2,
                    sentTime: 1654357636691,
                    notification: 
                      { usesDefaultVibrateSettings: false,
                        color: null,
                        channelId: null,
                        visibility: null,
                        sound: null,
                        tag: null,
                        bodyLocalizationArgs: null,
                        imageUrl: null,
                        title: 'Price drop2',
                        vibrateTimings: null,
                        ticker: null,
                        eventTime: null,
                        body: '5% off all electronics FIM2',
                        titleLocalizationKey: null,
                        notificationPriority: null,
                        icon: null,
                        usesDefaultLightSettings: false,
                        sticky: false,
                        link: null,
                        titleLocalizationArgs: null,
                        bodyLocalizationKey: null,
                        usesDefaultSound: false,
                        clickAction: null,
                        localOnly: false,
                        lightSettings: null,
                        notificationCount: null },
                    data: { bruno: 'show' },
                    to: null,
                    ttl: 2419200,
                    collapseKey: 'com.bruno222.flexmobile',
                    messageType: null,
                    priority: 2,
                    from: '983992601449',
                    messageId: '0:1654357636697789%64e43b9064e43b90' },
                  channelId: null,
                  type: 'push' },
              content: 
                { title: null,
                  badge: null,
                  autoDismiss: true,
                  data: null,
                  body: null,
                  sound: 'default',
                  sticky: false,
                  subtitle: null },
              identifier: '0:1654357636697789%64e43b9064e43b90' },
            date: 1654357636691 },
        actionIdentifier: 'expo.modules.notifications.actions.DEFAULT' }
 */

// Handling incoming notifications when the app is not in the foreground
// Doc https://docs.expo.dev/versions/latest/sdk/notifications/#example
// TODO: It never gets triggered! Why?!?!?
//
// const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
// TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
//   console.log('@@Push - Background Notification - data', data);
//   console.log('@@Push - Background Notification - error', error);
//   console.log('@@Push - Background Notification - executionInfo', executionInfo);
// });
// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

const _handleNotification = (notification: any) => {
  console.log('@@Push - notification', notification);
};

const _handleNotificationResponse = (response: any) => {
  console.log('@@Push - response', response);
};

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS !== 'android') {
    console.log('Ignoring Push Notification, not an Android device...');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Was super hard to make Push notification through Expo work.
  // I end up giving up, in favour of direct push (via FCM, using getDevicePushTokenAsync),
  // instead of using Expo (getExpoPushTokenAsync)
  //
  // const token = await Notifications.getExpoPushTokenAsync({
  //   experienceId: '@bruno222/flex-mobile', // really needed?! why?
  // }).data

  const token = (await Notifications.getDevicePushTokenAsync()).data;

  console.log('@@Push - token', token);

  // Only for Android:
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });

  // When App is running, should we show the push notifications?
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // Doc https://docs.expo.dev/versions/latest/sdk/notifications/#examples-4
  Notifications.addNotificationReceivedListener(_handleNotification);
  Notifications.addNotificationResponseReceivedListener(_handleNotificationResponse);
  return token;
};
