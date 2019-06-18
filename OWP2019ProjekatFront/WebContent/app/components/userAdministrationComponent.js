let userAdministrationComponent = {
    name : 'userAdministration',
    model: {
      users : []
    },
    authorize(){
      console.log(localStorage.getItem("role") === "ADMIN");
      if(localStorage.getItem("role") === "ADMIN"){
        return true;
      }else{
        return false;
      }
    },
    view(model){
      if(!this.authorize()){
        app.showComponent("forbidden");
      }else{
        const userRows = model.users.reduce((html, user) => html + userAdministrationRow(user), '');
        return userAdministrationTable(userRows);
      }
      
    },
    controller(model){
      let self = this;
      api
        .sendRequest(`${api.API_URL}/user`, 'GET')
        .then(result => {
          model.users = result;
        });
      
    },
    eventHandler(element){
      let self = this;
      if(element.classList.contains("deleteUser")){
        let userId = element.dataset.id;
        api
          .sendRequest(`${api.API_URL}/user/${userId}/delete`, 'DELETE')
          .then(result => {
            alertify.success("User succesfully deleted!", 1, function(){
              self.controller(self.model);
            });
          });
      }


      let elementId = element.id;
      let descending = document.getElementById("sortDescending").checked;
      switch(elementId) {
        case "sortByUserName":
          this.model.users = app.collectionSorter(this.model.users, "userName", descending);
          break;
        case "sortByRole":
          this.model.users = app.collectionSorter(this.model.users, "role", descending);
          break;
        case "userSearch":
          let query = document.getElementById("userSearch").value;
         
          api
          .sendRequest(`${api.API_URL}/user/search/${query}`, 'GET')
          .then(result => {
            this.model.users = result;
          });
          break;
        default:
          
      }
  
    },
    registerListeners(){
      let self = this;
      let userNameSortButton = document.getElementById("sortByUserName");
      let roleSortButton = document.getElementById("sortByRole");
      let searchInput = document.getElementById("userSearch");
      userNameSortButton.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      roleSortButton.addEventListener("click", function(){
        self.eventHandler(this);
      }, false);
      searchInput.addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode === 13) {
          self.eventHandler(this);
        }
      });


      //user delete buttons:
      let userDeleteButtons = document.getElementsByClassName("deleteUser");
      //add event listeners:
      for (var i = 0, len = userDeleteButtons.length; i < len; i++) {
        userDeleteButtons[i].addEventListener("click", function(e){
          self.eventHandler(e.currentTarget);
        }, false);
      }
    }
  }