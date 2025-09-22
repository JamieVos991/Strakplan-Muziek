const firebaseConfig = {
  apiKey: "AIzaSyAhE4fixjgNtBGCyr_Lz7M5HPQ4YfQeaDQ",
  authDomain: "strakplan-e0953.firebaseapp.com",
  projectId: "strakplan-e0953",
  storageBucket: "strakplan-e0953.firebasestorage.app",
  messagingSenderId: "1033656552155",
  appId: "1:1033656552155:web:74106be10a92249f6d1afe",
  measurementId: "G-EBEC1QRRYW",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let allShows = [];
let editingId = null;

let currentIndex = 0;
const showsPerPage = 5;

async function renderShows() {
  const snapshot = await db.collection("shows").get();
  allShows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const now = new Date();
  const upcomingShows = allShows
    .filter((s) => new Date(s.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastShows = allShows
    .filter((s) => new Date(s.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingList = document.getElementById("upcoming-shows");
  const pastList = document.getElementById("past-shows");

  if (upcomingList && pastList) {
    upcomingList.innerHTML = upcomingShows.length
      ? upcomingShows
          .map(
            (show) => `
          <li>
            ${show.date_day} ${show.day_month} - ${show.place} @ ${show.time || "-"}
            <button onclick="editShowById('${show.id}')">Edit</button>
            <button onclick="deleteShow('${show.id}')">Verwijderen</button>
          </li>`
          )
          .join("")
      : `<li>Geen shows gevonden.</li>`;

    pastList.innerHTML = pastShows.length
      ? pastShows
          .map(
            (show) => `
          <li>${show.date_day} ${show.day_month} - ${show.place} @ ${show.time || "-"}</li>`
          )
          .join("")
      : `<li>Er zijn nog geen optredens geweest.</li>`;

    return; // stop here so main page logic doesn’t run
  }

  const showContainer = document.querySelector("section ul:nth-of-type(3)");
  const loadMoreBtn = showContainer.querySelector("button");

  if (!upcomingShows || upcomingShows.length === 0) {
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    const msg = document.createElement("p");
    msg.textContent =
      "Helaas geen optredens op het moment, check de site en Instagram voor updates!";
    showContainer.prepend(msg);
    return;
  }

  currentIndex = 0;
  showContainer.querySelectorAll("article").forEach((a) => a.remove());

  function renderNextBatch() {
    const nextShows = upcomingShows.slice(currentIndex, currentIndex + showsPerPage);

    nextShows.forEach((show) => {
      const article = document.createElement("article");
      article.innerHTML = `
        <li><p class="show-tijd">${show.time || "-"}</p></li>
        <li>
          <p class="show-dag">${show.date_day}</p>
          <p class="show-maand">${show.day_month.substring(0, 3)}</p>
        </li>
        <li><p class="show-stad">${show.place}</p></li>
      `;
      loadMoreBtn.before(article);
    });

    currentIndex += showsPerPage;

    if (currentIndex >= upcomingShows.length && loadMoreBtn) {
      loadMoreBtn.style.display = "none"; // hide button if no more shows
    }
  }

  loadMoreBtn.onclick = renderNextBatch;

  renderNextBatch();
}

async function deleteShow(id) {
  if (!confirm("Weet je zeker dat je deze show wilt verwijderen?")) return;
  await db.collection("shows").doc(id).delete();
  renderShows();
}

function editShowById(id) {
  const show = allShows.find((s) => s.id === id);
  if (!show) return;

  editingId = show.id;
  document.getElementById("show-time").value = show.time || "";
  document.getElementById("show-place").value = show.place || "";
  document.getElementById("show-date").value = show.date;
}

renderShows();
