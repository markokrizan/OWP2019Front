let changeUserComponent = {
    name : 'changeUser',
    model: {
      user : {},
      roles : []
    },
    authorize(){
      if(this.model.user.id == localStorage.getItem("userId") || localStorage.getItem("role") == "ADMIN"){
        return true;
      }else{
        app.showComponent("forbidden");
      }
    },
    view(model){
      if(localStorage.getItem("role") == "ADMIN"){
        return changeUserAdminTemplate(model.user, model.roles);
      }else{
        return changeUserTemplate(model.user);
      }

    },
    controller(model){
      let self = this;

      Promise.all([
        api.sendRequest(`${api.API_URL}/user/${router.params[1]}`, 'GET'),
        api.sendRequest(`${api.API_URL}/user/roles`, 'GET')
      ]).then(allResponses => {
        if(allResponses[0].blocked === true){
          app.showComponent("forbidden");
        }


        model.user = allResponses[0];
        model.roles = allResponses[1];
        //async, if model data needed for authentication this is the only time authorization method can be called:
        self.authorize();
      })
    },

    validate(uname, fname, lname, pass, rpass){
      let validationMessage = "";
      if(uname === null || uname === ""){
        validationMessage += "&bull; Provide a username!!\n";
      }else{
        this.model.user.userName = uname;
      }

      if(fname === null || fname === ""){
        validationMessage += "&bull; Provide a first name!!\n";
      }else{
        this.model.user.firstName = fname;
      }

      if(lname === null || lname === ""){
        validationMessage += "&bull; Provide a last name!!\n";
      }else{
        this.model.user.lastName = lname;
      }

      if(pass !== null || pass !== ""){
        if(rpass !== pass){
          validationMessage += "&bull; Passwords didn't match!\n";
        }else{
          this.model.user.password = pass;
        }
      }
      
      return validationMessage;
    },
    eventHandler(e){

      let self = this;

      let uname = document.getElementById("changeUserName").value;
      let fname = document.getElementById("changeUserFirstName").value;
      let lname = document.getElementById("changeUserLastName").value;
      let pass = document.getElementById("changeUserPassword").value;
      let rpass = document.getElementById("chageUserRepeatPassword").value;


      //if admin, no need for validation:
      let role = document.getElementById("rolesSelection").value;
      let blocked = document.getElementById("blockedCheck").checked;

      this.model.user.role = role;
      this.model.user.blocked = blocked;
  
      let validationMessage = this.validate(uname, fname, lname, pass, rpass);
      
      if(validationMessage === ""){
        //pass:
        console.log(this.model.user);
        api
          .sendRequest(`${api.API_URL}/user/update`, 'PUT', {}, JSON.stringify(this.model.user))
          .then(result => {
            //console.log(result);
            if(result.status === "error"){
              alertify.notify(result.trace, 'error', 10);
            }else{
              alertify.success("User changed succesfully!", 1, function(){
                window.location.replace(`${app.baseURI}user/${self.model.user.id}`);
              });
            }
          });
      }else{
        //fail:
        alertify.notify(validationMessage, 'error', 10);
      }
  
  
    },
    registerListeners(){
      if(localStorage.getItem("role") == "ADMIN"){
        //set role:
        document.getElementById("rolesSelection").value = this.model.user.role;
        //set blocked status:
        document.getElementById("blockedCheck").checked = this.model.user.blocked;;
      }
      
      let self = this;
      let changeUserButton = document.getElementById("changeUserButton");
      changeUserButton.addEventListener("click", function(e){
        e.preventDefault();
        self.eventHandler(this);
      }, false);
    }
  }