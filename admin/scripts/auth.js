var token = getCookie('CheeseDiary_token')
var isAdmin = getCookie('CheeseDiary_isAdmin')

if (token == "" || isAdmin == "") {
  window.location.href="/admin/home";
}

if (isAdmin != "1") {
  window.location.href="/admin/home";
}

// TODO: call API to ensure its a valid token

// https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
