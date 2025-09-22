
import { getShows } from "./Firebase.js";

let shows = [];
let currentIndex = 0;
const showsPerPage = 5;

const showContainer = document.querySelector("section ul:nth-of-type(3)"); // container where articles are
const loadMoreBtn = showContainer.querySelector("button");

function renderShows() {
  const nextShows = shows.slice(currentIndex, currentIndex + showsPerPage);

  nextShows.forEach((show) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <li><p class="show-tijd">${show.time}</p></li>
      <li>
        <p class="show-dag">${show.day}</p>
        <p class="show-maand">${show.month}</p>
      </li>
      <li><p class="show-stad">${show.city}</p></li>
    `;
    loadMoreBtn.before(article); 
  });

  currentIndex += showsPerPage;

  if (currentIndex >= shows.length) {
    loadMoreBtn.style.display = "none";
  }
}

async function init() {
  shows = await getShows(); 
  if (!shows || shows.length === 0) {
    loadMoreBtn.style.display = "none";
    return;
  }
  renderShows(); 
}

loadMoreBtn.addEventListener("click", renderShows);

init();

  

