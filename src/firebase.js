import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  apiKey: "AIzaSyD-9Zstvhm1f8KL-YZTO615J5uvVqf3lgM",
  authDomain: "instagram-clone-react-a2b09.firebaseapp.com",
  projectId: "instagram-clone-react-a2b09",
  storageBucket: "instagram-clone-react-a2b09.appspot.com",
  messagingSenderId: "662454353317",
  appId: "1:662454353317:web:45397aaeb9db5949c57c4c",
  measurementId: "G-EBYPW110V1"

});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage()

export { db, auth,storage };
