/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to set up the log out button so a user can log out of their account.
*/

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

