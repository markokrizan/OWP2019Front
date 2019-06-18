//view constants:
const navMenuList = document.getElementById("navMenus");



//executes every time a new role is using the application:
function postLoginViewChange(role){
    console.log("Promenjena rola u: " + role);

    //role independent:
    if(role != null){
        document.getElementById("userNavLi").innerHTML = userButtonTemplate(localStorage.getItem("userId"));
        document.getElementById("logoutButton").addEventListener("click", app.logout);   
    }

    switch(role) {
        case "ADMIN":
          navMenuList.innerHTML =
              `<li class="nav-item "> <a class="nav-link text-light" href="${app.baseURI}reserve">Reserve a ticket</a> </li>` +
              `<li class="nav-item "> <a class="nav-link text-light" href="${app.baseURI}addFlight">Add flight</a> </li>` +
              `<li class="nav-item "> <a class="nav-link text-light" href="${app.baseURI}userAdministration">Manage users</a> </li>`+
              `<li class="nav-item "> <a class="nav-link text-light" href="${app.baseURI}report">Report</a> </li>`
          ;
          break;
        case "REGULAR":
          navMenuList.innerHTML =
            `<li class="nav-item "> <a class="nav-link text-light" href="${app.baseURI}reserve">Reserve a ticket</a> </li>`
          ;
          break;
        default:
          //GUEST:
          console.log("niko nije ulogovan");
          document.getElementById("userNavLi").innerHTML =
          `<a id = "userLink" href = "#/login"><i id = "userIcon" class="fa fa-bitbucket fa-user-times text-light fa-2x">  </i></a>`;
          navMenuList.innerHTML = "";
          break;
    }
   
}

const userButtonTemplate = (userId) => `
    <div class="btn-group" >
        <button class="btn dropdown-toggle text-light btn-link" data-toggle="dropdown" aria-expanded="false"> 
            <i class="fa fa-user-o fa-2x"></i> 
        </button>
        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
            <a class="dropdown-item" href="#/user/${userId}">Profile</a>
            <div class="dropdown-divider"></div>
            <a id = "logoutButton" class="dropdown-item">Logout</a>
        </div>
    </div>
`;

function loginNotify(){ 
    alertify.success('Welcome ' + localStorage.getItem("firstName"), 1, function(){
        this.loggedInRole = localStorage.getItem("role");
        window.location.replace(app.baseURI + "flights");
    });
}


