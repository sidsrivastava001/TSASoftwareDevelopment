/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to create the map and set up related functions for the map feature.
*/

var map;
var markers = [];
var geocoder;


// Initialize and add the map
function initMap() {
  // The location of Rutgers
  const rutgers = { lat: 40.4790, lng: -74.4248 };
  // The map, centered at rutgers
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: rutgers
  });

  // If the user is not logged in, add a default marker for Rutgers
  if (!uid) {
    addMarker(rutgers);
  }

  geocoder = new google.maps.Geocoder();

  document.getElementById('submitLocation').onclick = function () {
    if (address = document.getElementById('location').value) {
      geocodeAddress(geocoder, map);
    } else {
      // change to alert
      console.log("No college entered") // error msg
    }
  }
  
  // when add to list button is clicked
  document.getElementById('addToList').onclick = function () {
    // get the address, and if it is a college, add it to firebase
    address = document.getElementById('location').value;
    if (colleges.includes(address)) {
      addCollegeToFirebase(address);
      document.getElementById('location').value = "";
    }
  }
}

// function to get coordinates from input box, or 3rd parameter for string with location
function geocodeAddress(geocoder, resultsMap, address = document.getElementById('location').value, icon = "") {
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      addMarker(results[0].geometry.location, address, icon);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
}

// function to add a marker to the map based on a set of coordinates, address is just for label
function addMarker(coordinates, address = "", icon = "") {
  //coord = coordinates[location.toLowerCase()]
  //var label = address.split(' ')[0];
  var marker = new google.maps.Marker({
    position: coordinates,
    map: map,
    icon: icon
    //label: label
  });

  // If loggged in, get the home address from Firebase
  if (uid) {
    var homeAddress;
    firebase.database().ref('users/' + uid).on('value', function (snapshot) {
      homeAddress = snapshot.val().address + ", " + snapshot.val().city + ", " + snapshot.val().state + " " + snapshot.val().zip;
    })


    // calculate distance
    marker.addListener("click", () => {
      // If the marker is a college
      if (address != homeAddress) {

        var distanceService = new google.maps.DistanceMatrixService();
        distanceService.getDistanceMatrix({
          origins: [homeAddress],
          destinations: [address],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          durationInTraffic: true,
          avoidHighways: false,
          avoidTolls: false
        },
          function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
              console.log('Error:', status);
            } else {
              console.log(response);

              // Get the distance and driving duration from the college
              var dist = response.rows[0].elements[0].distance.text;
              var dur = response.rows[0].elements[0].duration.text;

              // And display it on the page
              document.getElementById("collegeName").textContent = address
              document.getElementById("collegeDistance").textContent = dist + " from home" 
              document.getElementById("collegeDrivingTime").textContent = dur + " drive from home";
            }
          });
      }

    });

  }

  // send coordinates
  markers.push(coordinates);

  // Extend the bounds
  var bounds = new google.maps.LatLngBounds();
  if (markers.length > 1) {
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i]);
    }
    map.fitBounds(bounds);
  }
}

// Function to add college markers from Firebase
function addMarkersFromFirebase() {
  // Add markers for colleges
  firebase.database().ref('users/' + uid + '/colleges').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      geocodeAddress(geocoder, map, childSnapshot.val())
    })
  })
  // Add marker with address
  firebase.database().ref('users/' + uid).on('value', function (snapshot) {
    fullAddress = snapshot.val().address + ", " + snapshot.val().city + ", " + snapshot.val().state + " " + snapshot.val().zip;
    icon = {
      url: "https://cdn2.iconfinder.com/data/icons/bazza-maps-and-navigation/60/02_-_Home_map_marker-512.png",
      scaledSize: new google.maps.Size(40, 40)
    }
    geocodeAddress(geocoder, map, fullAddress, icon)
  })
}

//uid = "pXyYYLVeWxWJRINAKNltu2dkWTj2";
uid = localStorage.getItem('currentUserCS');
console.log("Currently logged in with: " + uid);

if (uid) {
  addMarkersFromFirebase();
} else {
  document.getElementById("addToList").style.display = "none";
}