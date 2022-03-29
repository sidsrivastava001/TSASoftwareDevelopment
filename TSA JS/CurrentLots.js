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
function isSignedIn() {
    var signedIn;

    // retrieve status
    if (!localStorage.getItem('currentUserCS')) {
        signedIn = false;
    } else {
        signedIn = true;
    }

    // display button based on status
    if (signedIn) {
        document.getElementById('logout-btn').style.visibility = 'visible';
    } else {
        document.getElementById('logout-btn').style.visibility = 'hidden';
    }
}






// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("level-select").onchange = generateGrid();
// })


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
        generateOptions();
        generateGrid();
        document.getElementById("level-select").addEventListener("change", generateGrid);
        document.getElementById("customize-lot").addEventListener("submit", customizeLot);
        onValue(ref(database, "users/" + uid), (snapshot) => {
            document.getElementById("garage-name").innerText = snapshot.val()['Pname'];
        }, { onlyOnce: true })
    } else {
        uid = null;
        document.getElementById("level-select").addEventListener("change", generateGrid);
        document.getElementById("customize-lot").addEventListener("submit", customizeLot);
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
    console.log("generateOptions")
    removeAllChildren("level-select");
    var size, spots, sizearray;
    if (uid != null) {
        onValue(ref(database, "garages/" + uid), (snapshot) => {
            size = snapshot.val()['size'];
            spots = snapshot.val()['spots'];
            sizearray = [String(size).split("x")[0], String(size).split("x")[1], String(size).split("x")[2]];
            for (let k = 0; k < sizearray[0]; k++) {
                var option = document.createElement("option");
                option.value = k;
                option.innerText = k + 1;
                document.getElementById("level-select").appendChild(option);
            }
            document.getElementById('levels').value = snapshot.val()['size'].split("x")[0];
            document.getElementById('rows').value = snapshot.val()['size'].split("x")[1];
            document.getElementById('columns').value = snapshot.val()['size'].split("x")[2];
        }, {onlyOnce: true});
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

export default function generateGrid() {
    // e.preventDefault();
    // console.log("generateGrid")
    var grid = document.getElementById("parking-garage");
    if (document.getElementById("parking-garage") != null) {
        while (document.getElementById("parking-garage").firstChild) {
            document.getElementById("parking-garage").removeChild(document.getElementById("parking-garage").firstChild);
        }
    }
    // removeAllChildren("level-select");
    var size, sizearray, spots, level;
    level = Number(document.getElementById("level-select").value);
    if (uid != null) {
        onValue(ref(database, "garages/" + uid), (snapshot) => {
            size = snapshot.val()['size'];
            spots = snapshot.val()['spots'];
            // console.log(floors);
            // console.log(columns);
            // console.log(rows);
            //floors, then columns, then rows
            sizearray = [String(size).split("x")[0], String(size).split("x")[1], String(size).split("x")[2]];
            // console.log(sizearray);
            for (let i = 0; i < Number(sizearray[1]); i ++){ 
                // console.log(i);
                //Creating row
                var row = document.createElement('tr');
                row.setAttribute('id', 'row' + String(i + 1));
                row.style.height = "60px";
                //Creating columns within each row
                for (let j = 0; j < Number(sizearray[2]); j++) {
                    var column = document.createElement("td");
                    column.setAttribute("id", String(level) + "x" + String(i) + "x" + String(j));
                    column.style.minWidth = "60px";
                    console.log(column.id, spots[String(level) + "x" + String(i) + "x" + String(j)]);
                    if (spots[String(level) + "x" + String(i) + "x" + String(j)]['entrance'] == 1) {
                        column.classList.add("entrance");
                    } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['handicapped'] == 1) {
                        column.classList.add("handicapped");
                    } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['exists'] == 0) {
                        column.classList.add("noexists")
                    } else {
                        column.classList.add("normal");
                    }
                    column.innerText = String(i + 1) + "x" + String(j + 1);
                    // column.setAttribute("onclick", "toggleState(this.id)");

                  /* column.addEventListener('click', (e) => {
                        e.preventDefault();
                        let id = String(level) + "x" + String(i) + "x" + String(j);
                        toggleState(id);
                        // generateGrid();
                        // generateOptions();
                    })*/
                    var mouseDown = false;
                    column.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        let id = String(level) + "x" + String(i) + "x" + String(j);
                        toggleState(id);
                        mouseDown = true;
                    });
                    window.addEventListener('mouseup', (e) => {
                        mouseDown = false;
                    });

                    column.addEventListener('mouseover', (e) => {
                        e.preventDefault();
                        if (mouseDown) {
                            let id = String(level) + "x" + String(i) + "x" + String(j);
                            toggleState(id);
                        }
                    });

                    column.style.textAlign = "center";
                    row.appendChild(column);
                }
                grid.appendChild(row);
            }
        }, { onlyOnce: true });
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
        // console.log("toggled from noexists to normal")
        // console.log(cell.classList);
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
        // console.log("toggled from normal to handicapped")
        // console.log(cell.classList);
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
        // console.log("toggled from handicapped to entrance")
        // console.log(cell.classList);
    } else if (cell.classList.contains("entrance")) {
        cell.classList.remove("entrance");
        // cell.classList.remove("normal");
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
        // console.log("toggled from entrance to noexists")
        // console.log(cell.classList);
    }
}

function customizeLot(e) {
    e.preventDefault();
    console.log("customize lot")
    // var form = document.getElementById("customize-lot").value;
    var levels = document.getElementById("levels").value;
    var rows = document.getElementById("rows").value;
    var columns = document.getElementById("columns").value;

    var existingSpots;

    onValue(ref(database, "garages/" + uid), (snapshot) => {
        existingSpots = snapshot.val()['spots'];

        var spotData = {};
        for (var i = 0; i < Number(levels); i++) {
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
        // If the new dimensions are all the same or greater than the previous ones
        if (levels - 1 >= Number(snapshot.val()['size'].split("x")[0]) && rows - 1 >= Number(snapshot.val()['size'].split("x")[1]) && columns - 1 >= Number(snapshot.val()['size'].split("x")[2])) {
            
            console.log("Expanding")
            
            set(ref(database, "garages/" + uid), {
                size: String(levels) + "x" + String(rows) + "x" + String(columns),
                spots: spotData
            }).then(function() {
                update(ref(database, "garages/" + uid + "/spots"), existingSpots);
                generateGrid();
                generateOptions();
            });
        } else {
            // Taking out the spots that are not present in the new configuration. 
            console.log("contracting")
            for (var key in existingSpots) {
                // Get the old coordinates of each spot and compare them to the max dimensions of the new parking lot
                var oldlevels = Number(String(key).split("x")[0]);
                var oldrows = Number(String(key).split("x")[1]);
                var oldcolumns = Number(String(key).split("x")[2]);
                // If any of the spot's coordinates are greater than the new dimensions (i.e. outside the new garage size), delete the spot in the existingSpots dict
                if (oldlevels > levels - 1 || oldrows > rows - 1 || oldcolumns > columns - 1) {
                    delete existingSpots[key];
                }
            }
            set(ref(database, "garages/" + uid), {
                size: String(levels) + "x" + String(rows) + "x" + String(columns),
                spots: spotData
            }).then(function() {
                update(ref(database, "garages/" + uid + "/spots"), existingSpots);
                generateGrid();
                generateOptions();
            });
        }

    }, {onlyOnce: true});
}