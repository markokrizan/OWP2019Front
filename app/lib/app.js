class App {
  constructor(selector) {
    //vezi selektor sa instancom aplikacije
    this.appElement = document.querySelector(selector);
    //belezi sve komponente u parovima ime : ceo objekat?
    this.componentsByName = {};
  }

  //
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
    } else {
      //ako je los url daj neki not found
      this.appElement.innerHTML = '<h3>Not Found</h3>';
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
