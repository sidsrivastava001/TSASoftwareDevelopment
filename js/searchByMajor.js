/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is make the collapsible content on searchByMajor.html interactive
*/

var coll = document.getElementsByClassName("collapsible");
var i;

// will expand to be size of text 
for (i = 0; i < coll.length; i++) {
  // will expand when clicked
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    // if hidden, make visible
    if (content.style.display === "block") {
      content.style.display = "none";
    } 
    // if visible, make hidden
    else {
      content.style.display = "block";
    }
  });
}