/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to populate the student-info page with user information from Firebase and allow the user to update their info
*/

//Get the user id when they are signed in
uid = localStorage.getItem('currentUserCS');
console.log("Currently logged in with: " + uid);

//Pull the specific info for a user from the database
function setStudentInfo() {
    firebase.database().ref("users/" + uid).on('value', function (snapshot) {
        //obtain the values and set them to variables
        first = snapshot.val().f_name;
        last = snapshot.val().l_name;
        email = snapshot.val().email;
        address = snapshot.val().address;
        city = snapshot.val().city;
        state = snapshot.val().state;
        zip = snapshot.val().zip;
        gpa = snapshot.val().gpa;
        grade = snapshot.val().grade;

        //Format the data into the html elements
        document.getElementById('userid').textContent = uid;
        document.getElementById('fname').value = first;
        document.getElementById('lname').value = last;
        document.getElementById('email').textContent = email;
        document.getElementById('address').value = address;
        document.getElementById('city').value = city;
        document.getElementById('state').value = state;
        document.getElementById('zip').value = zip;
        document.getElementById('user-gpa').textContent = gpa;

        //Grades are converted into numbers in the database so they are reconverted using if statements on the home page
        if(grade == 1){
            document.getElementById('user-grade').textContent = "HS Freshman";
        }
        else if(grade == 2){
            document.getElementById('user-grade').textContent = "HS Sophomore";
        }
        else if(grade == 3){
            document.getElementById('user-grade').textContent = "HS Junior";
        }
        else if(grade == 4){
            document.getElementById('user-grade').textContent = "HS Senior";
        }
        else if(grade == 5){
            document.getElementById('user-grade').textContent = "College Freshman";
        }
        else if(grade == 6){
            document.getElementById('user-grade').textContent = "College Sophomore";
        }
        else if(grade == 7){
            document.getElementById('user-grade').textContent = "College Junior";
        }
        else if(grade == 8){
            document.getElementById('user-grade').textContent = "College Senior";
        }
    })
}

// When the update button is pressed
document.getElementById('updateStudentInfo').onclick = function () {
    // Get the values from the website
    first = document.getElementById('fname').value;
    last = document.getElementById('lname').value;
    address = document.getElementById('address').value;
    city = document.getElementById('city').value;
    state = document.getElementById('state').value;
    zip = document.getElementById('zip').value;

    // If everything is filled out, update the Firebase database
    if (first && last && address && city && state && zip){
        firebase.database().ref("users/" + uid).update({
            f_name: first,
            l_name: last,
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
    setStudentInfo();
}
