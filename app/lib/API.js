class API {
  constructor() {
    this.API_URL = 'https://barkwire-api.now.sh/dogs';
    //https://barkwire-api.now.sh/dogs
    //https://github.com/w3cj/c.js
    //neki radnom test api na placeholder-u: https://jsonplaceholder.typicode.com/posts
  }
  getDogs() {
    return fetch(this.API_URL)
      .then(res => res.json());
  }
  getDog(id) {
    return fetch(`${this.API_URL}/${id}`)
      .then(res => res.json());
  }
}
