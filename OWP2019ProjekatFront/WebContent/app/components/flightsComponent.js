let flightsComponent = {
    name: 'flights',
    model: {
      flights: [],
      airports : []
    },
    //view prihvati model (listu podataka) i ubaci u template i vrati gotov view
    view(model){
      //kreiraj listu napravljenih templejta u koji su ugurani podaci
      const airports = model.airports.reduce((html, airport) => html + chooseAirportItem(airport), '');
      const flightsHTML = model.flights.reduce((html, flight) => html + `<li>${flightsTemplate(flight)}</li>`, '');
      return `
        <div class = "container">
        ${flightFilterTemplate(airports)}
        ${flightSortTemplate}
        <br/>
        <ul class="list-unstyled">
          ${flightsHTML}
        </ul>
        </div>
      `;
      // const flights = model.flights.reduce((html, flight) => html + flightsTemplate(flight), '');
      // return flightsContainerTemplate(flights);
    },
    //kontroler prihvata model da moze da apdejtuje sa novim podacima
    //koji su fetch-ova iz apija
    controller(model){
        Promise.all([
          api.sendRequest(`${api.API_URL}/flight`, 'GET'),
          api.sendRequest(`${api.API_URL}/airport`, 'GET')
        ]).then(allResponses => {
            model.flights = allResponses[0];
            model.airports = allResponses[1];
        })
    },
    eventHandler(element){
      //filter
      let priceLow = document.getElementById("priceLow");
      let priceHigh = document.getElementById("priceHigh");
      let dateLow = document.getElementById("dateLow");
      let dateHigh = document.getElementById("dateHigh");
  
      //sort:
      let descending = document.getElementById("sortDescending").checked;
  
      let elementId = element.id;
      switch(elementId) {
        //sort:
        case "sortByFlighNumber":
          this.model.users = app.collectionSorter(this.model.flights, "number", descending);
          break;
        case "sortByDepartureAirport":
          this.model.users = app.collectionSorter(this.model.flights, "flyingFrom", descending);
          break;
        case "sortByArrivalAirport":
          this.model.users = app.collectionSorter(this.model.flights, "flyingTo", descending);
          break;
        case "sortByPrice":
        this.model.users = app.collectionSorter(this.model.flights, "price", descending);
          break;
        case "sortByDepartureDate":
        this.model.users = app.collectionSorter(this.model.flights, "departure", descending);
          break;
        case "sortByArrivalDate":
          this.model.users = app.collectionSorter(this.model.flights, "arrival", descending);
          break;
        //search:
        case "searchFlightsInput":
        case "flightSearchBtn":
          //prepare query state:
  
          //text input:
          let searchFlightsInput = document.getElementById("searchFlightsInput").value;
  
          //airports: ------------------------------------------------------------------------
          let departureAirportContainer = document.querySelector('#departureAirports');
          let arrivalAirportContainer = document.querySelector('#arrivalAirports');
          var departuresCheckes = departureAirportContainer.querySelectorAll('input[type="checkbox"]:checked');
          var arrivalsCheckes = arrivalAirportContainer.querySelectorAll('input[type="checkbox"]:checked');
  
          let departureIds = [];
          let arrivalIds = [];
  
          for (i = 0; i < departuresCheckes.length; i++) {
            if (departuresCheckes[i].checked) {
              departureIds.push(departuresCheckes[i].dataset.id);
            }
          }
  
          for (i = 0; i < arrivalsCheckes.length; i++) {
            if (arrivalsCheckes[i].checked) {
              arrivalIds.push(arrivalsCheckes[i].dataset.id);
            }
          }
  
          //----------------------------------------------------------------------------------
  
          //price:
          let lowestPrice = document.getElementById("priceLow").value;
          let highestPrice = document.getElementById("priceHigh").value;
  
          //date:
          let dateLowDeparture = document.getElementById("dateLowDeparture").value;
          let dateHighDeparture = document.getElementById("dateHighDeparture").value;
          let dateLowArrival = document.getElementById("dateLowArrival").value;
          let dateHighArrival = document.getElementById("dateHighArrival").value;

          //time:
          // let timeLowDeparture = document.getElementById("timeLowDeparture").value;
          // let timeHighDeparture = document.getElementById("timeHighDeparture").value;
          // let timeLowArrival = document.getElementById("timeLowArrival").value;
          // let timeHighArrival = document.getElementById("timeHighArrival").value;

          //dateLowDeparture : dateLowDeparture + " " + timeLowDeparture + ":00",



  


  
          //test:
          // console.log(searchFlightsInput);
          // console.log(departureIds);
          // console.log(arrivalIds);
          // console.log(lowestPrice);
          // console.log(highestPrice);
          // console.log(lowestDate);
          // console.log(highestDate);
  
          //prepare query object:
          let queryObject = JSON.stringify({
            queryText : searchFlightsInput,
            departureAirports : departureIds,
            arrivalAirports: arrivalIds,
            lowestPrice : lowestPrice,
            highestPrice : highestPrice,
            dateLowDeparture : dateLowDeparture,
            dateHighDeparture : dateHighDeparture,
            dateLowArrival : dateLowArrival,
            dateHighArrival : dateHighArrival
          });
  
          console.log(queryObject);
  
          //send query to server:
          api
          .sendRequest(`${api.API_URL}/flight/search`, 'POST', undefined, queryObject)
          .then(result => {
            this.model.flights = result;
          });
  
         
  
          break;
        default:
          
      }
  
    },
    registerListeners(){
      let self = this;
  
      //filter:
      let searchFlightsInput = document.getElementById("searchFlightsInput");
      let flightSearchBtn = document.getElementById("flightSearchBtn");
  
      flightSearchBtn.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      searchFlightsInput.addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode === 13) {
          self.eventHandler(this);
        }
      });
  
  
      //sort:
      let sortByFlighNumber = document.getElementById("sortByFlighNumber");
      let sortByDepartureAirport = document.getElementById("sortByDepartureAirport");
      let sortByArrivalAirport = document.getElementById("sortByArrivalAirport");
      let sortByPrice = document.getElementById("sortByPrice");
      let sortByDepartureDate = document.getElementById("sortByDepartureDate");
      let sortByArrivalDate = document.getElementById("sortByArrivalDate");
  
      sortByFlighNumber.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      sortByDepartureAirport.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      sortByArrivalAirport.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      sortByPrice.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      sortByDepartureDate.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);   
      sortByArrivalDate.addEventListener("click", function(){
        self.eventHandler(this);
      }, false); 
    }
  }