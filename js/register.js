/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to set up the register form so a user can create an account.
*/


//sign up
const signupForm = document.querySelector('#signup-form');    
document.getElementById('dash-btn').style.visibility = 'hidden';

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const f_name = signupForm['First_Name'].value;
    const l_name = signupForm['Last_Name'].value;
    var email = signupForm['inputEmail'].value;
    var address = signupForm['inputAddress'].value;
    var city = signupForm['inputCity'].value;
    var state = signupForm['inputState'].value;
    var zip = signupForm['inputZip'].value;
    var spots = signupForm['inputSpot'].value;
    var hand = signupForm['inputHand'].value;
    var level = signupForm['inputLevel'].value;

    //var email1 = removePeriods(email);
    const password = signupForm['inputPassword'].value;

    console.log(email, password);
    //sign up the user
    //create User With Email And Password is an asynchronous task, so the then() method tells JS what to do afterward
    auth.createUserWithEmailAndPassword(email, password)
    .then(credential => {
        console.log(credential.user);
        var uid = credential.user.uid;

        console.log("User ID: " + uid);
        // Set the values in Firebase
        firebase.database().ref("users/"+uid).set({
            f_name: f_name,
            l_name: l_name,
            email: email,
            address: address, 
            city: city, 
            state: state, 
            zip: zip,
            spots: spots, 
            hand: hand,
            level: level
        });
        localStorage.setItem('currentUserCS', credential.user.uid)
        // Alert the user that they have successfully signed up
        alert("Thank you for signing up! Go to the Dashboard by clicking on the button in the top right corner");
        document.getElementById('dash-btn').style.visibility = 'visible';

        signupForm.reset();
    })
    // Error checking + messages to user
    .catch((error) => {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
        if (error.code == "auth/email-already-in-use") {
            console.log(error.message + " Please use another email address.");
            alert("This email address is already in use, please use another.")
        }
        else if (error.code == "auth/invalid-email") {
            console.log(error.message + " Please use a valid email");
            alert("Please use a valid email.")
        }
        else if (error.code == "auth/operation-not-allowed") {
            console.log(error.message + " Signing in with email and password not allowed. Contact site admin");
            alert("Signing in with email and password not allowed. Please contact site admin.");
        }
        else if (error.code == "auth/weak-password") {
            console.log(error.message + " Password is not strong enough");
            alert("Please use a stronger password.")
        }
    
    });
});