function getDateTime(timestamp){
    if(timestamp !== null && timestamp !== undefined){
        return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
    }else{
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
   
}

function dateInputFieldFormat(dateTimeString){
    return dateTimeString.slice(0, 10);
}

function timeInputFieldFormat(dateTimeString){
    return dateTimeString.slice(11, 19);
}






//templates:
const flightsContainerTemplate = (flights) => `
    <div class="col-md-12" >
    <div class="form-group"><label></label>
    <div class="input-group w-100">
        <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Serach flights">
        <div class="input-group-append">
        <div class="btn-group">
            <button class="btn dropdown-toggle btn-info" data-toggle="dropdown"> Price</button>
            <div class="dropdown-menu">
            <form class="p-3">
                <div class="form-group">
                <label for="exampleDropdownFormEmail1">Lowest</label>
                <input type="text" class="form-control" id="exampleDropdownFormEmail1">
                </div>
                <div class="form-group"><label for="exampleDropdownFormPassword1">Highest</label>
                <input type="text" class="form-control" id="exampleDropdownFormPassword1">
                </div>
            </form>
            </div>
        </div>
        <div class="btn-group">
            <button class="btn dropdown-toggle btn-info" data-toggle="dropdown"> Date</button>
            <div class="dropdown-menu">
            <form class="p-3">
                <div class="form-group">
                <label for="exampleDropdownFormEmail1">Between</label>
                <input type="date" class="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com">
                </div>
                <div class="form-group">
                <label for="exampleDropdownFormPassword1">and</label>
                <input type="date" class="form-control" id="exampleDropdownFormPassword1">
                </div>
            </form>
            <div class="dropdown-divider"></div>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>

    <div class="col-md-12" ><button class="btn dropdown-toggle btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" id="dropdownMenuButton" aria-expanded="false"> Sort by </button></div>

    <div class = "col-md-12">
        <div class = "container">
            ${flights}
        </div>
    </div>
`;





const flightsTemplate = (flight) => `
   
    <div class="col-md-12" >
        <div class="card bg-light mb-3">
        <div class="card-header">Flight number: ${flight.number}</div>
        <div class="card-body">
            <div class="row">
            <div class="col-md-4">
                <h5 class="">${flight.flyingFrom.name}</h5>
                <h6 class="" contenteditable="true">${getDateTime(flight.departure)}</h6>
            </div>
            <div class="col-md-4 d-flex flex-grow-1">
                    <h5 class="w-100 text-center" >----------------------------&gt;</h5>
            </div>
            <div class="col-md-4">
                <h5 class="text-right">${flight.flyingTo.name}</h5>
                <h6 class="text-right">${getDateTime(flight.arrival)}</h6>
            </div>

            <div class="col-md-4"></div>
                    <div class="col-md-4 d-flex justify-content-center" ><a class="btn btn-info d-flex justify-content-center w-25 align-items-center" href="${app.baseURI}flight/${flight.id}">Info</a></div>
                    <div class="col-md-4">
            </div>

        </div>
        </div>
    </div>
 
 
    
    
`;




const flightTemplate = (flight, seatsLeft) => `
    <div class = "container">
        <div class="col-md-12" >
            <div class="card bg-light mb-3">
                <div class="card-header">Flight number: ${flight.number}</div>
                <div class="card-body">
                    <div class="row">
                    <div class="col-md-4">
                        <h5 class="">${flight.flyingFrom !== undefined ? flight.flyingFrom.name : ""}</h5>
                        <h6 class="" contenteditable="true">${getDateTime(flight.departure)}</h6>
                    </div>
                    <div class="col-md-4 d-flex flex-grow-1">
                        <h5 class="w-100 text-center">----------------------------&gt;</h5>
                    </div>
                    <div class="col-md-4">
                        <h5 class="text-right">${flight.flyingTo !== undefined ? flight.flyingTo.name : ""}</h5>
                        <h6 class="text-right">${getDateTime(flight.arrival)}</h6>
                    </div>
                    </div>
                    <br/>
                    <div class="row">
                    <div class="col-md-4">
                        <h5 class="">Seats availible: ${seatsLeft}<br></h5>
                    </div>
                    <div class="col-md-4"></div>
                    <div class="col-md-4"></div>
                    </div>
                    <div class="row">
                    <div class="col-md-4">
                        <h5 class="">Price: ${flight.price}<br></h5>
                    </div>
                    <div class="col-md-4"></div>
                    <div class="col-md-4 d-flex align-items-center justify-content-end"><button class="btn d-flex align-items-center text-center justify-content-center btn-success" id = "reserveButton">Reserve</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

const loginTemplate =  `
    <div id = "component_container">
        <div class="container" >
            <div class="row">
                <div class="mx-auto col-md-6 col-10 bg-white p-5 rounded">
                <h1 class="mb-4">Log in</h1>
                <form>
                    <div class="form-group"> <input type="text" class="form-control" placeholder="Enter username" id="user_name_input"  required> </div>
                    <div class="form-group mb-3"> <input type="password" class="form-control" placeholder="Enter password" id="password_input" required> 
                        <small class="form-text text-muted text-right">
                        </small> 
                    </div> 
                </form>
                <div class="container">
                    <div class="row">
                    <div class="col-md-6"><button type="submit" class="btn btn-primary" id="login_button">Submit</button></div>
                    <div class="col-md-6 d-flex justify-content-end align-items-center" >
                        <h6 class=""><a href = "${app.baseURI}register">Don't have an account?</a></h6>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div> 
    </div> 
`;

const registerTemplate = `
    <div class="py-5">
    <div class="container bg-light rounded">
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
        <div class="p-5 col-md-12">
            <h1 class="text-center">Sign up:</h1>
            <form>
            <div class="form-group"> <label>User name:</label> <input class="form-control" type="text" id="userNameInput" > </div>
            <div class="form-group"> <label>First name:</label> <input type="text" class="form-control" id="firstNameInput"> </div>
            <div class="form-group"> <label>Last name:</label> <input type="text" class="form-control" id="lastNameInput"> </div>
            <div class="form-group"> <label>Password:</label> <input type="password" class="form-control" id="passwordInput"> </div>
            <div class="form-group"> <label>Repeat password:</label> <input type="password" class="form-control" id="repeatPasswordInput"> </div>
            <br>
            <button class="btn btn-info w-100" id = "registerButton">Done</button>
            </form>
        </div>
        </div>
        <div class="col-md-3"></div>
    </div>
    </div>
    </div>
`;



const notFoundTemplate = `
        <br/>
        <div class="container">
            <div class="row">
                <div class="col-md-12" >
                    <h1 class="display-2 text-center text-white">404<br></h1>
                    <h1 class="text-center display-4 text-white">Requested resource not found.</h1>
                    </br>
                    <img class="img-fluid d-block mx-auto rounded-circle" src="app/pics/not_found_plane.gif" width="400" height="400">
                </div>
            </div>
        </div>
`;

const serverErrorTemplate = `
        <br/>
        <div class="container">
            <div class="row">
                <div class="col-md-12" >
                    <h1 class="display-2 text-center text-white">500<br></h1>
                    <h1 class="text-center display-4 text-white">Something went wrong.</h1>
                    </br>
                    <img class="img-fluid d-block mx-auto rounded-circle" src="app/pics/plane_crash.gif" width="400" height="400">
                </div>
            </div>
        </div>
`;

const forbiddenTemplate = `
    <br/>
    <div class="container">
        <div class="row">
            <div class="col-md-12" >
                <h1 class="display-2 text-center text-white">403<br></h1>
                <h1 class="text-center display-4 text-white">Unauthorized</h1>
                </br>
                <img class="img-fluid d-block mx-auto rounded-circle" src="app/pics/not_found_plane.gif" width="400" height="400">
            </div>
        </div>
    </div>
`;

const userProfileTemplate = (user) => `
    <div class="py-5" >
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="container">
            <div class="row">
            <div class="p-5 col-md-12 d-flex flex-column justify-content-center align-items-center bg-light rounded">
                <h1>Welcome: ${user.firstName}</h1>
                <p class="mb-4 lead text-center">Role: ${user.role}</p>
                <div class="row">
                <div class="col-md-12">
                    <div class="row">
                    <div class="col-md-6" style="">
                        <h5 class="text-center">User name:</h5>
                    </div>
                    <div class="col-md-6" style="">
                        <h5 class="text-center">${user.userName}</h5>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-center">First name:</h5>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-center">${user.firstName}</h5>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-center">Last name:</h5>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-center">${user.lastName}</h5>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-center">Registration date:</h5>
                    </div>
                    <div class="col-md-6">
                        <h5 class="text-center">${getDateTime(user.registrationDate)}</h5>
                    </div>
                    <br/>
                    <br/>
                    </div>
                </div>
                </div><a class="btn btn-info w-25" href="${app.baseURI}changeUser/${user.id}">Change personal information</a>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>
`;

const changeUserTemplate = (user) => `
    <div class="py-5" >
        <div class="container bg-light rounded">
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
            <div class="p-5 col-md-12">
                <h1>Change personal info:</h1>
                <form>
                <div class="form-group"> <label>User name:</label> <input class="form-control" type="text" id = "changeUserName" value = "${user.userName}"> </div>
                <div class="form-group"> <label>First name:</label> <input type="text" class="form-control" id = "changeUserFirstName" value = "${user.firstName}"> </div>
                <div class="form-group"> <label>Last name:</label> <input type="text" class="form-control" id = "changeUserLastName" value = "${user.lastName}"> </div>
                <div class="form-group"> <label>New password:</label> <input type="password" class="form-control" id = "changeUserPassword"> </div>
                <div class="form-group"> <label>Retype password:</label> <input type="password" class="form-control" id = "chageUserRepeatPassword"> </div> 
                <br/>
                <button class="btn btn-info w-100" id="changeUserButton" >Change</button>
                </form>
            </div>
            </div>
            <div class="col-md-3"></div>
        </div>
        </div>
    </div>

`;

const optionRole = (role) => `
    <option value="${role}">${role}</option>
`;

const changeUserAdminTemplate = (user, roles) => `
    <div class="py-5" style="" >
    <div class="container bg-light rounded">
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
        <div class="p-5 col-md-12">
            <h1>Change personal info:</h1>
            <form>
            <div class="form-group"> <label>User name:</label> <input class="form-control" type="text" id="changeUserName" value="${user.userName}"> </div>
            <div class="form-group"> <label>First name:</label> <input type="text" class="form-control" id="changeUserFirstName" value="${user.firstName}"> </div>
            <div class="form-group"> <label>Last name:</label> <input type="text" class="form-control" id="changeUserLastName" value="${user.lastName}"> </div>
            <div class="form-group"> <label>New password:</label> <input type="password" class="form-control" id="changeUserPassword"> </div>
            <div class="form-group"> <label>Retype password:</label> <input type="password" class="form-control" id="chageUserRepeatPassword"> </div>
            <div class="form-group"><label>Role:&nbsp;</label>
                ${selectOptionsTemplate("rolesSelection", optionRole, roles)}
            </div>
            <div class="form-group">
                <label>Blocked:</label>
                <input type="checkbox" id = "blockedCheck"> 
            </div>
            <br>
            <button class="btn btn-info w-100" id="changeUserButton">Change</button>
            </form>
        </div>
        </div>
        <div class="col-md-3"></div>
    </div>
    </div>
    </div>

`;

// const adminPanelTemplate = `
   
//     <div class = "py-5">
//         <div class="container">
//         <div class="row">
//             <div class="col-md-12">
//                 <div class="card" >
//                 <div class="card-header">
//                     <h3 class="text-center">Admin panel</h3>
//                 </div>
//                 <div class="card-body" >
//                 <div class="row">
//                 <div class="col-md-4"><a class="btn btn-block w-100 btn-light border" href="${app.baseURI}/userAdministration"><i class="fa fa-fw fa-1x py-1 fa-users fa-4x"></i></a></div>
//                 <div class="col-md-4"><a class="btn btn-block btn-light border" href="${app.baseURI}/flightAdministration"><i class="fa fa-fw fa-1x py-1 fa-plane fa-4x"></i></a></div>
//                 <div class="col-md-4"><a class="btn btn-block btn-light border" href="${app.baseURI}/ticketAdministration"><i class="fa fa-fw fa-1x py-1 fa-ticket fa-4x"></i></a></div>
//                 </div>
//             </div>
//                 </div>
//             </div>
//         </div>
//         </div>
//     </div>
    


// `;

const userAdministrationTable = (rows) => `
<div class = "py-5">
<div class = "container">
<div class="col-md-12">
    <div class="card">

    <div class="card-header" style="" >
        <input id="userSearch" class="form-control mr-sm-2 w-25" placeholder="Search" style="display:inline !important;" type="text">
        <div class="dropdown" style="display: inline;">
        <button class="btn dropdown-toggle btn-info w-25" type="button" data-toggle="dropdown" aria-haspopup="true" id="dropdownMenuButton" aria-expanded="false"> Sort by </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="sortMenu">
            <a class="dropdown-item" id = "sortByUserName" >User name</a>
            <a class="dropdown-item" id = "sortByRole" >Role</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item">
            <div class="checkbox">
                <label>
                    Descending <input type="checkbox" id = "sortDescending">
                </label>
            </div>
            </a>
            
        </div>
        </div>
    </div>
    <div class="card-body">
        <table class="table">
        <thead id="heading">
            <tr>
            <th class="w-10">#</th>
            <th class="w-20">User name</th>
            <th class="w-15">Registration date</th>
            <th class="w-20">Role</th>
            <th class="w-25">Operations</th>
            </tr>
        </thead>
        <tbody id="rows">
            ${rows}
            <!-- Example -->
            <!--<tr>-->
            <!--<td>1</td>-->
            <!--<td>Mark</td>-->
            <!--<td>Otto</td>-->
            <!--<td>someRole</td>-->
            <!--<td>-->
            <!--<a class="btn btn-warning" href="#">Block</a>-->
            <!--<a class="btn btn-danger" href="#">Delete</a>-->
            <!--</td>-->
            <!--</tr>-->
        </tbody>
        </table>
    </div>
    </div>
</div>
</div>
</div>
`;

const userAdministrationRow = (user) => `
    <tr>
        <td>${user.id}</td>
        <td><a href = "${app.baseURI}user/${user.id}">${user.userName}</a></td>
        <td>${getDateTime(user.registrationDate)}</td>
        <td>${user.role}</td>
        <td>
            <a class="btn btn-danger deleteUser" data-id= "${user.id}" >Delete</a>
        </td>
    </tr>
`;


const userReservationsTicketsOverviewTemplate = (reservationRows, ticketRows) =>  `
    <div class = "col-md-12">
    <div class = "container">
    <div class = "row">
    <div class="col-md-12 bg-light rounded" >
        <ul class="nav nav-tabs">
        <li class="nav-item"> <a class="active nav-link userResTicketNav" href = "" data-toggle="tab" data-target="#tabone">Reservations</a> </li>
        <li class="nav-item"> <a class="nav-link userResTicketNav" href = "" data-toggle="tab" data-target="#tabtwo">Tickets</a> </li>
        </ul>
        <div class="tab-content mt-2">
        <!-- Reservations: -->
        <div class="tab-pane fade show active" id="tabone" role="tabpanel">
            <ul class="list-group mb-3 resTicketList">
                ${reservationRows}
            </ul>
        </div>
        <!-- Tickets: -->
        <div class="tab-pane fade" id="tabtwo" role="tabpanel">
            <ul class="list-group mb-3 resTicketList">
                ${ticketRows}
            </ul>
        </div>
        <div class="tab-pane fade" id="tabthree" role="tabpanel">
            <p class="">In my soul and absorb its power, like the form of a beloved mistress, then I often think with longing.</p>
        </div>
        </div>
    </div>
    </div>
    </div>
    </div>
    
`;

const userReservations = (ticket) => `
    <li class="list-group-item d-flex justify-content-between align-items-center" ><a href = "${app.baseURI}ticket/${ticket.id}" >${getDateTime(ticket.reservationDate)}</a></li>
`;

const userTickets = (ticket) => `
    <li class="list-group-item d-flex justify-content-between align-items-center" ><a href = "${app.baseURI}ticket/${ticket.id}">${getDateTime(ticket.ticketSaleDate)}</a></li>
`;

const chooseAirportItem = (airport) => `
    <a class="dropdown-item">
    <div class="checkbox">
        <label>
            ${airport.name} <input data-id = "${airport.id}" type="checkbox">
        </label>
    </div>
    </a>
`;

const flightFilterTemplate = (airports) => `
    
    <div class="col-md-12">
    <div class="form-group"><label></label>
        <div class="input-group w-100">
        <input type="text" class="form-control" id="searchFlightsInput" placeholder="Search flights">
        <div class="input-group-append">
            <div class="btn-group" >
                <button class="btn btn-info dropdown-toggle" data-toggle="dropdown"> Airport </button>
                <div class="dropdown-menu"> 
                    <!--<div class="dropdown-divider"></div>-->
                    <div id = "departureAirports">
                        ${airports}
                    </div>
                    
                    <a class="dropdown-item">
                            -------------->
                    </a>
                    <div id = "arrivalAirports">
                        ${airports}
                    </div>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn dropdown-toggle btn-info" data-toggle="dropdown" aria-expanded="false"> Price</button>
                <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 38px, 0px);">
                    <form class="p-3" _lpchecked="1">
                    <div class="form-group">
                        <label for="priceLow">Lowest</label>
                        <input type="text" class="form-control" id="priceLow">
                    </div>
                    <div class="form-group"><label for="priceHigh">Highest</label>
                        <input type="text" class="form-control" id="priceHigh">
                    </div>
                    </form>
                </div>
            </div>
            <div class="btn-group">
            <button class="btn dropdown-toggle btn-info" data-toggle="dropdown"> Departure date</button>
            <div class="dropdown-menu">
                <form class="p-3">
                <div class="form-group">
                    <label for="dateLowDeparture">Between</label>
                    <input type="date" class="form-control" id="dateLowDeparture">
                    <!--<input type="time" class="form-control" id="timeLowDeparture">-->
                </div>
                <div class="form-group">
                    <label for="dateHighDeparture">and</label>
                    <input type="date" class="form-control" id="dateHighDeparture">
                    <!--<input type="time" class="form-control" id="timeHighDeparture">-->
                </div>
                </form>
            </div>
            <div class="btn-group">
            <button class="btn dropdown-toggle btn-info" data-toggle="dropdown"> Arrival date</button>
            <div class="dropdown-menu">
                <form class="p-3">
                <div class="form-group">
                    <label for="dateLowArrival">Between</label>
                    <input type="date" class="form-control" id="dateLowArrival">
                    <!--<input type="time" class="form-control" id="timeLowArrival">-->
                </div>
                <div class="form-group">
                    <label for="dateHighArrival">and</label>
                    <input type="date" class="form-control" id="dateHighArrival">
                    <!--<input type="time" class="form-control" id="timeHighArrival">-->
                </div>
                </form>
            </div>
            </div><button id = "flightSearchBtn" class="btn btn-info" type="button"><i class="fa fa-search"></i></button>
        </div>
        </div>
    </div>
    </div>
    
`;

const flightSortTemplate = `
    <div class="col-md-12" >
    <button class="btn dropdown-toggle btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" id="dropdownMenuButton" aria-expanded="false"> Sort by </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="sortMenu">
            <a class="dropdown-item" id = "sortByFlighNumber" >Flight number</a>
            <a class="dropdown-item" id = "sortByDepartureAirport" >Departure airport</a>
            <a class="dropdown-item" id = "sortByArrivalAirport" >Arrival airport</a>
            <a class="dropdown-item" id = "sortByPrice" >Price</a>
            <a class="dropdown-item" id = "sortByDepartureDate" >Departure date</a>
            <a class="dropdown-item" id = "sortByArrivalDate" >Arrival date</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item">
                <div class="checkbox">
                    <label>
                        Descending <input type="checkbox" id = "sortDescending">
                    </label>
                 </div>
            </a>
            
        </div>
    </div>
`;




const reserveTemplateFlight = (flight, selected) => `
    <button data-id = "${flight.id}" type="button" class="list-group-item list-group-item-action ${flight.id == selected ? "pickFlight" : ""}">
        <div class="card-body">
            <div class="row">
                <div class="col-md-3" style="">
                <h5 class="">${flight.number}</h5>
                </div>
                <div class="col-md-3" style="">
                <h5 class="">${flight.flyingFrom.name}</h5>
                <h6 class="">${getDateTime(flight.departure)}</h6>
                </div>
                <div class="col-md-3 d-flex flex-grow-1" style="">
                <h5 class="w-100 text-center">---------------------&gt;</h5>
                </div>
                <div class="col-md-3" style="">
                <h5 class="text-right">${flight.flyingTo.name}</h5>
                <h6 class="text-right">${getDateTime(flight.arrival)}</h6>
                </div>
            </div>
        </div>
    </button>
`;


//<button class="btn w-25 disabled btn-success" id = "btnStepTwo">Next</button>



const reserveTemplateStepOne = (flights) => `
    <div class="py-5">
        <div class="container">
        <div class="row">
            <div class="col-md-12">
            <div class="card text-center">
                <div class="card-header" >Pick departure flight</div>
                <div class="card-body">
                <div class="col-md-12">
                    <div class="list-group" id="departureFlights">
                        ${flights}
                    </div>
                    <br>
                </div>
               
                </div>
                <div class="card-footer text-muted d-flex justify-content-end align-items-center" >
                    <h6 class="w-75 text-left">Step 1</h6><button class="btn w-25 disabled btn-success" id = "btnStepTwo">Next</button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
`;

const reserveTemplateStepTwo = (flights) => `
    <div class="py-5">
        <div class="container">
        <div class="row">
            <div class="col-md-12">
            <div class="card text-center">
                <div class="card-header" >Pick arrival flight</div>
                <div class="card-body">
                <div class="col-md-12">
                    <div class="list-group" id = "arrivalFlights">
                        ${flights}
                    </div>
                    <br>
                </div>
                
                </div>
                <div class="card-footer text-muted d-flex justify-content-end align-items-center">
                    <h6 class="w-75 text-left">Step 2</h6><button class="btn w-25 btn-info mr-1" id="stepTwoGoBackBtn">Go back</button>
                    <button class="btn w-25 btn-success" id="btnStepThree">Next</button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
`;

const seatButtonTemplate = (seatNo, type, selectedId) => `
    <button class="btn btn-info m-1 ${seatNo == selectedId ? "pickSeat" : ""}" data-id = "${seatNo}" data-type = ${type} >${seatNo}</button>
`;


const reserveTemplateStepThree = (departureSeats, arrivalSeats, selectedDepartureSeat, selectedArrivalSeat) => `
    <div class="py-5">
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="card text-center">
            <div class="card-header" > Pick seats</div>
            <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                <div class="card d-flex justify-content-start">
                    <div class="card-body">
                        <h5 class="card-title">Departure flight:</h5>
                        <div class = "container-fluid" id = "departureSeats">
                            ${departureSeats !== null ? departureSeats.reduce((html, seat) => html + seatButtonTemplate(seat, "departure", selectedDepartureSeat), '') : ""}
                        </div>
                    </div>
                </div>
                </div>
                <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">Arrival flight:</h5>
                    <div class = "container-fluid" id = "arrivalSeats">
                        ${arrivalSeats !== null ? arrivalSeats.reduce((html, seat) => html + seatButtonTemplate(seat, "arrival", selectedArrivalSeat), '') : ""}
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="card-footer text-muted d-flex justify-content-end align-items-center">
            <h6 class="w-75 text-left">Step 3</h6><button class="btn w-25 btn-info mr-1" id="stepThreeGoBackBtn">Go back</button>
            <button class="btn w-25 btn-warning mr-1 disabled" id="btnReserve">Reserve</button>
            <button class="btn w-25 btn-success disabled" id="btnBuy">Buy</button>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>

`;

{/* <a href = "${app.baseURI}flight/${ticket.departureFlight.id}"></a> */}

const ticketTemplate = (ticket) =>  `
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="card">
            <div class="card-header">Ticket</div>
            <div class="card-body">
            <blockquote class="blockquote mb-0">
                <div class="row">
                <div class="col-md-6">
                    <h5 class="">Departure:</h5>
                </div>
                <div class="col-md-6">
                    <h5 class="">Arrival:</h5>
                </div>
                </div>
            </blockquote>
            <div class="row border-bottom">
                <div class="col-md-6">
                <div class="row border-right">
                    <div class="col-md-3" style="">
                            <a href = "${ticket.departureFlight !== null ? app.baseURI + `flight/` + ticket.departureFlight.id : `#`}">
                                <h5 class="">${ticket.departureFlight !== null ? ticket.departureFlight.number : ""}</h5>
                            </a>
                    </div>
                    <div class="col-md-3" style="">
                    <h5 class="">${ticket.departureFlight !== null ? ticket.departureFlight.flyingFrom.name : ""}</h5>
                    <h6 class="">${ticket.departureFlight !== null ? getDateTime(ticket.departureFlight.departure) : ""}</h6>
                    </div>
                    <div class="col-md-3 d-flex flex-grow-1" style="">
                    <h5 class="w-100 text-center">-------&gt;</h5>
                    </div>
                    <div class="col-md-3" style="">
                    <h5 class="text-right">${ticket.departureFlight !== null ? ticket.departureFlight.flyingTo.name : ""}</h5>
                    <h6 class="text-right">${ticket.departureFlight !== null ? getDateTime(ticket.departureFlight.arrival) : ""}</h6>
                    </div>
                </div>
                </div>
                <div class="col-md-6">
                <div class="row">
                    <div class="col-md-3" style="">
                        <a href = "${ticket.arrivalFlight !== null ? app.baseURI + `flight/` + ticket.arrivalFlight.id : "#"}">
                            <h5 class="">${ticket.arrivalFlight !== null ? ticket.arrivalFlight.number : ""}</h5>
                        </a>
                    </div>
                    <div class="col-md-3" style="">
                    <h5 class="">${ticket.arrivalFlight !== null ? ticket.arrivalFlight.flyingFrom.name : ""}</h5>
                    <h6 class="">${ticket.arrivalFlight !== null ? getDateTime(ticket.arrivalFlight.departure) : ""}</h6>
                    </div>
                    <div class="col-md-3 d-flex flex-grow-1" style="">
                    <h5 class="w-100 text-center">-------&gt;</h5>
                    </div>
                    <div class="col-md-3" style="">
                    <h5 class="text-right">${ticket.arrivalFlight !== null ? ticket.arrivalFlight.flyingTo.name : ""}</h5>
                    <h6 class="text-right">${ticket.arrivalFlight !== null ? getDateTime(ticket.arrivalFlight.arrival) : ""}</h6>
                    </div>
                </div>
                </div>
            </div>
            <div class="row border-bottom">
                <div class="col-md-6 d-flex align-items-center justify-content-center border-right">
                <h5 class="">Seat no:&nbsp;${ticket.departureFlightSeatNumber !== null ? ticket.departureFlightSeatNumber: ""}</h5>
                </div>
                <div class="col-md-6 d-flex justify-content-center align-items-center">
                <h5 class="">Seat no:&nbsp;${ticket.arrivalFlightSeatNumber !== null ? ticket.arrivalFlightSeatNumber: ""}</h5>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 d-flex justify-content-center align-items-center border-right">
                <h5 class="">Reservation date: &nbsp;${ticket.reservationDate !== null ? getDateTime(ticket.reservationDate) : ""}</h5>
                </div>
                <div class="col-md-4 d-flex justify-content-center align-items-center border-right">
                <h5 class="">Ticket sale date: &nbsp;${ticket.ticketSaleDate !== null ? getDateTime(ticket.ticketSaleDate) : ""}</h5>
                </div>
                <div class="col-md-4 d-flex justify-content-center align-items-center">
                <a href = "${ticket.user !== null ? app.baseURI + `user/` + ticket.user.id : "#"}">
                    <h5 class="">Reserved by: ${ticket.user.firstName !== null ? ticket.user.firstName : ""}&nbsp;${ticket.user.lastName !== null ? ticket.user.lastName : ""}</h5>
                </a>
                </div>
            </div>
            <div class="row">
            <div class="col-md-12 border-top">
                <h5 class="m-2" >Price:&nbsp;${ticket.price.total}</h5>
            </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    
`;

const ticketConfirmTemplate = `
    <div class="py-5">
        <div class="container">
        <div class="row">
            <div class="col-md-12">
            <div class="card text-center">
                <div class="card-header"> Confirm</div>
                <div class="card-body">
                <h5 class="card-title">Are you happy with your ticket?</h5>
                <br/>
                <button class="btn mr-3 btn-danger" id = "stepFourGoBackBtn">No, go back</button>
                <button class="btn btn-success" id = "finalizeTicketBtn">Yes, proceed</a>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
`;


const changeTicketTemplate = (departureSeats, arrivalSeats, departureSeatSelected, arrivalSeatSelected) => `
    <div class="py-5">
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="card text-center">
            <div class="card-header" > Change </div>
            <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                <div class="card d-flex justify-content-start">
                    <div class="card-body">
                        <h5 class="card-title">Departure flight:</h5>
                        <div class = "container-fluid" id = "departureSeats">
                            ${departureSeats !== null ? departureSeats.reduce((html, seat) => html + seatButtonTemplate(seat, "departure", departureSeatSelected), '') : ""}
                        </div>
                    </div>
                </div>
                </div>
                <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">Arrival flight:</h5>
                    <div class = "container-fluid" id = "arrivalSeats">
                        ${arrivalSeats !== null ? arrivalSeats.reduce((html, seat) => html + seatButtonTemplate(seat, "arrival", arrivalSeatSelected), '') : ""}
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="card-footer text-muted d-flex justify-content-end align-items-center">
            <h6 class="w-75 text-left"></h6>
            <button class="btn w-25 btn-danger mr-2" id="btnDeleteReservation" >Delete reservation</button>
            <button class="btn w-25 btn-success mr-2" id="btnSaveReservationChanges">Save changes</button>
            <button class="btn w-25 btn-success" id="btnBuy">Buy</button>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>

`;


const optionAirport = (airport) => `
    <option value="${airport.id}">${airport.name}</option>
`;

//option type: optionFlight and others - generic
const selectOptionsTemplate = (selectionId, optionType, objects) => `
    <select class = "dropdownSelection rounded w-100" id="${selectionId}">
        ${objects !== null ? objects.reduce((html, object) => html + optionType(object), '') : ""}
    </select>
`;



const changeFlightTemplate = (flight, airports) => `
    <div class="py-5" style="" >
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="card text-center">
            <div class="card-header"> Manage flight</div>
            <div class="card-body">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Arrival date:</h5>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <input type="date" class="form-control" id="changeArrivalDate" value = "${dateInputFieldFormat(getDateTime(flight.arrival))}">
                        <input type="time" class="form-control" id="changeArrivalTime" value = "${timeInputFieldFormat(getDateTime(flight.arrival))}">
                    </div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br/>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Departure airport:</h5>
                </div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <div class="btn-group w-100">
                    ${selectOptionsTemplate("departureAirportSelections", optionAirport, airports)}
                </div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br/>
            <br/>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Arrival airport:&nbsp;</h5>
                </div>
                <div class="col-md-3 d-flex justify-content-center align-items-center flex-grow-1">
                <div class="btn-group w-100">
                     ${selectOptionsTemplate("arrivalAirportSelections", optionAirport, airports)}
                </div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br/>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <div class="col-md-12 d-flex justify-content-center align-items-center">
                    <h5 class="">Number of seats:</h5>
                </div>
                </div>
                <div class="col-md-3">
                <div class="form-group"><label></label><input type="number" class="form-control" id="flightChangeNumberOfSeats" value = "${flight.numberOfSeats}"></div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Price:</h5>
                </div>
                <div class="col-md-3">
                <div class="form-group"><label></label><input type="number" class="form-control" id="flightChangePrice" value = "${flight.price}"></div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3" ></div>
                <div class="col-md-3"></div>
                <div class="col-md-3"></div>
            </div>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3"><button class="btn w-75 btn-success" id="updateFlightButton">Save</button></div>
                <div class="col-md-3"><button class="btn w-75 btn-danger" id="deleteFlightButton">Delete flight</button></div>
                <div class="col-md-3"></div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>
`;

            

const flightReservationsTemplate = (ticket) => `
    <li class="list-group-item d-flex justify-content-between align-items-center" ><a href = "${app.baseURI}ticket/${ticket.id}" >${getDateTime(ticket.reservationDate)}</a></li>
`;

const flightTicketsTemplate = (ticket) => `
    <li class="list-group-item d-flex justify-content-between align-items-center" ><a href = "${app.baseURI}ticket/${ticket.id}">${getDateTime(ticket.ticketSaleDate)}</a></li>
`;

const flightReservationsTicketsOverviewTemplate = (reservationsTable, ticketsTable) =>  `
    <div class = "col-md-12">
    <div class = "container">
    <div class = "row">
    <div class="col-md-12 bg-light rounded" >
        <ul class="nav nav-tabs">
        <li class="nav-item"> <a class="active nav-link userResTicketNav" href = "" data-toggle="tab" data-target="#tabone">Reservations</a> </li>
        <li class="nav-item"> <a class="nav-link userResTicketNav" href = "" data-toggle="tab" data-target="#tabtwo">Tickets</a> </li>
        </ul>
        <div class="tab-content mt-2">
        <!-- Reservations: -->
        <div class="tab-pane fade show active" id="tabone" role="tabpanel">
            ${reservationsTable}
        </div>
        <!-- Tickets: -->
        <div class="tab-pane fade" id="tabtwo" role="tabpanel">
            ${ticketsTable}
        </div>
        <div class="tab-pane fade" id="tabthree" role="tabpanel">
            <p class="">In my soul and absorb its power, like the form of a beloved mistress, then I often think with longing.</p>
        </div>
        </div>
    </div>
    </div>
    </div>
    </div>
    
`;

const flightTicketsRow = (ticket, flightId) => `
    <tr>
        <td>${ticket.id}</td>
        <td><a href = "${app.baseURI}ticket/${ticket.id}">${getDateTime(ticket.ticketSaleDate !== null ? ticket.ticketSaleDate : ticket.reservationDate)}</a></td>
        <td>${ticket.departureFlight.id == flightId ? ticket.departureFlightSeatNumber + " (departure)" : ticket.arrivalFlightSeatNumber + " (arrival)"}</td>
        <td><a href = "${app.baseURI}user/${ticket.user.id}">${ticket.user.firstName}&nbsp;${ticket.user.lastName}<a/></td>
    </tr>
`;

const flightResevationsTableTemplate = (rows) => `
    <div class="card">
    <div class="card-header" style="" >
    <div class="dropdown" style="display: inline;">
        <button class="btn dropdown-toggle btn-info w-25" type="button" data-toggle="dropdown" aria-haspopup="true" id="dropdownMenuButton" aria-expanded="false"> Sort by </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="sortMenu">
            <a class="dropdown-item" id="sortReservationsByDate">Date</a>
            <a class="dropdown-item" id="sortReservationsBySeat">Seat no.</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item">
                <div class="checkbox">
                <label> Descending <input type="checkbox" id="sortReservationsDescending">
                </label>
                </div>
            </a>
        </div>
    </div>
    </div>
    <div class="card-body">
    <table class="table">
        <thead id="heading">
        <tr>
            <th class="w-10">#</th>
            <th class="w-15">Date</th>
            <th class="w-15">Seat no.&nbsp;</th>
            <th class="w-20">User</th>
        </tr>
        </thead>
        <tbody id="rows">
            ${rows}
        <!-- Example -->
        <!-- <tr>
          <td>1</td>
          <td><a href="${app.baseURI}user/1">2018-12-02 23:00:00</a></td>
          <td>12 (departure)</td>
          <td>Petar Petrovic</td>
        </tr> -->
        </tbody>
    </table>
    </div>
    </div>
    <br/>
`;

const flightTicketsTableTemplate = (rows) => `
    <div class="card">
    <div class="card-header" style="" >
    <div class="dropdown" style="display: inline;">
        <button class="btn dropdown-toggle btn-info w-25" type="button" data-toggle="dropdown" aria-haspopup="true" id="dropdownMenuButton" aria-expanded="false"> Sort by </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="sortMenu">
            <a class="dropdown-item" id="sortTicketsByDate">Date</a>
            <a class="dropdown-item" id="sortTicketsBySeat">Seat no.</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item">
                <div class="checkbox">
                <label> Descending <input type="checkbox" id="sortTicketsDescending">
                </label>
                </div>
            </a>
        </div>
    </div>
    </div>
    <div class="card-body">
    <table class="table">
        <thead id="heading">
        <tr>
            <th class="w-10">#</th>
            <th class="w-15">Date</th>
            <th class="w-15">Seat no.&nbsp;</th>
            <th class="w-20">User</th>
        </tr>
        </thead>
        <tbody id="rows">
            ${rows}
        <!-- Example -->
        <!-- <tr>
          <td>1</td>
          <td><a href="${app.baseURI}user/1">2018-12-02 23:00:00</a></td>
          <td>12 (departure)</td>
          <td>Petar Petrovic</td>
        </tr> -->
        </tbody>
    </table>
    </div>
    </div>
    <br/>
`;


const addFlightTemplate = (flight, airports) => `
    <div class="py-5" style="" >
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="card text-center">
            <div class="card-header"> Create a new flight</div>
            <div class="card-body">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Flight number:</h5>
                </div>
                <div class="col-md-3">
                <div class="form-group"><label></label><input type="text" class="form-control" id="numberInput" value = ""></div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                    <h5 class="">Departure date:</h5>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <input type="date" class="form-control" id="departureDateInput">
                        <input type="time" class="form-control" id="departureTimeInput">
                    </div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                    <h5 class="">Arrival date:</h5>
                </div>
                <div class="col-md-3">
                    <div class="form-group">
                        <input type="date" class="form-control" id="arrivalDateInput">
                        <input type="time" class="form-control" id="arrivalTimeInput">
                    </div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br/>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Departure airport:</h5>
                </div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <div class="btn-group w-100">
                    ${selectOptionsTemplate("departureAirportSelections", optionAirport, airports)}
                </div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br/>
            <br/>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Arrival airport:&nbsp;</h5>
                </div>
                <div class="col-md-3 d-flex justify-content-center align-items-center flex-grow-1">
                <div class="btn-group w-100">
                     ${selectOptionsTemplate("arrivalAirportSelections", optionAirport, airports)}
                </div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br/>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <div class="col-md-12 d-flex justify-content-center align-items-center">
                    <h5 class="">Number of seats:</h5>
                </div>
                </div>
                <div class="col-md-3">
                <div class="form-group"><label></label><input type="number" class="form-control" id="numberOfSeatsInput" value = "${flight.numberOfSeats}"></div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3 d-flex justify-content-center align-items-center">
                <h5 class="">Price:</h5>
                </div>
                <div class="col-md-3">
                <div class="form-group"><label></label><input type="number" class="form-control" id="priceInput" value = "${flight.price}"></div>
                </div>
                <div class="col-md-3"></div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-4" ></div>
                <div class="col-md-4 d-flex justify-content-center align-items-center"><button class="btn btn-info w-75" id = "createFlightButton">Add flight</button></div>
                <div class="col-md-4"></div>
              </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>
`;

const reportByAirportContainerTemplate = (airportReportTemplates) => `
    <div class="py-5">
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="card">
            <div class="card-header align-items-center justify-content-end">
                    <div class="row">
                    <div class="col-md-6 d-flex justify-content-start align-items-center">
                        <h6 class="">Report by airport</h6>
                    </div>
                    <div class="col-md-6 d-flex justify-content-end" >
                        <button class="btn dropdown-toggle btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" id="dropdownMenuButton" aria-expanded="false"> Sort by </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id="sortMenu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(15px, 38px, 0px);">
                        <a class="dropdown-item sortButton" id="sortByNumberOfFlights">Number of flights</a>
                        <a class="dropdown-item sortButton" id="sortByNumberOfTickets">Number of tickets</a>
                        <a class="dropdown-item sortButton" id="sortByTotalRevenue">Total revenue</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item">
                            <div class="checkbox">
                            <label> Descending <input type="checkbox" id="sortDescending">
                            </label>
                            </div>
                        </a>
                        </div>
                    </div>
                    </div>
            </div>
            <div class="card-body">
            <div class="row">
                ${airportReportTemplates}
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>
`;


const airportReportTemplate = (report) =>`
        <div class="col-md-6 d-flex justify-content-center align-items-center">
              <div class="card m-2 w-100">
                <div class="card-header">${report.airportName}</div>
                <div class="card-body">
                  <blockquote class="blockquote mb-0">
                    <div class="row">
                      <div class="col-md-6 border-right border-bottom">
                        <h5 class="d-flex justify-content-center align-items-center">Number of flights:</h5>
                      </div>
                      <div class="col-md-6 border-bottom">
                        <h5 class="d-flex justify-content-center align-items-center">${report.numberOfFlights}</h5>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6 border-right border-bottom">
                        <h5 class="d-flex justify-content-center align-items-center">Number of tickets:</h5>
                      </div>
                      <div class="col-md-6 d-flex justify-content-center align-items-center border-bottom">
                        <h5 class="">${report.numberOfTickets}</h5>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6 d-flex justify-content-center align-items-center border-right">
                        <h5 class="">Total revenue:</h5>
                      </div>
                      <div class="col-md-6 d-flex justify-content-center align-items-center">
                        <h5 class="">${report.totalRevenue.toFixed(2)}</h5>
                      </div>
                    </div>
                  </blockquote>
                </div>
              </div>
            </div>
`;

const allTimeReportTemplate = (allTimeReport) => `
    <div class="py-5">
    <div class="container">
    <div class="row">
        <div class="col-md-12">
        <div class="card">
            <div class="card-header d-flex justify-content-center align-items-center" > All time</div>
            <div class="card-body">
            <div class="row">
                <div class="col-md-4 border-right d-flex justify-content-center align-items-center">
                <h5 class="">Total flights:&nbsp;${allTimeReport.totalFlights}</h5>
                </div>
                <div class="col-md-4 border-right d-flex justify-content-center align-items-center">
                <h5 class="">Total tickets:&nbsp;${allTimeReport.totalTickets}</h5>
                </div>
                <div class="col-md-4 d-flex justify-content-center align-items-center">
                <h5 class="">Total revenue:&nbsp;${allTimeReport.totalRevenue.toFixed(2)}</h5>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>
`;


const rangeAirportReportsTemplate = `
<div class="py-5">
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body" >
          <div class="row">
            <div class="col-md-6">
              <h6 class="d-flex justify-content-center align-items-center">From:</h6>
            </div>
            <div class="col-md-6 d-flex justify-content-center align-items-center">
              <h6 class="">To:</h6>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 border-right">
              <input type="date" class="rounded w-50" id = "dateLowInput"><input type="time" class="w-50 rounded" id = "timeLowInput">
            </div>
            <div class="col-md-6">
              <input type="date" class="w-50 rounded" id = "dateHighInput"><input type="time" class="w-50 rounded" id = "timeHighInput">
            </div>
          </div>
          <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4 d-flex justify-content-center align-items-center"><a class="btn btn-info m-2" id = "rangeReportButton">Go</a></div>
            <div class="col-md-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
`;
