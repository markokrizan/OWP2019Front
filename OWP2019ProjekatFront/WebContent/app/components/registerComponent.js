let registerComponent = {
    name: 'register',
    model: {
      newUser : {
        userName : null,
        firstName : null,
        lastName : null,
        password : null
      }
    },
    view(model){
      return registerTemplate;
     
    },
    validate(uname, fname, lname, p, rp){
      let validationMessage = "";
      if(uname === null || uname === ""){
        validationMessage += "&bull; Provide a username!\n";
      }else{
        this.model.newUser.userName = uname;
      }
      if(fname === null || fname === ""){
        validationMessage += "&bull; Provide a first name!\n";
      }else{
        this.model.newUser.firstName = fname;
      }
      if(lname === null || lname === ""){
        validationMessage += "&bull; Provide a last name!\n";
      }else{
        this.model.newUser.lastName = lname;
      }
      if(p === null || p.length < 6){
        validationMessage += "&bull; Provide a password with at least 6 characters!\n";
      }
      if(rp !== p){
        validationMessage += "&bull; Passwords didn't match!\n";
      }else{
        this.model.newUser.password = p;
      }
      return validationMessage;
      
    },
    controller(model){
      
    },
    eventHandler(e){
      
      let username = document.getElementById("userNameInput").value;
      let firstName = document.getElementById("firstNameInput").value;
      let lastName = document.getElementById("lastNameInput").value;
      let password = document.getElementById("passwordInput").value;
      let repeatedPassword = document.getElementById("repeatPasswordInput").value;
      
      let validationMessage = this.validate(username, firstName, lastName, password, repeatedPassword);
  
      if(validationMessage === ""){
        //pass:
        console.log(this.model.newUser);
        api
          .sendRequest(`${api.API_URL}/user/create`, 'POST', {}, JSON.stringify(this.model.newUser))
          .then(result => {
            //console.log(result);
            if(result.status === "error"){
              alertify.notify(result.trace, 'error', 10);
            }else{
              alertify.success("Registered successfully!", 1, function(){
                window.location.replace(app.baseURI + "login");
              });
            }
          });
      }else{
        //fail:
        alertify.notify(validationMessage, 'error', 10);
      }
  
  
    },
    registerListeners(){
      let self = this;
      let registerButton = document.getElementById("registerButton");
      registerButton.addEventListener("click", function(e){
        e.preventDefault();
        self.eventHandler(this);
      }, false);
    }
  }