let addFlightComponent = {
    name : 'addFlight',
    model: {
      flight : {
        number : null,
        departure : null,
        arrival: null,
        flyingFrom : {},
        flyingTo : {},
        numberOfSeats : null,
        price : null
      },
      airports : []
    },
    view(model){
      if(localStorage.getItem("role") !== "ADMIN"){
        app.showComponent("forbidden");
      }

      return addFlightTemplate(model.flight, model.airports);
    },
    controller(model){
      api
        .sendRequest(`${api.API_URL}/airport/`, 'GET')
        .then(result => {
          model.airports = result;
        });
    },
  
    validate(number, depDate, depTime, arrDate, arrTime, depAirport, arrAirport, noSeats, price){
      let validationMessage = "";
      if(/^[a-z0-9]/.test(number) === false){
        validationMessage += "&bull; Number must be at least one lowercase a - z letter or digit 0 - 9!\n";
      }else{
        this.model.flight.number = number;
      }
      if(depDate < Date.now()){
        validationMessage += "&bull; Departure date must be greater than today!\n";
      }else{
        this.model.flight.departure = depDate;
      }
      if(depTime === null || depTime === ""){
        validationMessage += "&bull; Provide a valid departure time!\n";
      }else{
        this.model.flight.departure = this.model.flight.departure + " " + depTime + ":00";
      }
      if(arrDate < depDate){
        validationMessage += "&bull; Arrival date must be greater than departure!\n";
      }else{
        this.model.flight.arrival = arrDate;
      }
      if(arrTime === null || arrTime === ""){
        validationMessage += "&bull; Provide a valid arrival time!\n";
      }else{
        this.model.flight.arrival = this.model.flight.arrival + " " + arrTime + ":00";
      }
      if(arrAirport === depAirport){
        validationMessage += "&bull; Arrival airport must be different from departure!\n";
      }else{
        this.model.flight.flyingFrom.id = depAirport;
        this.model.flight.flyingTo.id = arrAirport;
      }
      if(noSeats <= 0 || noSeats > 200){
        validationMessage += "&bull; No. of seats must be between 0 and 200!\n";
      }else{
        this.model.flight.numberOfSeats = noSeats;
      }
      if(price <= 0 || price > 100000){
        validationMessage += "&bull; Price must be between 0 and 100.000!\n";
      }else{
        this.model.flight.price = price;
      }
      return validationMessage;
    },
    eventHandler(e){
      let numberInput  = document.getElementById("numberInput").value;
      let departureDateInput  = document.getElementById("departureDateInput").value;
      let departureTimeInput = document.getElementById("departureTimeInput").value;
      let arrivalDateInput = document.getElementById("arrivalDateInput").value;
      let arrivalTimeInput = document.getElementById("arrivalTimeInput").value;
      let departureAirportInput = document.getElementById("departureAirportSelections").value;
      let arrivalAirportInput = document.getElementById("arrivalAirportSelections").value;
      let numberOfSeatsInput = document.getElementById("numberOfSeatsInput").value;
      let priceInput = document.getElementById("priceInput").value;
  
      let validationMessage = this.validate(numberInput, departureDateInput, departureTimeInput, arrivalDateInput, arrivalTimeInput, 
        departureAirportInput, arrivalAirportInput, numberOfSeatsInput, priceInput);
  
    
      if(validationMessage === ""){
        //pass:
        //console.log(this.model.flight);
        api
          .sendRequest(`${api.API_URL}/flight/create`, 'POST', {}, JSON.stringify(this.model.flight))
          .then(result => {
            //console.log(result);
            if(result.status === "error"){
              alertify.notify(result.trace, 'error', 10);
            }else{
              alertify.success("Flight with id " + result.id + " added succesfully!", 1, function(){
                window.location.replace(app.baseURI + "flights");
              });
            }
          });
      }else{
        //fail:
        alertify.notify(validationMessage, 'error', 10);
      }
      
  
    },
    registerListeners(){
      let self = this;
  
      let submitButton = document.getElementById("createFlightButton");
      submitButton.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      
      
    }
  }