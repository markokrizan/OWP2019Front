let ticketComponent = {
    name : 'ticket',
    model: {
      ticket : {},
      reservation : null,
      departureSeats : [],
      arrivalSeats : [],
      mock : 0,
  
      currentSeats: {
        departure : null,
        arrival : null
      },
  
      selections: {
        departure : null,
        arrival : null
      }
  
  
    },
    view(model){  
      if(model.reservation === true){
        return ticketTemplate(model.ticket) + changeTicketTemplate(model.departureSeats, model.arrivalSeats, model.selections.departure, model.selections.arrival);
  
      }else{
        return ticketTemplate(model.ticket);
      }
      
    },
    controller(model){
      api
        .sendRequest(`${api.API_URL}/ticket/${router.params[1]}`, 'GET')
        .then(result => {
          if(result.status === "error"){
            app.showComponent("not_found");
            return;
          }


          let ticketWithPrice = result;
          ticketWithPrice.price = {};
          ticketWithPrice.price.total = 0;
          if(result.departureFlight !== null){
            ticketWithPrice.price.total += result.departureFlight.price; 
            //model.currentSeats.departure = result.departureFlightSeatNumber;
              
          }
          if(result.arrivalFlight !== null){
            ticketWithPrice.price.total += result.departureFlight.price; 
            //model.currentSeats.arrival = result.arrivalFlightSeatNumber;
          }
  
          model.ticket = ticketWithPrice;
          if(result.ticketSaleDate !== null){
            model.reservation = false;
          }else{
            model.reservation = true;
          }
          
          if(model.reservation === true){
            if(model.ticket.departureFlight !== null){
              api
              .sendRequest(`${api.API_URL}/flight/${model.ticket.departureFlight.id}/occupied-seats`, 'GET')
              .then(result => {
                model.departureSeats = this.inverseArrayHelper(result, model.ticket.departureFlight.numberOfSeats);
              });
            }
            if(model.ticket.arrivalFlight !== null){
              api
              .sendRequest(`${api.API_URL}/flight/${model.ticket.arrivalFlight.id}/occupied-seats`, 'GET')
              .then(result => {
                model.arrivalSeats = this.inverseArrayHelper(result, model.ticket.arrivalFlight.numberOfSeats);
              });
            }
          }
          
  
        });
  
        
    },
  
    inverseArrayHelper(occupied, noOfSeats){
      let inverseArray = [];
      for(let i = 1; i <= noOfSeats; i++){
        if(occupied.includes(i) === false){
          inverseArray.push(i);
        }
      }
      return inverseArray;
    },
  
    eventHandler(element){
      if(element.classList.contains("btn-info")){
  
        if(element.dataset.type === "departure"){
  
          this.model.ticket.departureFlightSeatNumber = element.dataset.id;
          this.model.selections.departure = element.dataset.id;
          this.model.mock = 1;
          
          
             
        }else if(element.dataset.type === "arrival"){
          this.model.ticket.arrivalFlightSeatNumber = element.dataset.id;
          this.model.selections.arrival = element.dataset.id;
          this.model.mock = 1;
           
        
        }
  
      }
  
      if(element.id === "btnBuy"){
        this.model.ticket.ticketSaleDate =  getDateTime();
  
        //reduce price prop:
        let objectForSending = Object.keys(this.model.ticket).reduce((object, key) => {
          if (key !== "price") {
            object[key] = this.model.ticket[key]
          }
          return object
        }, {});
  
        api
          .sendRequest(`${api.API_URL}/ticket/${this.model.ticket.id}/update`, 'PUT', {}, JSON.stringify(objectForSending))
          .then(result => {
              if(result.status == "error"){
                alertify.error(result.trace);
                return;
              }

              alertify.warning('Succesfully purchased!', 1, function(){
                window.location.replace(app.baseURI + "user/" +  localStorage.getItem("userId"));
              });
          });
       
  
      
      }

      
      if(element.id === "btnSaveReservationChanges"){
        //reduce price prop:
        let objectForSending = Object.keys(this.model.ticket).reduce((object, key) => {
          if (key !== "price") {
            object[key] = this.model.ticket[key]
          }
          return object
        }, {});

        api
          .sendRequest(`${api.API_URL}/ticket/${this.model.ticket.id}/update`, 'PUT', {}, JSON.stringify(objectForSending))
          .then(result => {
              if(result.status == "error"){
                alertify.error(result.trace);
                return;
              }


              alertify.warning("Changes saved succesfully!", 1, function(){
                window.location.replace(app.baseURI + "user/" +  localStorage.getItem("userId"));
              });
          });
      }
  
      if(element.id === "btnDeleteReservation"){
        api
          .sendRequest(`${api.API_URL}/ticket/${this.model.ticket.id}/delete`, 'DELETE', {})
          .then(result => {
              if(result.status == "error"){
                alertify.error(result.trace);
                return;
              }
              alertify.warning('Succesfully deleted!', 1, function(){
                window.location.replace(app.baseURI + "user/" +  localStorage.getItem("userId"));
              });
          });
  
  
  
      }
  
    },
  
    registerListeners(){
      let self = this;
      if(this.model.reservation === true){
          //departure seats:
          if(this.model.ticket.departureFlight !== null){
            let departureSeatsContainer = document.getElementById("departureSeats");
            let departureSeatsButtons = departureSeatsContainer.getElementsByClassName("btn-info");
  
            for (var i = 0, len = departureSeatsButtons.length; i < len; i++) {
              departureSeatsButtons[i].addEventListener("click", function(e){
                self.eventHandler(e.currentTarget);
              }, false);
            }
          }
          
          //arrival seats:
          if(this.model.ticket.arrivalFlight !== null){
            let arrivalSeatsContainer = document.getElementById("arrivalSeats");
            let arrivalSeatsButtons = arrivalSeatsContainer.getElementsByClassName("btn-info");
  
            for (var i = 0, len = arrivalSeatsButtons.length; i < len; i++) {
              arrivalSeatsButtons[i].addEventListener("click", function(e){
                self.eventHandler(e.currentTarget);
              }, false);
            }
          }
  
          //buy:
          let buyBtn = document.getElementById("btnBuy");
          buyBtn.addEventListener("click", function(e){
            self.eventHandler(e.currentTarget);
          }, false);
          
          //save changes:
          let btnSaveReservationChanges = document.getElementById("btnSaveReservationChanges");
          btnSaveReservationChanges.addEventListener("click", function(e){
            self.eventHandler(e.currentTarget);
          }, false);

          //delete
          let deleteResButton = document.getElementById("btnDeleteReservation");
          deleteResButton.addEventListener("click", function(e){
            self.eventHandler(e.currentTarget);
          }, false);
  
  
      }
  
  
     
      
    }
  }