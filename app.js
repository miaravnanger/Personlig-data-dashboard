
//hent stjernene fra html for å manipulere de
const stars = document.querySelectorAll(".stars i");

//loop gjennom stars nodeslisten
stars.forEach((star, index1) => {
    //legg til eventlistener for klikk
star.addEventListener("click", () => {
    //loop gjennom på nytt
    stars.forEach((star, index2) => {
        //legg til "active" klasse på stjernen som er klikket på og stjerner med lavere index, og fjern "active" klassen fra stjerner med høyre index
        index1 >= index2 ? star.classList.add("active") : star.classList.remove("active")
    });
});
});