import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCj5acURUzk68EBPcxGuoVcpzX4CN5EM40",

  authDomain: "virtual-queue-d8c71.firebaseapp.com",

  projectId: "virtual-queue-d8c71",

  storageBucket: "virtual-queue-d8c71.firebasestorage.app",

  messagingSenderId: "919202359003",

  appId: "1:919202359003:web:42c734861380d6e2268efe",

  measurementId: "G-VRCE228WEM",
};

const vapidKey =
  "BHo0MOG-aA-GDHIIk4xeVmJGLc9l72KL9jUVbuC5j7YYqq1wWC2UR1JQRjilRZkHOrEYZSQsAzNNOksJOVvMmZ0";
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestFCMToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      try {
        const token = await getToken(messaging, { vapidKey });
        console.log("Token:", token);
        return token;
      } catch (tokenError) {
        console.error("Error getting token:", tokenError);
      }
    } else {
      console.error("Permission not granted");
    }
  } catch (permissionError) {
    console.error("Error requesting permission:", permissionError);
  }
}

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
