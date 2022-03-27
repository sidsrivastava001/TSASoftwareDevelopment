/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to set up the login form so a user can log in to their account.
*/

//grab the login form
const loginForm = document.querySelector("#login-form");
//if the button is clicked, store the information in the input fields
loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    var hold = 0;
    const email = loginForm['loginEmail'].value;
    const password = loginForm['loginPassword'].value;

    //Sign the user into firebase
    auth.signInWithEmailAndPassword(email, password).then(credential => {
        console.log(credential.user)
        localStorage.setItem('currentUserCS', credential.user.uid);
        hold = hold+1;
        window.location = 'dashHome.html';
        document.getElementById('logout-btn').style.visibility = 'visible';

        // Alert the user that they have logged in
        alert("Welcome to the College Compass!");
        //if there is an error, send an error message
      }).catch((error) => {
      if(hold == 0)
      {
        alert("Invalid email or password. Please try again.");
      }
      })
})


//Handle Account Status
firebase.auth().onAuthStateChanged(user => {
  if(user) {
    window.location = 'dashHome.html'; //If User is logged in, redirect to dashboard home page
  }
});

