//Movie constructor
class Movie {
  constructor(id, title, genre, year, rating = 0, favorite = false) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.year = year;
    this.rating = rating;
    this.favorite = favorite;
  }
}

// Ui Constructor
class UI {
  //lagre til local storage
  static getMovies() {
    return JSON.parse(localStorage.getItem("movies")) || [];
  }
  static saveMovies(movies) {
    localStorage.setItem("movies", JSON.stringify(movies));
  }
  //legg til movie i listen
  static addMovieToList(movie) {
    const list = document.querySelector("#movie-list");
    const { id, title, genre, year, rating } = movie;
    //lag tr element
    const row = document.createElement("tr");
    row.dataset.id = id;
    //legg inn colonner
    row.innerHTML = `
  <td>${movie.title}</td>
  <td>${movie.genre}</td>
  <td>${movie.year}</td>
  <td class="rating">${UI.renderStars(rating)}</td>
  <td><a href="#" <i class="fa-solid fa-pencil"></i><td>
  <td><a href="#" class="delete">X</a></td>

  `;
    list.appendChild(row);
  

  }
  static renderStars(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<i class="fa-solid fa-star ${
        i <= rating ? "active" : ""
      }" data-value="${i}"></i>`;
    }
    return html;
  }
  static deleteMovie(id) {
    const movies = UI.getMovies().filter((m) => m.id !== id);
    UI.saveMovies(movies);
    UI.displayMovies();
  }

  static updateRating(id, newRating) {
    const movies = UI.getMovies().map((movie) =>
      movie.id === id ? { ...movie, rating: newRating } : movie
    );
    UI.saveMovies(movies);
    UI.displayMovies();
  }
  static displayMovies() {
    const list = document.querySelector("#movie-list");
    list.innerHTML = "";
    const movies = UI.getMovies();
    movies.map((movie) => UI.addMovieToList(movie));
  }
  static showAlert(message, className) {
    //lag div, legg til klasse og tekst
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.textContent = message;
    //hent containeren og form
    const container = document.querySelector(".container");
    const form = document.querySelector("#movie-form");
    // sett inn alert
    container.insertBefore(div, form);
    // Timeout etter 3 sek
    setTimeout(() => div.remove(), 3000);
  }
  static clearFields() {
    //clear ut feltene
    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("year").value = "";

    //nullstill stjernene
    const stars = document.querySelectorAll("#rating-stars i");
    stars.forEach((star) => star.classList.remove("active"));
    rating = 0;
  }
}

//legg til film
// targeter og legger til event listener for å legge til en film
document.querySelector("#movie-form").addEventListener("submit", (e) => {
  e.preventDefault();
  //henter form valuene
  const title = document.querySelector("#title").value.trim();
  const genre = document.querySelector("#genre").value.trim();
  const year = document.querySelector("#year").value.trim();
  // instantere UI
  // const ui = new UI();
  // validere
  if (!title || !genre || !year) {
    // error alert
    UI.showAlert("Vennligst fyll inn alle felt", "error");
    return;
  }
  // instanrere movie
  const movie = new Movie(Date.now().toString(), title, genre, year, rating || 0);
  const movies = UI.getMovies();
  movies.push(movie);
  UI.saveMovies(movies);
  UI.displayMovies();
  UI.showAlert("Film lagt til!", "success");
  UI.clearFields();
});

// Slett film
// Event listener for delete
document.querySelector("#movie-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.closest("tr").dataset.id;
    UI.deleteMovie(id);
    UI.showAlert("Film fjernet!", "success");
    e.preventDefault();
  }
// Event listener for edit (uferdig)
// document.querySelector("#movie-list").addEventListener("click", (e) => {
//   if (e.target.classList.contains("edit")){

//   }
// })
  //Klikk på stjernene
  if (e.target.classList.contains("fa-star")) {
    const id = e.target.closest("tr").dataset.id;
    const newRating = parseInt(e.target.dataset.value);
    UI.updateRating(id, newRating);
  }
});

//   clearFields() {
//     //clear ut feltene
//     document.getElementById("title").value = " ";
//     document.getElementById("genre").value = " ";
//     document.getElementById("year").value = " ";
//   }
// }

// hent stjernene fra html for å manipulere de
let rating = 0;
const stars = document.querySelectorAll("#rating-stars i");

// loop gjennom stars nodeslisten
stars.forEach((star, index1) => {
  //legg til eventlistener for klikk
  star.addEventListener("click", () => {
    rating = index1 + 1;
    // loop gjennom på nytt
    stars.forEach((star, index2) => {
      // legg til "active" klasse på stjernen som er klikket på og stjerner med lavere index, og fjern "active" klassen fra stjerner med høyre index
      index1 >= index2
        ? star.classList.add("active")
        : star.classList.remove("active");
    });
  });
});
