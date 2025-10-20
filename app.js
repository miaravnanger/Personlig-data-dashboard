//Movie constructor
class Movie {
  constructor(id, title, genre, year, rating = 0, favorite = false )
  {
  this.id = id;
  this.title = title;
  this.genre = genre;
  this.year = year;
  this.rating = rating;
  this.favorite = favorite;
}

// Ui Constructor
  class UI {
  addMovieToList(){

}
 showAlert(){

}
 deleteMovie(){

}
 editMovie(){

}
 clearFields(){

}
  }

//legg Movie til listen
UI.prototype.addMovieToList = function (movie) {
  const list = document.querySelector("#movie-list");

  //lag tr element
  const row = document.createElement("tr");
  //legg inn colonner
  row.innerHTML = `
  <td>${movie.title}</td>
  <td>${movie.genre}</td>
  <td>${movie.year}</td>
    <td><a href="#" class="delete">X</td>
  `;
  list.appendChild(row);
};

//clear ut feltene
UI.prototype.clearFields = function (){
  document.querySelector('#title').value = ' ';
   document.querySelector("#genre").value = ' ';
    document.querySelector("#year").value = ' ';
}
// event listeners

document.querySelector("#movie-form").addEventListener("submit", (e) => {
  //henter form valuene
  const title = document.querySelector("#title").value,
    genre = document.querySelector("#genre").value,
    year = document.querySelector("#year").value;

  // instanrere movie
  const movie = new Movie(title, genre, year);

  // instantere UI
  const ui = new UI();

  //legg movie til listen
  ui.addMovieToList(movie);

  //clear ut feltene
  ui.clearFields();
  e.preventDefault();
});

// hent stjernene fra html for å manipulere de
const stars = document.querySelectorAll(".stars i");

// loop gjennom stars nodeslisten
stars.forEach((star, index1) => {
  //legg til eventlistener for klikk
  star.addEventListener("click", () => {
    // loop gjennom på nytt
    stars.forEach((star, index2) => {
      // legg til "active" klasse på stjernen som er klikket på og stjerner med lavere index, og fjern "active" klassen fra stjerner med høyre index
      index1 >= index2
        ? star.classList.add("active")
        : star.classList.remove("active");
    });
  });
});
