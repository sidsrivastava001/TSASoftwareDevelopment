/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to create a list of all colleges from the API and autocomplete a search bar.
*/

// list of colleges for map search autocomplete
// find way to autofill using api
var colleges = []
var sat = {}
//var act = {}
makeCollegeList()

// Function to make populate the college list with college names and locations from an API
function makeCollegeList() {
  // API url
  // testing api keys (in case reaches limit): nmpiwiRSlxpBGebpgm8kGg3KH3OpaSzQAKPWWznG, 2uWXm8gR5bq66XXg5QqNw8LEaG2UXcFwaGclcmkk, GUq7vJ5yIB2epMGXI0eZBezJJGF2M2YVWmmoqLML
  url = 'https://api.data.gov/ed/collegescorecard/v1/schools.json?{1}api_key=8TDWTWssHrMEJ86uMsNcTsh1x3vV4cXzmNNwGzeo{2}';

  // Parse the API
  fetch(url.replace(/\{\d\}/g, ''))
    .then(res => res.json())
    .then((out) => {
      console.log(url.replace(/\{\d\}/g, ''));
      console.log(out);
      var numSchools = out.metadata.total;
      //var numSchools = 100;
      var perPage = 200;
      var added = 0;
      var duplicate = 0;
      var error = 0;

      // Parse through the different pages to look at every school
      for (var i = 0; i < numSchools; i += perPage) {
        var nameUrl = url.replace('{1}', 'fields=school,latest.admissions&').replace('{2}', "&per_page=" + perPage + "&page=" + (Math.floor(i / perPage)));
        //console.log(i + ": " + nameUrl);
        fetch(nameUrl)
          .then(res => res.json())
          .then((out) => {
            for (var j = 0; j < perPage; j++) {
              //console.log(out);
              // Get the school name, city, and state
              var schoolName = out.results[j]["school.name"];
              var schoolCity = out.results[j]["school.city"];
              var schoolState = out.results[j]["school.state"];

              var fullSchool = schoolName + ", " + schoolCity + ", " + schoolState;


              // Get the school's SAT scores by percentile + average
              if (out.results[j]["latest.admissions.sat_scores.average.overall"] || out.results[j]["latest.admissions.act_scores.midpoint.cumulative"]) {
                //console.log(fullSchool);
                //console.log("average sat: " + out.results[j]["latest.admissions.sat_scores.average.overall"]);
                sat[fullSchool] = [out.results[j]["latest.admissions.sat_scores.average.overall"], out.results[j]["latest.admissions.act_scores.midpoint.cumulative"]];
                //localStorage.setItem('sat', sat);
              }
              
              
              

              /*
              if(out.results[j]["latest.admmissions.act_scores.midpoint.cumulative"]){
                act[fullSchool] = out.results[j]["latest.admissions.act_scores.midpoint.cumulative"];
              }*/

              // Add the school name to the colleges list if it is not a duplicate
              if (!colleges.includes(fullSchool)) {
                colleges.push(fullSchool);
                //console.log("ADDING: " + fullSchool);
                added += 1;
              } else {
                console.log("DUPLICATE: " + fullSchool);
                duplicate += 1;
              }
            }

          }).catch(err => error += 1);
      }
    }).catch(err => console.error(err));

}




// Modelled the following js after https://www.w3schools.com/howto/howto_js_autocomplete.asp
// Function to autocomplete a search bar based off an array
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    count = 0;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        if (count < 6) {
          a.appendChild(b);
          count++;
        }
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

autocomplete(document.getElementById("location"), colleges);