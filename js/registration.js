
const signupForm = document.querySelector('#signup-form');    
document.getElementById('dash-btn').style.visibility = 'hidden';

var currentUser;

// firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//         currentUser = user;
//     } else {
//         currentUser = null;
//     }
// })

// function removePeriods(input) {
//     return input.replace(/\./g, "_()");
// }
// function addPeriods(input) {
//     return input.replace(/\_\(\)/g, ".");
// }

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      currentUser = user;
      // ...
    } else {
      // User is signed out
      // ...
      currentUser = null;
    }
  });
  

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const Pname = signupForm['Name'].value;
      var email = signupForm['inputEmail'].value;
      var address = signupForm['inputAddress'].value;
      var city = signupForm['inputCity'].value;
      var state = signupForm['inputState'].value;
      var zip = signupForm['inputZip'].value;
      var rows = signupForm['inputRows'].value;
      var columns = signupForm['inputColumns'].value;
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
            Pname: Pname,
            email: email,
            address: address, 
            city: city, 
            state: state, 
            zip: zip,
            rows: rows,
            columns: columns,
            level: level
        }).then(function() {
            var spotData = {};
            for (var i = 0; i < Number(level); i++) {
                for (var j = 0; j < Number(rows); j++) {
                    for (var k = 0; k < Number(columns); k++) {
                        let key = String(i) + "x" + String(j) + "x" + String(k);
                        spotData[key] = {
                            entrance: 0,
                            exists: 1, 
                            handicapped: 0, 
                            taken: 0
                        } 
                    }
                }
            }
            firebase.database().ref("garages/" + removePeriods(email)).update({
                size: String(level) + "x" + String(rows) + "x" + String(columns),
                spots: spotData
            });
        })
        localStorage.setItem('currentUserCS', credential.user.uid)
        // Alert the user that they have successfully signed up
        alert("Thank you for signing up! Go to the Dashboard by clicking on the button in the top right corner");
        document.getElementById('dash-btn').style.visibility = 'visible';
        window.open('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + uid, '_blank');
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

//block

