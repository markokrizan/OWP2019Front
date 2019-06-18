let reservationComponent = {
    name : 'reservation',
    model: {
      currentTicket : {
        departureFlight : null,
        arrivalFlight : null,
        departureFlightSeatNumber : null,
        arrivalFlightSeatNumber : null,
        reservationDate : null,
        ticketSaleDate : null,
        user: {
          id : localStorage.getItem("userId"),
          firstName : localStorage.getItem("firstName"),
          lastName : localStorage.getItem("lastName")
        },
        price : {
          departureFlight: 0,
          arrivalFlight: 0,
          total: 0,
          sum(){
            this.total = this.departureFlight + this.arrivalFlight;
          }
        }
      },
     
      departureFlights : [],
      arrivalFlights : [],
  
      departureSeats : [],
      arrivalSeats : [],
  
      currentStep : "stepOne",
  
      selections : {
        selectedDeparture: null,
        selectedArrival: null,
        selectedDepartureSeat: null,
        selectedArrivalSeat: null
      },
      
  
      mockProxify : 0,
    },
    view(model){
      if(localStorage.getItem("token") == null){
        app.showComponent("forbidden");
      }else if(localStorage.getItem("blocked") === "true"){
        app.showComponent("forbidden");
      }


      if(model.currentStep === "stepOne"){
        let flights = model.departureFlights.reduce((html, flight) => html + reserveTemplateFlight(flight, model.selections.selectedDeparture), '');
        return ticketTemplate(model.currentTicket) + reserveTemplateStepOne(flights);
      }
  
      else if(model.currentStep === "stepTwo"){
        const flights = model.arrivalFlights.reduce((html, flight) => html + reserveTemplateFlight(flight, model.selections.selectedArrival), '');
        return ticketTemplate(model.currentTicket) + reserveTemplateStepTwo(flights);
  
      }else if(this.model.currentStep === "stepThree"){
        return ticketTemplate(model.currentTicket) + reserveTemplateStepThree(model.departureSeats, model.arrivalSeats, model.selections.selectedDepartureSeat, model.selections.selectedArrivalSeat);
      }else if(this.model.currentStep === "stepFour"){

        console.log(model.currentTicket);
        return ticketTemplate(model.currentTicket) + ticketConfirmTemplate;
      }
     
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
  
    viewResetHelper(){
      this.model.currentTicket = {
        departureFlight : null,
        arrivalFlight : null,
        departureFlightSeatNumber : null,
        arrivalFlightSeatNumber : null,
        reservationDate : null,
        ticketSaleDate : null,
        user: {
          id : localStorage.getItem("userId"),
          firstName : localStorage.getItem("firstName"),
          lastName : localStorage.getItem("lastName")
        },
        price : {
          total: 0,
          departureFlight: 0,
          arrivalFlight: 0
        }
      };
      this.model.currentStep = "stepOne";
    },
  
    controller(model){
      if(this.model.currentStep === "stepOne"){
        api
        .sendRequest(`${api.API_URL}/flight/current`, 'GET')
        .then(result => {
          model.departureFlights = result;

          //RESERVATION FROM FLIGHT PAGE:
          console.log(router.params[1]);
          if(router.params[1] != null && router.params[1] != ""){
            
            let flightFromFlightPage = app.findById(router.params[1], this.model.departureFlights);

            if(flightFromFlightPage === null || flightFromFlightPage === undefined){
              app.showComponent("not_found");
              return;
            }

            this.model.currentTicket.departureFlight = flightFromFlightPage;

            this.model.currentTicket.price.departureFlight = this.model.currentTicket.departureFlight.price;
            
            //this.model.currentTicket.price.sum();
            this.model.currentTicket.price.total = this.model.currentTicket.price.departureFlight + this.model.currentTicket.price.arrivalFlight;

            this.model.mockProxify = 1;
          }
        });
        
      }
      else if(this.model.currentStep === "stepTwo"){
  
        api
        .sendRequest(`${api.API_URL}/flight/${this.model.currentTicket.departureFlight.id}/returning`, 'GET')
        .then(result => {
          model.arrivalFlights = result;
        });
       
      }else if(this.model.currentStep === "stepThree"){
  
        if(this.model.currentTicket.departureFlight !== null){
          api
          .sendRequest(`${api.API_URL}/flight/${this.model.currentTicket.departureFlight.id}/occupied-seats`, 'GET')
          .then(result => {
            model.departureSeats = this.inverseArrayHelper(result, this.model.currentTicket.departureFlight.numberOfSeats);
          });
        }
        if(this.model.currentTicket.arrivalFlight !== null){
          api
          .sendRequest(`${api.API_URL}/flight/${this.model.currentTicket.arrivalFlight.id}/occupied-seats`, 'GET')
          .then(result => {
            model.arrivalSeats = this.inverseArrayHelper(result, this.model.currentTicket.arrivalFlight.numberOfSeats);
          });
        }
  
      }else if(this.model.currentStep === "stepFour"){
  
      }
    },
    eventHandler(element){
      //console.log(element.classList);
      if(this.model.currentStep === "stepOne"){
        if(element.classList.contains("list-group-item")){
  
          //cant be done here, view proxify overrides it
          //element.classList.add("pick");
          this.model.selections.selectedDeparture = element.dataset.id;
  
          //fill current ticket departure flight:
          let selectedFlight = app.findById(element.dataset.id, this.model.departureFlights);
          this.model.currentTicket.departureFlight = selectedFlight;
          //fill departure flight price:
          this.model.currentTicket.price.departureFlight = selectedFlight.price;
          //total:
          this.model.currentTicket.price.total = this.model.currentTicket.price.departureFlight + this.model.currentTicket.price.arrivalFlight;
          //this.model.currentTicket.price.sum();
          //check:
          console.log(this.model.currentTicket.price);
          //proxify doesent work for nested properties:
          this.model.mockProxify = 1;
         
        }
        
        if(element.id === "btnStepTwo" && element.classList.contains("disabled") === false ){
          this.model.currentStep = "stepTwo";
  
          //HACKY!!!!!!!!!!!!!!!!!!!:
          this.controller(this.model);
        }
  
  
      }
      else if(this.model.currentStep === "stepTwo"){
  
        if(element.classList.contains("list-group-item")){
  
          this.model.selections.selectedArrival = element.dataset.id;
          //fill current ticket departure flight:
          let selectedFlight = app.findById(element.dataset.id, this.model.arrivalFlights);
          this.model.currentTicket.arrivalFlight = selectedFlight;
          //fill current ticket price:
          this.model.currentTicket.price.arrivalFlight = selectedFlight.price;
          //total:
          this.model.currentTicket.price.total = this.model.currentTicket.price.departureFlight + this.model.currentTicket.price.arrivalFlight;
          //check:
          console.log(this.model.currentTicket.price);
          //proxify doesent work for nested properties:
          this.model.mockProxify = 1;
         
        }
        
        
  
        if(element.id === "stepTwoGoBackBtn"){
          this.model.currentStep = "stepOne";
        }
  
        if(element.id === "btnStepThree"){
          this.model.currentStep = "stepThree";
  
          this.controller(this.model);
        }
        
      }else if(this.model.currentStep === "stepThree"){
  
  
        if(element.classList.contains("btn-info")){
  
          if(element.dataset.type === "departure"){
            this.model.selections.selectedDepartureSeat = element.dataset.id;
  
            let seatNo = element.dataset.id;
            this.model.currentTicket.departureFlightSeatNumber = seatNo;
            this.model.mockProxify = 1;
               
          }else if(element.dataset.type === "arrival"){
            this.model.selections.selectedArrivalSeat = element.dataset.id;
  
            let seatNo = element.dataset.id;
            this.model.currentTicket.arrivalFlightSeatNumber = seatNo;
            this.model.mockProxify = 1;
          
          }
  
        }
  
        if(element.id === "stepThreeGoBackBtn"){
          this.model.currentStep = "stepTwo";
        }
  
        if(element.id === "btnReserve"){
          //this.model.currentTicket.reservationDate = new Date().toLocaleDateString("en-US");
          this.model.currentTicket.reservationDate = getDateTime();
          this.model.currentStep = "stepFour";
        }
  
        if(element.id === "btnBuy"){
          this.model.currentTicket.ticketSaleDate =  getDateTime();
          this.model.currentStep = "stepFour";
        }
  
  
  
  
      }else if(this.model.currentStep === "stepFour"){
  
        if(element.id === "stepFourGoBackBtn"){
          //clear dates:
          this.model.currentTicket.reservationDate = null;
          this.model.currentTicket.ticketSaleDate = null;
          //then go back:
          this.model.currentStep = "stepThree";
        }
  
        if(element.id === "finalizeTicketBtn"){
          let self = this;
  
          let objectForSending = Object.keys(this.model.currentTicket).reduce((object, key) => {
            if (key !== "price") {
              object[key] = this.model.currentTicket[key]
            }
            return object
          }, {});
  
          console.log(objectForSending);
  
          api
          .sendRequest(`${api.API_URL}/ticket/create`, 'POST', {}, JSON.stringify(objectForSending))
          .then(result => {
            if(result.status == "error"){
              alertify.error(result.trace);
              return;
            }
          
            if(result.ticketSaleDate === null){
              alertify.success('Succesfull reservation', 1, function(){
                //reset reservation component:
                self.viewResetHelper();
                window.location.replace(app.baseURI + "user/" +  localStorage.getItem("userId"));
              });
            }else{
              alertify.success('Succesfull purchase', 1, function(){
                self.viewResetHelper();
                window.location.replace(app.baseURI + "user/" +  localStorage.getItem("userId"));
              });
            }
            
          });
        }
      }
  
    
  
    },
    registerListeners(){
      let self = this;
   
      
      //departure flight buttons:
      if(this.model.currentStep === "stepOne"){
  
        
        let departureFlightsContainer = document.getElementById("departureFlights");
        let departureFlightsButtons = departureFlightsContainer.getElementsByClassName("list-group-item");
        let stepTwoBtn = document.getElementById("btnStepTwo");
  
        //remove dissabled class on next step btn if departure flight chosen (upon loading):
        if(this.model.currentTicket.departureFlight !== null){
          stepTwoBtn.classList.remove("disabled");
        }
  
        //register listener to btn:
        stepTwoBtn.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        });
        
        //departure airports:
        for (var i = 0, len = departureFlightsButtons.length; i < len; i++) {
          departureFlightsButtons[i].addEventListener("click", function(e){
            self.eventHandler(e.currentTarget);
          }, false);
        }
  
        
  
      }else if(this.model.currentStep === "stepTwo"){
  
        
        let arrivalFlightsContainer = document.getElementById("arrivalFlights");
        let arrivalFlightsButtons = arrivalFlightsContainer.getElementsByClassName("list-group-item");
        let btnStepThree = document.getElementById("btnStepThree");
        
        //remove dissabled class on next step btn if departure flight chosen (upon loading):
        // if(this.model.currentTicket.arrivalFlight !== null){
        //   btnStepThree.classList.remove("disabled");
        // }
  
        for (var i = 0, len = arrivalFlightsButtons.length; i < len; i++) {
          arrivalFlightsButtons[i].addEventListener("click", function(e){
            self.eventHandler(e.currentTarget);
          }, false);
        }
  
  
       
        btnStepThree.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
  
  
        let goBack = document.getElementById("stepTwoGoBackBtn");
        goBack.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
      
       
      }else if(this.model.currentStep === "stepThree"){
  
        let reserveBtn = document.getElementById("btnReserve");
        let buyBtn = document.getElementById("btnBuy");
        let goBack = document.getElementById("stepThreeGoBackBtn");
  
        let departureSeat = false;
        let arrivalFlight = false;
        let arrivalSeat = false;
  
        //check if departure flight seat is chosen (departure flight is by this step):
        if(this.model.currentTicket.departureFlightSeatNumber !== null){
          departureSeat = true;
        }
  
        //check if arrival flight is chosen, if it is check if its seat is chosen:
        if(this.model.currentTicket.arrivalFlight !== null){
          arrivalFlight = true;
          if(this.model.currentTicket.arrivalFlightSeatNumber !== null){
            arrivalSeat = true;
          }
        }
  
        //if everything selected enable next step buttons:
        if(departureSeat === true && arrivalFlight === false){
          reserveBtn.classList.remove("disabled");
          buyBtn.classList.remove("disabled");
        }
        if(departureSeat === true && arrivalFlight === true && arrivalSeat === true){
          reserveBtn.classList.remove("disabled");
          buyBtn.classList.remove("disabled");
        }
  
        
  
        if(this.model.currentTicket.departureFlight !== null){
          let departureSeatsContainer = document.getElementById("departureSeats");
          let departureSeatsButtons = departureSeatsContainer.getElementsByClassName("btn-info");
  
          for (var i = 0, len = departureSeatsButtons.length; i < len; i++) {
            departureSeatsButtons[i].addEventListener("click", function(e){
              self.eventHandler(e.currentTarget);
            }, false);
          }
        }
        
        if(this.model.currentTicket.arrivalFlight !== null){
          let arrivalSeatsContainer = document.getElementById("arrivalSeats");
          let arrivalSeatsButtons = arrivalSeatsContainer.getElementsByClassName("btn-info");
  
          for (var i = 0, len = arrivalSeatsButtons.length; i < len; i++) {
            arrivalSeatsButtons[i].addEventListener("click", function(e){
              self.eventHandler(e.currentTarget);
            }, false);
          }
        }
  
  
        
        //back
        goBack.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
  
        //reserve:
        reserveBtn.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
  
  
        //buy:
        buyBtn.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
  
  
      }else if(this.model.currentStep === "stepFour"){
        //back:
        let backBtn = document.getElementById("stepFourGoBackBtn");
        backBtn.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
  
  
        //finalize:
        let finalizeBtn = document.getElementById("finalizeTicketBtn");
        finalizeBtn.addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
        
  
  
  
  
      }
  
      
      
  
    }
  }