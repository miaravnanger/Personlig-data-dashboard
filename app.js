// Movie-klasse
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

// UI-klasse
class UI {
  // Hent filmer fra localStorage
  static getMovies() {
    return JSON.parse(localStorage.getItem("movies")) || [];
  }
  // Lagre filmer i localStorage
  static saveMovies(movies) {
    localStorage.setItem("movies", JSON.stringify(movies));
  }
  // Legg til en ny film i listen
  static addMovieToList(movie) {
    const list = document.querySelector("#movie-list");
    const { id, title, genre, year, rating } = movie;
    // Ny rad i HTML-tabellen for film-listen
    const row = document.createElement("tr");
    // Henter ut data-verdien til elementet og lagrer det som "id" for å bruke seinere når vi skal slette og redigere filmer
    row.dataset.id = id;
    // Legg inn colonner for tittel, sjanger, utgitt, rating, og linker til å lagre som favoritt, redigere og slette filmer
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
  // Viser stjerne-vurderingen på listen (readOnly så de ikke lengre kan trykkes på)
  // Trenger bare indexen, så bruker _ for å hoppe over elementet
  static renderStars(rating) {
    return Array.from(
      { length: 5 },
      (_, i) =>
        `<i class="fa-solid fa-star readOnly-star ${
          i < rating ? "active" : ""
        }"></i>`
    ).join("");
  }

  // Slette film
  static deleteMovie(id) {
    const movies = UI.getMovies().filter((m) => m.id !== id);
    UI.saveMovies(movies);
    UI.displayMovies();
  }

  // Oppdatere rating
  static updateRating(id, newRating) {
    const movies = UI.getMovies().map((movie) =>
      movie.id === id ? { ...movie, rating: newRating } : movie
    );
    UI.saveMovies(movies);
    UI.displayMovies();
  }

  // Vise alle filmer i tabellen
  static displayMovies() {
    const list = document.querySelector("#movie-list");
    const clearBtn = document.querySelector(".clearAll");
    const movies = UI.getMovies();
    list.innerHTML = "";
    movies.map((movie) => UI.addMovieToList(movie));
    // Gjør sånn at "tøm listen" knappen ikke vises med mindre det er noe i listen
    clearBtn.style.display = movies.length ? "inline-block" : "none";
  }

  // Lager en div med en alert som kan brukes igjen for suksess og feilmeldinger
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.textContent = message;
    // Hent containeren og film-skjemaet
    const container = document.querySelector(".container");
    const form = document.querySelector("#movie-form");
    // Sett inn alert-diven over skjemaet
    container.insertBefore(div, form);
    // Timeout så den forsvinner etter 1,5sek
    setTimeout(() => div.remove(), 1500);
  }
  // Nullstill inputfeltene og stjerne-rangeringen
  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("year").value = "";

    const stars = document.querySelectorAll("#rating-stars i");
    stars.forEach((star) => star.classList.remove("active"));
    rating = 0;
  }
}
//
//                    Event listeners
//
// Gjør sånn at innholdet i film-listen vises når man åpner siden
document.addEventListener("DOMContentLoaded", UI.displayMovies);

// Legg til film
// Lytt etter submit
document.querySelector("#movie-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Henter skjema-verdiene
  const title = document.querySelector("#title").value.trim();
  const genre = document.querySelector("#genre").value.trim();
  const year = document.querySelector("#year").value.trim();

  if (!title || !genre || !year) {
    // Error alert hvis noen av feltene ikke er fylt ut
    UI.showAlert("Vennligst fyll inn alle felt", "error");
    return;
  }

  // Edit knapp
  // Gir filmen som blir targeted av edit knappen, en editing-id mens den redigeres, og fjerner den når den er ferdig redigert. Hvis filmen ikke har edit id, så legg til en ny film.
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

// Click events i film-listen
document.querySelector("#movie-list").addEventListener("click", (e) => {
  // Slett film
  // Hvis elementet som blir klikket på har klassen "delete", finn den nærmeste raden sin id og slett denne filmen fra UI.
  if (e.target.classList.contains("delete")) {
    const id = e.target.closest("tr").dataset.id;
    UI.deleteMovie(id);
    UI.showAlert("Film fjernet!", "success");
    e.preventDefault();
  }
  // Marker som favoritt og lag nytt array med oppdatert verdi hvis filmen ble markert som favoritt
  if (e.target.classList.contains("fa-heart")) {
    const id = e.target.closest("tr").dataset.id;
    const movies = UI.getMovies();
    const updatedMovies = movies.map((movie) =>
      movie.id === id ? { ...movie, favorite: !movie.favorite } : movie
    );
    UI.saveMovies(updatedMovies);
    UI.displayMovies();
  }

  // Rediger film
  if (e.target.classList.contains("fa-pencil")) {
    const id = e.target.closest("tr").dataset.id;
    const movies = UI.getMovies();
    // Finn filmen som har samme id som filmen som ble trykket på
    const movieToEdit = movies.find((m) => m.id === id);
    // Fyll in feltene i edit mode
    document.getElementById("title").value = movieToEdit.title;
    document.getElementById("genre").value = movieToEdit.genre;
    document.getElementById("year").value = movieToEdit.year;
    // Marker stjernene på nytt
    const stars = document.querySelectorAll("#rating-stars i");
    rating = movieToEdit.rating;
    stars.forEach((star, i) => {
      i < rating
        ? star.classList.add("active")
        : star.classList.remove("active");
    });
    // Vis alert når man trykker på rediger
    document.querySelector("#movie-form").dataset.editing = id;
    UI.showAlert("Rediger og send inn på nytt", "success");
  }
});

// Rating-stjernene i skjemaet, la bruker velge rating ved å klikke
let rating = 0;
const stars = document.querySelectorAll("#rating-stars i");

// Loop gjennom stars
stars.forEach((star, index1) => {
  // Legg til eventlistener for klikk, lagre index1 + 1 som "rating" og loop gjennom på nytt
  star.addEventListener("click", () => {
    rating = index1 + 1;
    stars.forEach((star, index2) => {
      index1 >= index2 // Hvis index 1 er mindre enn eller lik index 2, legg til "active" klasse, hvis ikke, fjern "active" klasse
        ? star.classList.add("active")
        : star.classList.remove("active");
    });
  });
});

// Tøm hele listen
document.querySelector(".clearAll").addEventListener("click", () => {
  if (confirm("Er du sikker på at du vil tømme hele listen?")) {
    localStorage.removeItem("movies"); // Fjerner alt fra local storage
    UI.displayMovies(); //Oppdaterer listeinnholdet til tomt
    UI.showAlert("Listen er tømt!", "success");
  }
});

document.querySelector("#filter").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const movies = UI.getMovies();
  // Filtrer basert på om tittel, sjanger eller årstall inneholder det brukeren skriver inn
  const filtered = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(query) ||
      m.genre.toLowerCase().includes(query) ||
      m.year.includes(query)
  );
  UI.renderFilteredMovies(filtered);
});
// Vis ny liste basert på filtreringen
UI.renderFilteredMovies = function (movies) {
  const list = document.querySelector("#movie-list");
  list.innerHTML = "";
  movies.forEach((movie) => UI.addMovieToList(movie));
};

// Sortering
// Event listener som kjører når brukeren forandrer/velger ny verdi fra sorteringslisten
document.querySelector("#sort").addEventListener("change", (e) => {
  // Lagre den valgte verdien som "value"
  const value = e.target.value;
  const movies = UI.getMovies();
  // Sorter listen basert på value, hvis ingenting er valgt så behold listen som den er
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
