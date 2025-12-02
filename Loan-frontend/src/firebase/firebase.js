import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// Create a Set to keep track of shown notifications
const shownNotifications = new Set();

// Initialize Firebase and handle push notifications
export const setupFirebaseNotifications = () => {
  // Create a notification channel (needed for Android 8.0+)
  PushNotification.createChannel(
    {
      channelId: 'default-channel-id',
      channelName: 'Default Channel',
      channelDescription: 'Notifications for Loan App',
      soundName: 'default',
      importance: PushNotification.Importance.HIGH,
      vibrate: true,
    },
    created => console.log(`Create channel returned '${created}'`),
  );

  // Request permission for notifications
  messaging()
    .requestPermission()
    .then(authStatus => {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Notification permission granted:', authStatus);
      }
    })
    .catch(error => console.log('Notification permission error:', error));

  // Handle background notifications when app is in the background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );

    if (remoteMessage.data && remoteMessage.data.screen) {
      // navigation.navigate(remoteMessage.data.screen); // Navigate to the screen
      console.log('Navigating to screen');
    }
  });

  // Handle notifications when the app is fully closed and opened by a notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }

      if (remoteMessage.data && remoteMessage.data.screen) {
        // navigation.navigate(remoteMessage.data.screen); // Navigate to the screen
        console.log('Navigating to screen when application is closed');
      }
    });

  // Handle foreground notifications
  messaging().onMessage(async remoteMessage => {
    console.log(
      'Foreground notification received:',
      remoteMessage.notification,
    );

    console.log('Unique ID', remoteMessage.data.notificationId);

    // Show local notifications in the foreground
    const {title, body} = remoteMessage.notification;
    const notificationId = remoteMessage.data.notificationId;

    // Prevent showing duplicate notifications
    if (!shownNotifications.has(notificationId)) {
      shownNotifications.add(notificationId); // Add notification ID to the set
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: title,
        message: body,
        smallIcon: 'ic_notification',
        playSound: true,
        soundName: 'default',
      });
    } else {
      console.log('Duplicate notification ignored:', notificationId);
    }
  });
};
