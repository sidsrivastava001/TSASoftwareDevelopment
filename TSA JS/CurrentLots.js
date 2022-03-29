import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, update, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVf4dLtSTUQuocBnN1Xr_D9UfY0QWdINs",
  authDomain: "tsa2022-2fd1a.firebaseapp.com",
  databaseURL: "https://tsa2022-2fd1a-default-rtdb.firebaseio.com",
  projectId: "tsa2022-2fd1a",
  storageBucket: "tsa2022-2fd1a.appspot.com",
  messagingSenderId: "948588276209",
  appId: "1:948588276209:web:8db030fd8b3910dc92bc50",
  measurementId: "G-KHKYSNRSX2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();




//logout function
const logout = document.getElementById('logout-btn');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    localStorage.removeItem('currentUserCS');
    console.log("You have signed out.")
    window.location = "index.html";
    isSignedIn();
  });

// check signed in status
function isSignedIn(){
  var signedIn;

  // retrieve status
  if (!localStorage.getItem('currentUserCS')) {
      signedIn = false;
  } else{
      signedIn = true;
  }

  // display button based on status
  if (signedIn){
      document.getElementById('logout-btn').style.visibility = 'visible';
  } else {
      document.getElementById('logout-btn').style.visibility = 'hidden';
  }
}









function removePeriods(input) {
    return input.replace(/\./g, "_()");
}
function addPeriods(input) {
    return input.replace(/\_\(\)/g, ".");
}

var uid;

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user.uid);
        uid = user.uid;
        // generateGrid();
        generateOptions();
        document.getElementById("level-select").onchange = generateGrid();
    } else {
        uid = null;
    }
})

function removeAllChildren(id) {
    if (document.getElementById(id) != null) {
        while (document.getElementById(id).firstChild) {
            document.getElementById(id).removeChild(document.getElementById(id).firstChild);
        }
    }
    
}

function generateOptions() {
    removeAllChildren("level-select");
    var size, spots, sizearray;
    if (uid != null) {
        onValue(ref(database, "/garages/" + uid), (snapshot) => {
            size = snapshot.val()['size'];
            spots = snapshot.val()['spots'];
            sizearray = [String(size).split("x")[0], String(size).split("x")[1], String(size).split("x")[2]];
            for (let k = 0; k < sizearray[0]; k++) {
                var option = document.createElement("option");
                option.value = k;
                option.innerText = k;
                document.getElementById("level-select").appendChild(option);
            }
        })
    }

    // database.ref("garages/" + uid).once("value", function(snapshot) {
    // 	size = snapshot.val()['size'];
    // 	spots = snapshot.val()['spots'];
    // }).then(function() {
    // 	// console.log(floors);
    // 	// console.log(columns);
    // 	// console.log(rows);
    // 	//floors, then columns, then rows
    // 	sizearray = [String(size).split("x")[0], String(size).split("x")[1], String(size).split("x")[2]];
    // 	for (let k = 0; k < sizearray[0]; k++) {
    // 		var option = document.createElement("option");
    // 		option.value = k;
    // 		option.innerText = k;
    // 		document.getElementById("level-select").appendChild(option);
    // 	}
    // })
}

