let flightComponent = {
    name: 'flight',
    model: {
      flight: {},
      //hacky solution (avoid proxify):
      change: {
        changedFlight : null
      },
      seatsLeft: null,
      flightReservations : [],
      flightTickets : [],
      airports : []
    },
    view(model){
      if(localStorage.getItem("role") === "ADMIN"){
  
          let reservationRows = model.flightReservations.reduce((html, ticket) => html + flightTicketsRow(ticket, model.flight.id), '');
          let reservationsTable = flightResevationsTableTemplate(reservationRows);
  
          let ticketRows = model.flightTickets.reduce((html, ticket) => html + flightTicketsRow(ticket, model.flight.id), '');
          let ticketsTable = flightTicketsTableTemplate(ticketRows);
  
          return flightTemplate(model.flight, model.seatsLeft) + 
                 changeFlightTemplate(model.flight, model.airports) +
                 flightReservationsTicketsOverviewTemplate(reservationsTable, ticketsTable);
      }else{
        return flightTemplate(model.flight, model.seatsLeft);
      }
     
    },
    controller(model){
        Promise.all([
          api.sendRequest(`${api.API_URL}/flight/${router.params[1]}`, 'GET'),
          api.sendRequest(`${api.API_URL}/flight/${router.params[1]}/occupied-seats`, 'GET'),
          api.sendRequest(`${api.API_URL}/airport`, 'GET'),
          api.sendRequest(`${api.API_URL}/flight/${router.params[1]}/tickets`, 'GET')
        ]).then(allResponses => {
            if(allResponses[0].status === "error"){
                app.showComponent("not_found");
            }

            model.flight = allResponses[0];

            model.seatsLeft = model.flight.numberOfSeats - allResponses[1].length;
            model.airports = allResponses[2];
  
            let reservations = [];
            let tickets = [];
            allResponses[3].forEach(function(element) {
              if(element.ticketSaleDate === null){
                reservations.push(element);
              }else{
                tickets.push(element);
              }
            });
            model.flightReservations = reservations;
            model.flightTickets = tickets;
  
        })
    },
    validate(arrDate, arrTime, depAirport, arrAirport, noOfSeats, price){
      
      let validationMessage = "";

      if(arrDate === null || arrDate === "" || arrDate < this.model.flight.departure){
        validationMessage += "&bull; Provide a valid arrival time!\n";
      }else{
        this.model.change.changedFlight.arrival = arrDate;
      }
      if(arrTime === null || arrTime === ""){
        validationMessage += "&bull; Provide a valid arrival time!\n";
      }else{
        this.model.change.changedFlight.arrival = this.model.change.changedFlight.arrival + " " + arrTime + ":00";
      }
      if(arrAirport === depAirport){
        validationMessage += "&bull; Arrival airport must be different from departure!\n";
      }else{
        this.model.change.changedFlight.flyingFrom.id = depAirport;
        this.model.change.changedFlight.flyingTo.id = arrAirport;
      }
      if(noOfSeats <= 0 || noOfSeats > 200){
        validationMessage += "&bull; No. of seats must be between 0 and 200!\n";
      }else{
        this.model.change.changedFlight.numberOfSeats = noOfSeats;
      }
      if(price <= 0 || price > 100000){
        validationMessage += "&bull; Price must be between 0 and 100.000!\n";
      }else{
        this.model.change.changedFlight.price = price;
      }

      return validationMessage;

    },
    eventHandler(e){
      let elementId = e.id;

      let descendingReservations = false;
      let descendingTickets = false;
      try {
        descendingReservations = document.getElementById("sortReservationsDescending").checked;
        descendingTickets = document.getElementById("sortTicketsDescending").checked;
      }
      catch(error) {
        console.error(error);
      }

      switch(elementId) {
        //sort:
        case "reserveButton":
          //jump to step 2 of /reserve component and insert current airport
          window.location.replace(`http://localhost/airline-app/#/reserve/${this.model.flight.id}`);
          break;
        case "updateFlightButton":
          this.model.change.changedFlight = this.model.flight;

          let changeArrivalDate = document.getElementById("changeArrivalDate").value;
          let changeArrivalTime = document.getElementById("changeArrivalTime").value;
          let changeDepartureAirport = document.getElementById("departureAirportSelections").value;
          let changeArrivalAirport = document.getElementById("arrivalAirportSelections").value;
          let changeNumberOfSeats = document.getElementById("flightChangeNumberOfSeats").value;
          let changePrice = document.getElementById("flightChangePrice").value;

          let validationMessage = this.validate(changeArrivalDate, changeArrivalTime, changeDepartureAirport, changeArrivalAirport, changeNumberOfSeats, changePrice);

          if(validationMessage === ""){
            //pass:
            //console.log(this.model.flight);
            api
              .sendRequest(`${api.API_URL}/flight/update`, 'PUT', {}, JSON.stringify(this.model.change.changedFlight))
              .then(result => {
                //console.log(result);
                if(result.status === "error"){
                  alertify.notify(result.trace, 'error', 10);
                }else{
                  alertify.success("Flight with id " + result.id + " changed succesfully!", 1, function(){
                    window.location.replace(app.baseURI + "flights");
                  });
                }
              });
          }else{
            //fail:
            alertify.notify(validationMessage, 'error', 10);
          }



          break;
        case "deleteFlightButton":
          api
          .sendRequest(`${api.API_URL}/flight/${this.model.flight.id}/delete`, 'DELETE')
          .then(result => {
            //console.log(result);
            if(result.status === "error"){
              alertify.notify(result.trace, 'error', 10);
            }else{
              alertify.success("Flight with id deleted succesfully!", 1, function(){
                window.location.replace(app.baseURI + "flights");
              });
            }
          });
          break;
        case "sortReservationsByDate":
          this.model.flightReservations = app.collectionSorter(this.model.flightReservations, "reservationDate", descendingReservations);
          break;
        case "sortReservationsBySeat":
          this.model.flightReservations = app.collectionSorter(this.model.flightReservations, "departureFlightSeatNumber", descendingReservations);
          this.model.flightReservations = app.collectionSorter(this.model.flightReservations, "arrivalFlightSeatNumber", descendingReservations);
          break;
        case "sortTicketsByDate":
          this.model.flightTickets = app.collectionSorter(this.model.flightTickets, "ticketSaleDate", descendingTickets);
          break;
        case "sortTicketsBySeat":
          this.model.flightTickets = app.collectionSorter(this.model.flightTickets, "departureFlightSeatNumber", descendingTickets);
          this.model.flightTickets = app.collectionSorter(this.model.flightTickets, "arrivalFlightSeatNumber", descendingTickets);
          break;
      }
      
  
      
    },
    registerListeners(){
      let self = this;
      //only if departure dates are greater than now allow reserve button functionality:
      if(this.model.flight.departure < Math.round((new Date()).getTime())){
        document.getElementById("reserveButton").classList.add("disabled");
  
      }else{
        document.getElementById("reserveButton").addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        });
      }
  
      //set departure and arrival airports for the dropdown menus:
      try {
        document.getElementById("departureAirportSelections").value = this.model.flight.flyingFrom.id;
        document.getElementById("arrivalAirportSelections").value = this.model.flight.flyingTo.id;
      }
      catch(err) {
        console.log(err);
      }

      // document.getElementById("departureAirportSelections").value = this.model.flight.flyingFrom.id;
      // document.getElementById("arrivalAirportSelections").value = this.model.flight.flyingTo.id;
  
      if(localStorage.getItem("role") === "ADMIN"){
        //save button:
        document.getElementById("updateFlightButton").addEventListener("click", function(){
          self.eventHandler(this);
        }, false);

        document.getElementById("deleteFlightButton").addEventListener("click", function(){
          self.eventHandler(this);
        }, false);
    
    
        //sorting:
        let reservationDateSortButton = document.getElementById("sortReservationsByDate");
        let reservationsSeatSortButton = document.getElementById("sortReservationsBySeat");
        let ticketDateSortButton = document.getElementById("sortTicketsByDate");
        let ticketSeatSortButton = document.getElementById("sortTicketsBySeat");
        reservationDateSortButton.addEventListener("click", function(){
          self.eventHandler(this);
        }, false);
        reservationsSeatSortButton.addEventListener("click", function(){
          self.eventHandler(this);
        }, false);
        ticketDateSortButton.addEventListener("click", function(){
          self.eventHandler(this);
        }, false);
        ticketSeatSortButton.addEventListener("click", function(){
          self.eventHandler(this);
        }, false);
      }
      
      
    }
  }