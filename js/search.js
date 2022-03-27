/*
CSE Capstone Project Group 4
Aarya Doshi, Robert Kang, Max Guo, Rhea Chandragiri
June 9, 2021
The purpose of this file is to interface with an API to search for and add colleges for newmycolleges.html
*/

// Function to add colleges to list
function addcollegelist() {
  colname = []
  document.getElementById("listbody").innerHTML = "";
  firebase.database().ref("users/" + uid + "/colleges").on('value', function (snapshot) {

    index = snapshot.numChildren();
    for (var i = 0; i < index; i++) {
      $("#listbody").append("<tr><td>" + snapshot.val()[i] + "</td><td>" + i + "</td></tr>")
    }
  })

}

// When add to list is clicked, add the college to firebase
document.getElementById('addToList').onclick = function () {
  address = document.getElementById('location').value;
  console.log(address);

  if (colleges.includes(address)) {
    addCollegeToFirebase(address);
    document.getElementById('location').value = "";
  }
  addcollegelist();
  //graph()

}

// remove college from firebase based on id
document.getElementById('removeList').onclick = function () {

  // replace the college at the id to remove with the last college
  var idval = document.getElementById('delete').value;
  if (idval) {
    console.log(idval);

    firebase.database().ref("users/" + uid + "/colleges").on('value', function (snapshot) {
      lastIndex = snapshot.numChildren() - 1;
      newVal = snapshot.child(lastIndex)._delegate._node.value_;
    })

    firebase.database().ref("users/" + uid + "/colleges").update({
      [idval]: newVal
    })

    firebase.database().ref("users/" + uid + "/colleges/" + lastIndex).remove();


    addcollegelist();
    document.getElementById('delete').value = "";
  }
}



//uid = "pXyYYLVeWxWJRINAKNltu2dkWTj2";
uid = localStorage.getItem('currentUserCS');
console.log("Currently logged in with: " + uid);

if (uid) {

  addcollegelist();

  //graph()
  document.getElementById("addToList").style.display = "inline";
  document.getElementById("removeList").style.display = "inline";
}
else {
  document.getElementById("addToList").style.display = "none";
  document.getElementById("removeList").style.display = "none";
}



//http://jsfiddle.net/onury/kBQdS/
//dynamic tables so that they update live
var dynamicTable = (function () {

  var _tableId, _table,
    _fields, _headers,
    _defaultText;

  /** Builds the row with columns from the specified names. 
   *  If the item parameter is specified, the memebers of the names array will be used as property names of the item; otherwise they will be directly parsed as text.
   */
  function _buildRowColumns(names, item) {
    var row = '<tr>';
    if (names && names.length > 0) {
      $.each(names, function (index, name) {
        var c = item ? item[name + ''] : name;
        row += '<td>' + c + '</td>';
      });
    }
    row += '</tr>';
    return row;
  }

  /** Builds and sets the headers of the table. */
  function _setHeaders() {
    // if no headers specified, we will use the fields as headers.
    _headers = (_headers == null || _headers.length < 1) ? _fields : _headers;
    var h = _buildRowColumns(_headers);
    if (_table.children('thead').length < 1) _table.prepend('<thead></thead>');
    _table.children('thead').html(h);
  }

  function _setNoItemsInfo() {
    if (_table.length < 1) return; //not configured.
    var colspan = _headers != null && _headers.length > 0 ?
      'colspan="' + _headers.length + '"' : '';
    var content = '<tr class="no-items"><td ' + colspan + ' style="text-align:center">' +
      _defaultText + '</td></tr>';
    if (_table.children('tbody').length > 0)
      _table.children('tbody').html(content);
    else _table.append('<tbody>' + content + '</tbody>');
  }

  function _removeNoItemsInfo() {
    var c = _table.children('tbody').children('tr');
    if (c.length == 1 && c.hasClass('no-items')) _table.children('tbody').empty();
  }

  return {
    /** Configres the dynamic table. */
    config: function (tableId, fields, headers, defaultText) {
      _tableId = tableId;
      _table = $('#' + tableId);
      _fields = fields || null;
      _headers = headers || null;
      _defaultText = defaultText || 'No items to list...';
      _setHeaders();
      _setNoItemsInfo();
      return this;
    },
    /** Loads the specified data to the table body. */
    load: function (data, append) {
      if (_table.length < 1) return; //not configured.
      _setHeaders();
      _removeNoItemsInfo();
      if (data && data.length > 0) {
        var rows = '';
        $.each(data, function (index, item) {
          rows += _buildRowColumns(_fields, item);
        });
        var mthd = append ? 'append' : 'html';
        _table.children('tbody')[mthd](rows);
      }
      else {
        _setNoItemsInfo();
      }
      return this;
    },
    /** Clears the table body. */
    clear: function () {
      _setNoItemsInfo();
      return this;
    }
  };
}());


