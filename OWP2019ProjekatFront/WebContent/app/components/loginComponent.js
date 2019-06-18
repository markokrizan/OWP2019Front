let loginComponent = {
    name: 'login',
    model: {
      formData: {},
      formInputs : []
    },
    view(model){
      return loginTemplate;
     
    },
    controller(model){
      
    },
    clickHandler(e){
    
      let username = document.getElementById("user_name_input").value;
      let password = document.getElementById("password_input").value;
      api
        .login(username, password)
        .then(result => {
          if(result.status == "error"){
            alertify.error(result.trace);
            return;
          }
          console.log(result);
          app.login(result.trace);
        })
      e.preventDefault();
    },
    registerListeners(){
      let submitButton = document.getElementById("login_button");
      submitButton.addEventListener("click", this.clickHandler);
      
    }
  }