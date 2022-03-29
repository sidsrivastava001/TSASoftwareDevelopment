/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is set up the Firebase configuration.
*/

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDVf4dLtSTUQuocBnN1Xr_D9UfY0QWdINs",
  authDomain: "tsa2022-2fd1a.firebaseapp.com",
  databaseURL: "https://tsa2022-2fd1a-default-rtdb.firebaseio.com",
  projectId: "tsa2022-2fd1a",
  storageBucket: "tsa2022-2fd1a.appspot.com",
  messagingSenderId: "948588276209",
  appId: "1:948588276209:web:8db030fd8b3910dc92bc50",
  measurementId: "G-KHKYSNRSX2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// update firestore settings
db.settings({ timestampsInSnapshots: true });