document.addEventListener("DOMContentLoaded", function() {
    generateGrid();
}, false);

function generateGrid() {
    var grid = document.getElementById("parking-garage");
    var size, sizearray, spots;
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
                
                if (spots["0" + "x" + String(i) + "x" + String(j)]['exists'] == 1) {
                    column.classList.add("exists");
                    column.classList.remove("noexists");
                    column.innerText = String(i+1) + "x" + String(j+1);
                    column.style.minWidth = "60px";
                    column.style.textAlign = "center";
                    
                } else {
                    column.classList.add("noexists");
                    column.classList.remove("exists");
                }
                if (spots["0" + "x" + String(i) + "x" + String(j)]['taken'] == 0) {
                    column.classList.add("open");
                    column.classList.remove("taken");
                    column.setAttribute("onclick", "reserveSpot(this.id)");
                } else {
                    column.classList.add("taken");
                    column.classList.remove("open");
                }
                
                
                row.appendChild(column);
            }
            grid.appendChild(row);
        }    
    });
}

function reserveSpot(element_id) {
    alert(element_id);
    console.log(String(element_id));
}