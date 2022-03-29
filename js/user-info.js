/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to populate the user-info page with user information from Firebase and allow the user to update their info
*/

//Get the user id when they are signed in
uid = localStorage.getItem('currentUserCS');
console.log("Currently logged in with: " + uid);

//Pull the specific info for a user from the database
function setInfo() {
    firebase.database().ref("users/" + uid).on('value', function (snapshot) {
        //obtain the values and set them to variables
        pname = snapshot.val().Pname;
        email = snapshot.val().email;
        address = snapshot.val().address;
        city = snapshot.val().city;
        state = snapshot.val().state;
        zip = snapshot.val().zip;
        levels = snapshot.val().level;
        rows = snapshot.val().rows;
        columns = snapshot.val().columns;

        //Format the data into the html elements
        document.getElementById('userid').textContent = uid;
        document.getElementById('plot').value = pname;
        document.getElementById('email').textContent = email;
        document.getElementById('address').value = address;
        document.getElementById('city').value = city;
        document.getElementById('state').value = state;
        document.getElementById('zip').value = zip;

        document.getElementById('qr').src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + uid;
        document.getElementById('info-container').style = "width: 50%; float:left;"
        document.getElementById('qr').style = "padding-top: 100px;;"
    })
}

// When the update button is pressed
document.getElementById('updateInfo').onclick = function () {
    // Get the values from the website
    pname = document.getElementById('plot').value;
    address = document.getElementById('address').value;
    city = document.getElementById('city').value;
    state = document.getElementById('state').value;
    zip = document.getElementById('zip').value;

    // If everything is filled out, update the Firebase database
    if (pname && address && city && state && zip){
        firebase.database().ref("users/" + uid).update({
            Pname: pname,
            address: address,
            city: city, 
            state: state,
            zip: zip
        });
        // Alert the user that the action has been completed
        alert("Your information has been updated!")
    }
    else{
        // Alert the user to fill in their information 
        alert("Please make sure to fill in all your information!")
    }
}

// If the user is logged in, read their information
if (uid) {
    setInfo();
}
