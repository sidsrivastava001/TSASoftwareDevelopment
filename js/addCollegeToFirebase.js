/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to create a function to add a college to the Firebase database.
*/

// Function to add college with inputted address to Firebase
function addCollegeToFirebase(address) {
  var index;
  var duplicate = false;
  // Refer to the database to determine the number of colleges already added, and if the college is a duplicate
  firebase.database().ref("users/" + uid + "/colleges").on('value', function (snapshot) {
    index = snapshot.numChildren();
    for (var i = 0; i < index; i++) {
      if (address === snapshot.child(i)._delegate._node.value_) {
        duplicate = true;
        break;
      }
    }
  })
  // If not a duplicate, add the college to the database
  if (!duplicate) {
    firebase.database().ref("users/" + uid + "/colleges/").child(index).set(address)
  }
}