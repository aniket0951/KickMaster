// import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export async function requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//         console.log('Authorization status:', authStatus);
//         await getFCMToken();
//     }
// }

export const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log('Data stored successfully!');
    } catch (error) {
      console.log('Error storing data: ', error);
    }
};

const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // console.log('Data retrieved successfully:', value);
        return value;
      } else {
        console.log('No data found for the key:', key);
        return null;
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
      return null;
    }
};

const removeLocalData = async (key) => {
    try {

        if (key != undefined) {
            await AsyncStorage.removeItem(key);
            console.log("Local Data has been removed..");
        }
    } catch (error) {
        return null
    }
}

// // store the fcm token to the server
// const storeFCMToken=(token)=>{
//     const requestBody={
//         "token":token
//     }
//     console.log("Generated token : ", token);
//     axios
//         .post(ENDPOINTS.SAVE_FCM_TOKEN, requestBody,  { headers:getHeaders })
//         .then(response => {
//             console.log("Save FCM Token Response : ", response);
//         })
//         .catch(error => {
//             console.log("Save FCM Token Response Error : ", error, ENDPOINTS.SAVE_FCM_TOKEN);
//             removeLocalData()
//         })
// }

// // Function to get and store FCM token
// async function getFCMToken() {
//     try {
        

//         getData('fcm_token').then(async (token) => {
//             if (!token) {
//                 fcmtoken = await messaging().getToken();
//                 storeData("fcm_token", fcmtoken)
//                 storeFCMToken(fcmtoken);
//             }
//         });

//         // if (fcmtoken) {
//         //     console.log('FCM Token:', fcmtoken);
//         // } else {
//         //     console.log('FCM Token not available');
//         // }
//     } catch (error) {
//         console.log('Error in FCM token:', error);
//     }
// }

// // // Function to create a notification channel (should be called once at app startup)
// const createNotificationChannel = () => {
//     const channelId = 'your-channel-id'; // Replace with the desired channel ID
//     const channelConfig = {
//         channelId,
//         channelName: 'Your Channel Name',
//         channelDescription: 'Your Channel Description',
//         playSound: true,
//         soundName: 'default',
//     };

//     PushNotification.channelExists(channelId, exists => {
//         if (!exists) {
//             PushNotification.createChannel(channelConfig, created => {
//                 if (created) {
//                     console.log('Notification channel created successfully');
//                 } else {
//                     console.log('Failed to create notification channel');
//                 }
//             });
//         } else {
//             console.log('Notification channel already exists');
//         }
//     });
// };


// // Initialize the notification channel at app startup
// createNotificationChannel();

// // Function to handle notifications
// export const NotificationListener = () => {
//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log(
//             'Notification caused app to open from background state:',
//             remoteMessage.notification,
//         );
//         // Handle the notification, e.g., navigate to a specific screen
//     });

//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log(
//                     'Notification caused app to open from quit state:',
//                     remoteMessage.notification,
//                 );
//                 // Handle the notification, e.g., navigate to a specific screen
//             }
//         });

//     messaging().onMessage(async remoteMessage => {
//         console.log("FORGROUND msg new", remoteMessage);
//         const { notification } = remoteMessage;
//         const imageUrl = notification?.android?.imageUrl;
//         PushNotification.localNotification({
//             channelId:'your-channel-id',
//             title: notification.title,
//             message: notification.body,
//             // bigPictureUrl: imageUrl || "../../../images/skroman_black_logo.png", // Use a property to specify the image URL
//             bigPictureUrl: imageUrl || "https://choiceinteriors.in/image/cache/catalog/brand/Skroman-Logo-600x315w.jpg", // Use a property to specify the image URL

//         });
//         // if (imageUrl) {
//         //     FastImage.preload([{ uri: imageUrl }]);
//         // }
//     });
// };



