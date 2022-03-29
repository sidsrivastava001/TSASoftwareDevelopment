document.addEventListener("DOMContentLoaded", function() {
    generateGrid();
    generateOptions();
}, false);

function removeAllChildren(id) {
    var e = document.getElementById(id);
    var child = e.firstElementChild; 
    while (child) {
        e.removeChild(child);
        child = e.firstElementChild;
    }
}

function generateOptions() {
    removeAllChildren("level-select");
    firebase.database().ref("garages/garage1").once("value", function(snapshot) {
        size = snapshot.val()['size'];
        spots = snapshot.val()['spots'];
    }).then(function() {
        // console.log(floors);
        // console.log(columns);
        // console.log(rows);
        //floors, then columns, then rows
        sizearray = [String(size).split("x")[0], String(size).split("x")[1], String(size).split("x")[2]];
        for (let k = 0; k < sizearray[0]; k++) {
            var option = document.createElement("option");
            option.value = k;
            option.innerText = k;
            document.getElementById("level-select").appendChild(option);
        }
    })
}

function generateGrid(e) {
    // e.preventDefault();
    var grid = document.getElementById("parking-garage");
    removeAllChildren("parking-garage");
    // removeAllChildren("level-select");
    var size, sizearray, spots, level;
    level = Number(document.getElementById("level-select").value);
    firebase.database().ref("garages/garage1").once("value", function(snapshot) {
        size = snapshot.val()['size'];
        spots = snapshot.val()['spots'];
    }).then(function() {
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
                column.setAttribute("id", String(i) + "x" + String(j));
                column.style.minWidth = "60px";
                
                if (spots[String(level) + "x" + String(i) + "x" + String(j)]['entrance'] == 1) {
                    column.classList.add("entrance");
                } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['handicapped'] == 1){
                    column.classList.add("handicapped");
                } else if (spots[String(level) + "x" + String(i) + "x" + String(j)]['entrance'] == 0 && spots[String(level) + "x" + String(i) + "x" + String(j)]['handicapped'] == 0) {
                    column.classList.add("normal");
                }
                column.innerText = String(i+1) + "x" + String(j+1);
                column.setAttribute("onclick", "toggleState(this.id)");
                column.style.textAlign = "center";
                row.appendChild(column);
            }
            grid.appendChild(row);
        }    
    });
}

function toggleState(element_id) {
    // alert(element_id);
    // console.log(String(element_id));
    // var states = ['normal', 'handicapped', 'entrance'];
    var cell = document.getElementById(element_id);
    if (cell.classList.contains("noexists")) {
        cell.classList.remove("noexists");
        cell.classList.add("normal");
    } else if (cell.classList.contains('normal')) {
        cell.classList.remove("normal");
        cell.classList.add("handicapped");
    } else if (cell.classList.contains("handicapped")) {
        cell.classList.remove("handicapped");
        cell.classList.add("entrance");
    } else if (cell.classList.contains("entrance")) {
        cell.classList.remove("entrance");
        cell.classList.add("noexists");
    }
}