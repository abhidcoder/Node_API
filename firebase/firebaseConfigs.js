const { initializeApp } = require("firebase/app");
require('dotenv').config();    


// Firebase configuration

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);

module.exports = {fireBaseApp};



//FireBase Used Rules

/*

rules_version = '2';

// Craft rules based on data in your Firestore database
//allow write: if firestore.get(
 // /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}

*/