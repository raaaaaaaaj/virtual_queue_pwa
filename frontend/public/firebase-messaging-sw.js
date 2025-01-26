/* eslint-env serviceworker */
/* global importScripts, firebase */

importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyCj5acURUzk68EBPcxGuoVcpzX4CN5EM40",

  authDomain: "virtual-queue-d8c71.firebaseapp.com",

  projectId: "virtual-queue-d8c71",

  storageBucket: "virtual-queue-d8c71.firebasestorage.app",

  messagingSenderId: "919202359003",

  appId: "1:919202359003:web:42c734861380d6e2268efe",

  measurementId: "G-VRCE228WEM",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
});
