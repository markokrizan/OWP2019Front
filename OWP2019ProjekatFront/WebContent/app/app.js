class App {
  constructor(selector) {
    //vezi selektor sa instancom aplikacije
    this.appElement = document.querySelector(selector);
    //belezi sve komponente u parovima ime : ceo objekat?
    this.componentsByName = {};
    //globalni listener
    //document.addEventListener("click", this.clickHandler);

    //base URI:
    this.baseURI = "http://localhost:8080/airline-app/#/";
    this._loggedInRole = null;
    //this._loggedInRole = loggedInRole(localStorage.getItem("role"));
    
  }

  

  get loggedInRole() {
    return this._loggedInRole;
  }

  set loggedInRole(val) {
    this._loggedInRole = val;
    this._onPropertyChanged('loggedInRole', val);
  }

  _onPropertyChanged(propName, val) {
      //loggedInUser property change listener:
      //role - view change layer
      //templates should hold role based info
      //this should be delegated somewhere else:
      postLoginViewChange(val);
  }

  loggedInChecker(){
    let userId = localStorage.getItem("userId");
    if(userId == null || userId == 0 || userId == undefined){
      window.location.replace(`${this.baseURI}login`);
    }else{
      return userId;
    }
  }

  login(token){
    if(token == null){
      alertify.error('Login failed');
      return;
    }
    //save token itself:
    localStorage.setItem('token', token);
    //save token data to key "user"
    savePayloadData();
    //update app's loggedInRole field for view modifications:
    loginNotify();
  }

  logout(){
    localStorage.clear();
    //Doesent work, whyy???
    //this.loggedInRole = null;
    //HACK:
    postLoginViewChange(null);
    window.location.replace(`http://localhost:8080/airline-app/#/flights`);
  }

  collectionSorter(collection, propCriteria, descending){
    let sortedCollection = collection;
    if (descending){
      sortedCollection.sort(function (a, b) {
        return ('' + b[propCriteria]).localeCompare(a[propCriteria]);
      })
    }else{
      sortedCollection.sort(function (a, b) {
        return ('' + a[propCriteria]).localeCompare(b[propCriteria]);
      })
    }
    return sortedCollection;
  }

  

  findById(id, collection){
    let item = null;
    console.log(collection);
    for (let i = 0, len = collection.length; i < len; i++) {
      console.log(collection[i].id);
      if(collection[i].id == id){

        item = collection[i];
      }
    }
    console.log(item);
    return item;

    // let item = null;
    // collection.forEach(function(i) {
    //   if(i.id == id){
    //     item = i;
    //   }
    // });
    // return item;
  }

  addComponent(component) {
    //dodaj objekat nove komponente
    this.componentsByName[component.name] = component;
    //data binding mehanizam u sustini, dodaje interseptor
    //setera i getera za dati izvor podataka
    component.model = this.proxify(component.model);
  }
  //ovde ruter prosledjuje ime rute
  showComponent(name) {
    //nadji komponentu po tom imenu
    this.currentComponent = this.componentsByName[name];

    //ako si nasao
    if(this.currentComponent) {
      //pozovi controller funkciju te komponente koja salje zahtev za podacima
      this.currentComponent.controller(this.currentComponent.model);

      
    }
    //osvezi view kad je dodata, a pri bindingu takodje u proxify
    this.updateView();
  }

  updateView() {
    //zameni unutrasnji html glavnog app elementa sa onim sto je view te komponente vratio (template u koji su ugurani podaci)
    if(this.currentComponent) {
      

      this.appElement.innerHTML = this.currentComponent.view(this.currentComponent.model);

      
      //register listeners for template's user controls
      this.currentComponent.registerListeners();

      //trigger nav logged in state if token present:
      if(localStorage.getItem("token") != null){
        this.loggedInRole = localStorage.getItem("role");
      }
     
      
      
    } 
  }


  //implementacija proxija = data binding-a
  proxify(model) {
    const self = this;
    //prvi par je target - kolekcija koja se nadgleda,
    //ostalo su hendleri
    return new Proxy(model, {
      set(target, property, value) {
        //log promene nad modelom
        console.log('Changing', property, 'from', target[property], 'to', value);
        target[property] = value;
        //sada ovde pozivamo update view da se prikaze nakon promene izvora podataka
        self.updateView();
        return true;
      }
    });
  }




}
