function savePayloadData(){
    let token = localStorage.getItem("token");
    let tokenParts = token.split(".");
    //let payload = atob(tokenParts[1]);
    let payload = b64DecodeUnicode(tokenParts[1]);
    let parsedObject = JSON.parse(payload);
    console.log(parsedObject);
    localStorage.setItem("userId", parsedObject["userId"]);
    localStorage.setItem("userName", parsedObject["userName"]);
    localStorage.setItem("firstName", parsedObject["firstName"]);
    localStorage.setItem("lastName", parsedObject["lastName"]);
    localStorage.setItem("blocked", parsedObject["blocked"]);
    localStorage.setItem("role", parsedObject["role"]);

    
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
