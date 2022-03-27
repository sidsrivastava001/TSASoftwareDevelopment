/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to store user inputted comments from the help page in the firebase database
*/

//get the comments form
const commentform = document.querySelector("#comment-form");
var commnum = 0;
//after the submit button is clicked, take the data from the input box and store it in firebase
commentform.addEventListener('submit', (e) => {
  e.preventDefault();
  const comm = commentform['comment-section'].value;
  firebase.database().ref("comments/" + commnum).set({
    comment: comm
  });
  //resets the form after data has been sent to firebase and iterates to a new comment number
  commnum = commnum + 1;
  commentform.reset();


})

