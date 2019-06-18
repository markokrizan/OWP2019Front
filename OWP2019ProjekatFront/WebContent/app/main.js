//http-server -p 8081
//json example - array of products: 
//https://api.myjson.com/bins/bs9vi 




//Instanca aplikacije kojoj se prosledjuje html selektor aplikacije
const app = new App('#app');
//Instanca klase koja ima informacije i pozive ka APIju
const api = new API(app);


app.addComponent(loginComponent);
app.addComponent(registerComponent);
app.addComponent(notFoundComponent);
app.addComponent(forbiddenComponent);
app.addComponent(flightsComponent);
app.addComponent(flightComponent);
app.addComponent(addFlightComponent);
app.addComponent(userComponent);
app.addComponent(changeUserComponent);
app.addComponent(userAdministrationComponent);
app.addComponent(reservationComponent);
app.addComponent(ticketComponent);
app.addComponent(reportComponent);
app.addComponent(serverErrorComponent);



const router = new Router(app);
//component name, current url (regExp)
router.addRoute('flights', '^#/flights$');
//one element
router.addRoute('flight', '^#/flight/([0-9]*)$');
//login
router.addRoute('login', '^#/login$');
//register
router.addRoute('register', '^#/register$');
//user:
router.addRoute('user', '^#/user/([0-9]*)$');
//changeUser:
router.addRoute('changeUser', '^#/changeUser/([0-9]*)$');
//userAdministration:
router.addRoute('userAdministration', '^#/userAdministration$');
//reservation:
router.addRoute('reservation', '^#/reserve$');
//reservation from flight page (departure airport known):
router.addRoute('reservation', '^#/reserve/([0-9]*)$');
//ticket
router.addRoute('ticket', '^#/ticket/([0-9]*)$');
//addFlight:
router.addRoute('addFlight', '^#/addFlight$');
//addFlight:
router.addRoute('report', '^#/report$');



