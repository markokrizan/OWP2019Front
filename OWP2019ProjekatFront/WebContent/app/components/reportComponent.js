let reportComponent = {
    name: 'report',
    model: {
      totalReport : {},
      airportReports : [],
      rangeReport : {
        dateLow : null,
        dateHigh : null
      }
    },
    view(model){
      let airportReports = model.airportReports.reduce((html, airportReport) => html + airportReportTemplate(airportReport), '');
      return allTimeReportTemplate(model.totalReport) +
             rangeAirportReportsTemplate +
             reportByAirportContainerTemplate(airportReports);
    },
    controller(model){
        let self = this;
        Promise.all([
            api.sendRequest(`${api.API_URL}/report/total-all-time`, 'GET'),
            api.sendRequest(`${api.API_URL}/report/by-airport-all-time`, 'GET')
          ]).then(allResponses => {
            self.model.totalReport = allResponses[0][0];
            self.model.airportReports = allResponses[1];
          })
    },
    validate(dl, tl, dh, th){
      let validationMessage = "";
      if(dl === null || dl === ""){
        validationMessage += "&bull; Provide the lowest date!!\n";
      }else{
        this.model.rangeReport.dateLow = dl;
      }

      if(tl === null || tl === ""){
        validationMessage += "&bull; Provide the lowest time!!\n";
      }else{
        this.model.rangeReport.dateLow = this.model.rangeReport.dateLow  + " " + tl + ":00";
      }

      if(dh === null || dh === ""){
        validationMessage += "&bull; Provide the highest date!!\n";
      }else{
        this.model.rangeReport.dateHigh = dh;
      }

      if(th === null || th === ""){
        validationMessage += "&bull; Provide the highest time!\n";
      }else{
          this.model.rangeReport.dateHigh = this.model.rangeReport.dateHigh  + " " + th + ":00";
      }
      
      
      return validationMessage;
    },
    eventHandler(e){

      let descending = document.getElementById("sortDescending").checked;

      let elementId = e.id;
      switch(elementId) {
        //sort:
        case "sortByNumberOfFlights":
          this.model.airportReports = app.collectionSorter(this.model.airportReports, "numberOfFlights", descending);
        break;
        case "sortByNumberOfTickets":
          this.model.airportReports = app.collectionSorter(this.model.airportReports, "numberOfTickets", descending);
        break;
        case "sortByTotalRevenue":
          this.model.airportReports = app.collectionSorter(this.model.airportReports, "totalRevenue", descending);
        break;
        case "rangeReportButton":
          let dateLowInput = document.getElementById("dateLowInput").value;
          let timeLowInput = document.getElementById("timeLowInput").value;
          let dateHighInput = document.getElementById("dateHighInput").value;
          let timeHighInput = document.getElementById("timeHighInput").value;
    
          let validationMessage = this.validate(dateLowInput, timeLowInput, dateHighInput, timeHighInput);
    
          if(validationMessage === ""){
            api
              .sendRequest(`${api.API_URL}/report/by-airport-specific`, 'POST', {}, JSON.stringify(this.model.rangeReport))
              .then(result => {
                //console.log(result);
                if(result.status === "error"){
                  alertify.notify(result.trace, 'error', 10);
                }else{
                  this.model.airportReports = result;
                }
              });
          }else{
            //fail:
            alertify.notify(validationMessage, 'error', 10);
          }
        
        break;
      }


    },
    registerListeners(){
      let self = this;
      let rangeReportButton = document.getElementById("rangeReportButton");
      rangeReportButton.addEventListener("click", function(e){
        self.eventHandler(e.currentTarget);
      }, false);

      //sort:
      let sortByNumberOfFlights = document.getElementById("sortByNumberOfFlights");
      let sortByNumberOfTickets = document.getElementById("sortByNumberOfTickets");
      let sortByTotalRevenue = document.getElementById("sortByTotalRevenue");
      
      sortByNumberOfFlights.addEventListener("click", function(e){
        self.eventHandler(e.currentTarget);
      }, false);

      sortByNumberOfTickets.addEventListener("click", function(e){
        self.eventHandler(e.currentTarget);
      }, false);

      sortByTotalRevenue.addEventListener("click", function(e){
        self.eventHandler(e.currentTarget);
      }, false);
     
    }
  }