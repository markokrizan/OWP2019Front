class API {
  constructor(app) {
    //https://barkwire-api.now.sh/dogs
    //https://github.com/w3cj/c.js

    this.API_URL = 'http://localhost:8080/airline';
    this.app = app;
  }

  //-------------------------------------------------

   //Login:

   buildLoginFormData(username, password){
    let formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    return formData;
  }

   
  login(username, password){
    return fetch(`${this.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: this.buildLoginFormData(username, password)
    })
      //.then(res => res.headers.get('Pragma'))
      .then(res => res.json())
      .catch((err) => {
        //return console.log(err);
        alertify.error('Error message');
      })
  }

  
  
  //Everything else - generic fetch:
  sendRequest(url, method, headers, body){

    document.getElementById("loader").style.display = "block";

    return fetch(
      url, 
      {
        method : method,
        headers: Object.assign(
          {
            "Authorization" : localStorage.getItem("token")
          },
          headers
        ),
        body: body
      })
      .then((res) => {
        //quit loading:
        setTimeout(function(){
          document.getElementById("loader").style.display = "none";
        }, 1000);
      


        if(res.status === 404){
          this.app.showComponent("not_found");
        }else if(res.status === 403){
          this.app.showComponent("forbidden");
        }else if(res.status === 500){
          this.app.showComponent("server_error");
        }else{
          //alertify.success("Loaded");
          return res.json();
        }
        
      })
      .catch((err) => {
        if(err.status === 500){
          this.app.showComponent("server_error");
        }
        //quit loading:
        setTimeout(function(){
          document.getElementById("loader").style.display = "none";
        }, 1000);

        //alertify.error("Error loading");
        //console.log(err);
        return err;
      })
  }

 

  

}



//multiple requests
// let flight = null;
// let ticket = null;
// let airport = null;

// Promise.all([
//   fetch("http://localhost:8080/airline/flight/1"),
//   fetch("http://localhost:8080/airline/ticket/1"),
//   fetch("http://localhost:8080/airline/airport/1")
// ]).then(allResponses => {
//   allResponses[0].text().then((res) => {flight = res})
//   allResponses[1].text().then((res) => {ticket = res})
//   allResponses[2].text().then((res) => {airport = res})
// })

//with my method:
// let flight2 = null;
// let occupiedSeats2 = null;


// Promise.all([
//   api.sendRequest(`${api.API_URL}/flight/${router.params[1]}`, 'GET'),
//   api.sendRequest(`${api.API_URL}/flight/${router.params[1]}/occupied-seats`, 'GET')
// ]).then(allResponses => {
//     flight2 = allResponses[0];
//     occupiedSeats2 = allResponses[1];
// })


// Promise.all([
//   api.sendRequest(`${api.API_URL}/flight/${router.params[1]}`, 'GET'),
//   api.sendRequest(`${api.API_URL}/flight/${router.params[1]}/occupied-seats`, 'GET'),
//   api.sendRequest(`${api.API_URL}/airport`, 'GET')
// ]).then(allResponses => {
//     model.flight.numberOfSeats = allResponses[1];
//     model.airports = allResponses[2];
//     model.flight = allResponses[0];
    
// })