export function generateGrid(e) {
    // e.preventDefault();
    var grid = document.getElementById("parking-garage");
    removeAllChildren("parking-garage");
    // removeAllChildren("level-select");
    var size, sizearray, spots, level;
    level = Number(document.getElementById("level-select").value);
    if (uid != null) {
        onValue(ref(database, "/garages/" + uid), (snapshot) => {
            size = snapshot.val()['size'];
            spots = snapshot.val()['spots'];
            // console.log(floors);
            // console.log(columns);
            // console.log(rows);
            //floors, then columns, then rows
            sizearray = [String(size).split("x")[0], String(size).split("x")[1], String(size).split("x")[2]];
            // console.log(sizearray);
            for (let i = 0; i < Number(sizearray[2]); i ++){ 
                // console.log(i);
                //Creating row
                var row = document.createElement('tr');
                row.setAttribute('id', 'row' + String(i+1));
                row.style.height = "60px";
                //Creating columns within each row
                for (let j = 0; j < Number(sizearray[1]); j++) {
                    var column = document.createElement("td");
                    column.setAttribute("id", String(level) + "x" + String(i) + "x" + String(j));
                    column.style.minWidth = "60px";
                    
                    if (spots[String(level) + "x" + String(i) + "x" + String(j)]['entrance'] == 1) {
                        column.classList.add("entrance");
                    } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['handicapped'] == 1){
                        column.classList.add("handicapped");
                    } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['exists'] == 0) {
                        column.classList.add("noexists")
                    } else {
                        column.classList.add("normal");
                    }
                    column.innerText = String(i+1) + "x" + String(j+1);
                    // column.setAttribute("onclick", "toggleState(this.id)");
                    column.addEventListener('click', (e) => {
                        e.preventDefault();
                        let id = String(level) + "x" + String(i) + "x" + String(j);
                        toggleState(id);
                        generateGrid();
                        generateOptions();
                    })
                    column.style.textAlign = "center";
                    row.appendChild(column);
                }
                grid.appendChild(row);
            }
        });
    }
    // database.ref("garages/" + uid).once("value", function(snapshot) {
    //     size = snapshot.val()['size'];
    //     spots = snapshot.val()['spots'];
    // }).then(function() {
    //     // console.log(floors);
    //     // console.log(columns);
    //     // console.log(rows);
    //     //floors, then columns, then rows
    //     sizearray = [String(size).split("x")[0], String(size).split("x")[1], String(size).split("x")[2]];
    //     // console.log(sizearray);
    //     for (let i = 0; i < Number(sizearray[2]); i ++){ 
    //         // console.log(i);
    //         //Creating row
    //         var row = document.createElement('tr');
    //         row.setAttribute('id', 'row' + String(i+1));
    //         row.style.height = "60px";
    //         //Creating columns within each row
    //         for (let j = 0; j < Number(sizearray[1]); j++) {
    //             var column = document.createElement("td");
    //             column.setAttribute("id", String(level) + "x" + String(i) + "x" + String(j));
    //             column.style.minWidth = "60px";
                
    //             if (spots[String(level) + "x" + String(i) + "x" + String(j)]['entrance'] == 1) {
    //                 column.classList.add("entrance");
    //             } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['handicapped'] == 1){
    //                 column.classList.add("handicapped");
    //             } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['entrance'] == 0 && spots[String(level) + "x" + String(i) + "x" + String(j)]['handicapped'] == 0) {
    //                 column.classList.add("normal");
    //             }
    //             column.innerText = String(i+1) + "x" + String(j+1);
    //             column.setAttribute("onclick", "toggleState(this.id)");
    //             column.style.textAlign = "center";
    //             row.appendChild(column);
    //         }
    //         grid.appendChild(row);
    //     }    
    // });
}

function toggleState(element_id) {
    // alert(element_id);
    console.log(String(element_id));
    // var states = ['normal', 'handicapped', 'entrance', 'noexists'];
    var cell = document.getElementById(element_id);
    //change from not existing to normal spot
    if (cell.classList.contains("noexists")) {
        cell.classList.remove("noexists");
        cell.classList.add("normal");
        var updates = {
            "entrance": 0,
            "exists": 1, 
            "handicapped": 0
        }
        update(ref(database, "garages/" + String(uid) + "/spots/" + String(element_id)), updates);

        // database.ref("garages/" + String(uid) + "/spots/" + String(element_id)).update({
        //     entrance: 0,
        //     exists: 1,
        //     handicapped: 0
        // })
        console.log("toggled from noexists to normal")
        console.log(cell.classList);
    } else if (cell.classList.contains('normal')) {
        cell.classList.remove("normal");
        cell.classList.add("handicapped");
        var updates = {
            "entrance": 0,
            "exists": 1, 
            "handicapped": 1
        }
        update(ref(database, "garages/" + String(uid) + "/spots/" + String(element_id)), updates);
        // database.ref("garages/" + String(uid) + "/spots/" + String(element_id)).update({
        //     entrance: 0,
        //     exists: 1,
        //     handicapped: 1
        // })
        console.log("toggled from normal to handicapped")
        console.log(cell.classList);
    } else if (cell.classList.contains("handicapped")) {
        cell.classList.remove("handicapped");
        cell.classList.add("entrance");
        var updates = {
            "entrance": 1,
            "exists": 1, 
            "handicapped": 0
        }
        update(ref(database, "garages/" + String(uid) + "/spots/" + String(element_id)), updates);
        // database.ref("garages/" + String(uid) + "/spots/" + String(element_id)).update({
        //     entrance: 1,
        //     exists: 1,
        //     handicapped: 0
        // })
        console.log("toggled from handicapped to entrance")
        console.log(cell.classList);
    } else if (cell.classList.contains("entrance")) {
        cell.classList.remove("entrance");
        cell.classList.remove("normal");
        cell.classList.add("noexists");
        var updates = {
            "entrance": 0,
            "exists": 0, 
            "handicapped": 0
        }
        update(ref(database, "garages/" + String(uid) + "/spots/" + String(element_id)), updates);
        // database.ref("garages/" + String(uid) + "/spots/" + String(element_id)).update({
        //     entrance: 0,
        //     exists: 0,
        //     handicapped: 0
        // })
        console.log("toggled from entrance to noexists")
        console.log(cell.classList);
    }
}