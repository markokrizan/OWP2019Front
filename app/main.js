//http-server -p 8081
//Instanca aplikacije kojoj se prosledjuje html selektor aplikacije
const app = new App('#app');
//Instanca klase koja ima informacije i pozive ka APIju
const api = new API();

const dogTemplate = (dog) => `
<section class="dog-listing">
  <a href="#/dogs/${dog.id}">
    <h3 class="name">${dog.name}</h3>
    <section>
      <figure>
        <img src="${dog.imageUrl}" alt="${dog.name}" />
        <figcaption>${dog.imageCaption}</figcaption>
      </figure>
      <p>${dog.description}</p>
    </section>
  </a>
</section>
`;

//dodaj komponentu koja je objekat koji ima name, model, view i kontroler
//svaka komponenta ima MVC! 
app.addComponent({
  name: 'dogs',
  model: {
    dogs: []
  },
  //view prihvati model (listu podataka) i ubaci u template i vrati gotov view
  view(model) {
    //kreiraj listu napravljenih templejta u koji su ugurani podaci
    const dogsHTML = model.dogs.reduce((html, dog) => html + `<li>${dogTemplate(dog)}</li>`, '')
    return `
      <ul class="dogs">
        ${dogsHTML}
      </ul>
    `;
  },
  //kontroler prihvata model da moze da apdejtuje sa novim podacima
  //koji su fetch-ova iz apija
  controller(model) {
    api
      .getDogs()
      .then(result => {
        model.dogs = result.dogs;
      });
  }
});

//komponenta pojedinacnog elementa kolekcije
//koristi isti template
app.addComponent({
  name: 'dog',
  model: {
    dog: {}
  },
  view(model) {
    return dogTemplate(model.dog);
  },
  controller(model) {
    api
      .getDog(router.params[1])
      .then(result => {
        //data binding uskace i menja kolekciju i osvezava
        model.dog = result.dog;
      });
  }
});

const router = new Router(app);
//ime komponente, trenutni url (regExp)
router.addRoute('dogs', '^#/dogs$');
//za pojedinacni element
router.addRoute('dog', '^#/dogs/([0-9]*)$');
