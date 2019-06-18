let userComponent = {
    name : 'user',
    model: {
      user : {},
      reservations : [],
      tickets : []
    },
    view(model){
      let reservations = model.reservations.reduce((html, ticket) => html + userReservations(ticket), '');
      let tickets = model.tickets.reduce((html, ticket) => html + userTickets(ticket), '');
      let userReservationTickets = userReservationsTicketsOverviewTemplate(reservations, tickets);
  
      return userProfileTemplate(model.user) + userReservationTickets;
      
      //if user is admin add adminPanelTemplate:
      // if(model.user.role === "ADMIN"){
      //   return userProfileTemplate(model.user) + userReservationTickets + adminPanelTemplate;
      // }else{
      //   return userProfileTemplate(model.user) + userReservationTickets;
      //}
      
    },
    controller(model){
      
      Promise.all([
        api.sendRequest(`${api.API_URL}/user/${router.params[1]}`, 'GET'),
        api.sendRequest(`${api.API_URL}/user/${router.params[1]}/tickets`, 'GET')
      ]).then(allResponses => {
          if(allResponses[0].status === "error"){
            app.showComponent("not_found");
            return;
          }
          //api security also
          if(allResponses[0].id != localStorage.getItem("userId") && localStorage.getItem("role") != "ADMIN"){
            app.showComponent("forbidden");
            return;
          }
          

          model.user = allResponses[0];
  
          let reservations = [];
          let tickets = [];
          allResponses[1].forEach(function(element) {
            if(element.ticketSaleDate === null){
              reservations.push(element);
            }else{
              tickets.push(element);
            }
          });
          model.reservations = app.collectionSorter(reservations, "reservationDate", true);
          model.tickets = app.collectionSorter(tickets, "ticketSaleDate", true);
  
      })
      
    },
    registerListeners(){
      
    }
  
  }