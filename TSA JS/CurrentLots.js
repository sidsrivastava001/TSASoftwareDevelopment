function generateGrid() {
    var grid = document.getElementById("parking-garage");
    var size;
    firebase.database().ref("garages/garage1").once("value", function(snapshot) {
        size = snapshot.val()['size'];
    });
}