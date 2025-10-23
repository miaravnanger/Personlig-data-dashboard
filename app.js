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
  <td><a href="#" class="favorite"><i class="fa-solid fa-heart ${
    movie.favorite ? "fav" : ""
  }"></i></a></td>
  <td><a href="#" class="edit"><i class="fa-solid fa-pencil"></i></a><td>
  <td><a href="#" class="delete">X</a></td>
  `;
    list.appendChild(row);
  }
  static renderStars(rating) {
    return Array.from(
      { length: 5 },
      (_, i) =>
        `<i class="fa-solid fa-star readOnly-star ${
          i < rating ? "active" : ""
        }"></i>`
    ).join("");
  }

  //slett filme fra den synlige listen
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

  //vis filmene på siden
  static displayMovies() {
    const list = document.querySelector("#movie-list");
    const clearBtn = document.querySelector(".clearAll");
    const movies = UI.getMovies();
    list.innerHTML = "";
    movies.map((movie) => UI.addMovieToList(movie));
    // Gjør sånn at "tøm listen" knappen ikke vises med mindre det er noe i listen
    clearBtn.style.display = movies.length ? "inline-block" : "none";
  }

  // Lager en alert som kan brukes igjen
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
    setTimeout(() => div.remove(), 1500);
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
document.addEventListener("DOMContentLoaded", UI.displayMovies);
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

  //edit knapp

  const editingId = e.target.dataset.editing;
  const movies = UI.getMovies();
  if (editingId) {
    const updatedMovies = movies.map((movie) =>
      movie.id === editingId ? { ...movie, title, genre, year, rating } : movie
    );
    UI.saveMovies(updatedMovies);
    UI.displayMovies();
    UI.showAlert("Film oppdatert!", "success");
    e.target.removeAttribute("data-editing");
  } else {
    const movie = new Movie(
      Date.now().toString(),
      title,
      genre,
      year,
      rating || 0
    );
    movies.push(movie);
    UI.saveMovies(movies);
    UI.displayMovies();
    UI.showAlert("Film lagt til!", "success");
  }
  UI.clearFields();
});

document.querySelector("#movie-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.closest("tr").dataset.id;
    UI.deleteMovie(id);
    UI.showAlert("Film fjernet!", "success");
    e.preventDefault();
  }
  if (e.target.classList.contains("fa-heart")) {
    const id = e.target.closest("tr").dataset.id;
    const movies = UI.getMovies();
    const updatedMovies = movies.map((movie) =>
      movie.id === id ? { ...movie, favorite: !movie.favorite } : movie
    );
    UI.saveMovies(updatedMovies);
    UI.displayMovies();
  }
  //Klikk på stjernene
  if (e.target.classList.contains("fa-star")) {
    const id = e.target.closest("tr").dataset.id;
    const newRating = parseInt(e.target.dataset.value);
    UI.updateRating(id, newRating);
  }

  // Rediger film
  if (e.target.classList.contains("fa-pencil")) {
    const id = e.target.closest("tr").dataset.id;
    const movies = UI.getMovies();
    const movieToEdit = movies.find((m) => m.id === id);

    //fyll in feltene i edit mode
    document.getElementById("title").value = movieToEdit.title;
    document.getElementById("genre").value = movieToEdit.genre;
    document.getElementById("year").value = movieToEdit.year;

    //marker stjernene på nytt
    const stars = document.querySelectorAll("#rating-stars i");
    rating = movieToEdit.rating;
    stars.forEach((star, i) => {
      i < rating
        ? star.classList.add("active")
        : star.classList.remove("active");
    });
    //lagre id på filmen som ble redigert
    document.querySelector("#movie-form").dataset.editing = id;
    UI.showAlert("Rediger og send inn på nytt", "success");
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

document.querySelector(".clearAll").addEventListener("click", () => {
  if (confirm("Er du sikker på at du vil tømme hele listen?")) {
    localStorage.removeItem("movies"); //fjerner alt fra local storage
    UI.displayMovies(); //oppdaterer listeinnholdet til tomt
    UI.showAlert("Listen er tømt!", "success");
  }
});

// filtrer etter brukerens input
document.querySelector("#filter").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const movies = UI.getMovies();
  const filtered = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(query) ||
      m.genre.toLowerCase().includes(query) ||
      m.year.includes(query)
  );
  UI.renderFilteredMovies(filtered);
});
UI.renderFilteredMovies = function (movies) {
  const list = document.querySelector("#movie-list");
  list.innerHTML = "";
  movies.forEach((movie) => UI.addMovieToList(movie));
};

// sorter
// Event listener som lytter på når brukeren forandrer/velger ny verdi fra sorteringslisten
document.querySelector("#sort").addEventListener("change", (e) => {
  const value = e.target.value;
  const movies = UI.getMovies();

  if (value === "rating") {
    movies.sort((a, b) => b.rating - a.rating);
  } else if (value === "rating2") {
    movies.sort((a, b) => a.rating - b.rating);
  } else if (value === "year") {
    movies.sort((a, b) => b.year - a.year);
  } else if (value === "year2") {
    movies.sort((a, b) => a.year - b.year);
  } else if (value === "title") {
    movies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (value === "genre") {
    movies.sort((a, b) => a.genre.localeCompare(b.genre));
  } else if (value === "favorite") {
    movies.sort((a, b) => b.favorite - a.favorite);
  } else {
    movies.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }
  UI.saveMovies(movies);
  UI.displayMovies();
});
