/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is set up the Firebase configuration.
*/

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBenCE-6UKf_a88Nn-a9e0DmYRNebvzAO8",
  authDomain: "capstone-4-290c7.firebaseapp.com",
  databaseURL: "https://capstone-4-290c7-default-rtdb.firebaseio.com",
  projectId: "capstone-4-290c7",
  storageBucket: "capstone-4-290c7.appspot.com",
  messagingSenderId: "1048776949916",
  appId: "1:1048776949916:web:6fb765b278c1ac9fbded59"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// update firestore settings
db.settings({ timestampsInSnapshots: true });