class Router {
  constructor(app) {
    this.app = app;
    //belezi sve rute
    this.routes = [];

    //da bi se bindovalo za instancu rutera a ne za window
    this.hashChange = this.hashChange.bind(this);

    //event za promenu url-a posle i ukljucujuci # simbol
    //proveri da li je moguce na neki drugi nacin da nema #
    window.addEventListener('hashchange', this.hashChange);
    //event za prvo ucitavanje
    window.addEventListener('DOMContentLoaded', this.hashChange);
  }
  //dodaj novu rutu
  addRoute(name, url) {
    this.routes.push({
      name,
      url
    });
  }
  hashChange() {
    //od http://www.example.com/test.htm#part2 vraca #part2
    const hash = window.location.hash;
    //prodji kroz sve rute i ako ima neka da se mecuje sa url-om vrati je
    const route = this.routes.filter(route => hash.match(new RegExp(route.url)))[0];


    if(route) {
      //nadji id pojedinacnog elementa iz trenutnog url-a
      //sto znaci da mozes tek ovde da dodas novo polje 
      this.params = new RegExp(route.url).exec(hash);

      //promenio se url i sad ucitaj tu komponentu sa url-a
      this.app.showComponent(route.name);
    } else {
      //pozovi bez argumenata pa tu moze da se ubaci u toj funkciji
      //neki 404 ili tako nesto
      this.app.showComponent();
    }
  }
}
