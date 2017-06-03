getInfo();
getUserInfo();

function getInfo() {
  sqlCMD = `select table_rows from information_schema.tables where
       table_schema='CheeseDiary' and
       table_name in ('Cheeses', 'Cheesemakers', 'Cheeseshops', 'Reviews' )`
  var body = {
    "command":sqlCMD
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "/analytics", true);
  xhr.send(JSON.stringify(body));
  xhr.onreadystatechange = processRequest;

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);

      document.getElementById("cheeseCount").innerHTML = response[0][0];
      document.getElementById("cheesemakerCount").innerHTML = response[1][0];
      document.getElementById("cheeseshopCount").innerHTML = response[2][0];
      document.getElementById("reviewCount").innerHTML = response[3][0];
    }
  }
}

function getUserInfo() {
  sqlCMD = `SELECT IsAdmin, COUNT(DISTINCT UserID) FROM Users GROUP BY IsAdmin`
  var body = {
    "command":sqlCMD
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', "/analytics", true);
  xhr.send(JSON.stringify(body));
  xhr.onreadystatechange = processUserRequest;

  function processUserRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);

      document.getElementById("userCount").innerHTML = response[0][1];
      document.getElementById("adminCount").innerHTML = response[1][1];
    }
  }
}
