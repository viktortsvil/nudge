// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const FIREBASE_API_KEY='AIzaSyBuvY-WLMSsr9mz6zW9vAx-Wq6eFMTQfvE'
const FIREBASE_AUTH_DOMAIN='taskscheduler-429019.firebaseapp.com'
const FIREBASE_PROJECT_ID='taskscheduler-429019'
const FIREBASE_STORAGE_BUCKET='taskscheduler-429019.appspot.com'
const FIREBASE_MESSAGING_SENDER_ID='327223369173'
const FIREBASE_APP_ID='1:327223369173:web:543ad48de9c75fd947315c'

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
