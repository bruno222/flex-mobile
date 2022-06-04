import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('@@Push - token', token);

  // Only for Android:
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  Notifications.addNotificationReceivedListener(_handleNotification);
  Notifications.addNotificationResponseReceivedListener(_handleNotificationResponse);

  return token;
};
