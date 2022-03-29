/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to set up the log out button so a user can log out of their account.
*/


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, update, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVf4dLtSTUQuocBnN1Xr_D9UfY0QWdINs",
  authDomain: "tsa2022-2fd1a.firebaseapp.com",
  databaseURL: "https://tsa2022-2fd1a-default-rtdb.firebaseio.com",
  projectId: "tsa2022-2fd1a",
  storageBucket: "tsa2022-2fd1a.appspot.com",
  messagingSenderId: "948588276209",
  appId: "1:948588276209:web:8db030fd8b3910dc92bc50",
  measurementId: "G-KHKYSNRSX2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);






//logout function
const logout = document.getElementById('logout-btn');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    localStorage.removeItem('currentUserCS');
    console.log("You have signed out.")
    window.location = "index.html";
    isSignedIn();
  });

// check signed in status
function isSignedIn(){
  var signedIn;

  // retrieve status
  if (!localStorage.getItem('currentUserCS')) {
      signedIn = false;
  } else{
      signedIn = true;
  }

  // display button based on status
  if (signedIn){
      document.getElementById('logout-btn').style.visibility = 'visible';
  } else {
      document.getElementById('logout-btn').style.visibility = 'hidden';
  }
}

