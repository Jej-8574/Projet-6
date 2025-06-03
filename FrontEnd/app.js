// ==========================
// ======== Données =========
// ==========================
let allWorks = [];

// ==========================
// ======= Fonctions ========
// ==========================

// ---- Récupération des travaux ----
async function getWorks(filter) {
  document.querySelector(".gallery").innerHTML = "";

  if (allWorks.length === 0) {
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      allWorks = await response.json();
    } catch (error) {
      console.error(error.message);
      return;
    }
  }

  let worksToDisplay = allWorks;
  if (filter) {
    worksToDisplay = allWorks.filter((work) => work.categoryId === filter);
  }

  for (let i = 0; i < worksToDisplay.length; i++) {
    setFigure(worksToDisplay[i]);
  }
}

// ---- Affichage des figures dans la galerie et la modale ----
function setFigure(data) {
  const figure = document.createElement("figure");
  figure.setAttribute("id", data.id);
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
  `;
  document.querySelector(".gallery").append(figure);

  const figure2 = document.createElement("figure");
  figure2.innerHTML = `
    <div class="image-container">
      <img src="${data.imageUrl}" alt="${data.title}">
      <figcaption>${data.title}</figcaption>
      <i id="trash" class="fa-solid fa-trash-can overlay-icon"></i>
    </div>
  `;
  figure2.querySelector(".fa-trash-can").addEventListener("click", () => {
    deleteWorks(data.id, figure2);
  });
  document.querySelector(".gallery-modal").append(figure2);
}

// ---- Récupération des catégories et création des filtres ----
async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const json = await response.json();
    for (let i = 0; i < json.length; i++) setFilter(json[i]);
  } catch (error) {
    console.error(error.message);
  }
}

// ---- Bouton "Tous" ----
function setTous() {
  document.querySelector(".tous").addEventListener("click", () => {
    getWorks(); // on récupère tout sans filtre
  });
}

// ---- Création des filtres dynamiques ----
function setFilter(data) {
  const div = document.createElement("div");
  div.className = data.id;
  div.innerHTML = data.name;
  div.addEventListener("click", () => getWorks(data.id));
  document.querySelector(".div-container").append(div);
}

// ---- Mode admin si connecté ----
function displayAdminMode() {
  if (localStorage.getItem("authToken")) {
    const editBanner = document.createElement("div");
    editBanner.className = "edit";
    editBanner.innerHTML =
      '<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode Édition</a></p>';
    document.body.prepend(editBanner);
    document.getElementById("login").innerText = "log out";
  }
}

// ---- Déconnexion ----
function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
}

// ==========================
// == Événements initiaux ===
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("login");
  const token = localStorage.getItem("authToken");
  if (token) {
    link.innerText = "Logout";
    link.href = "#";
    link.addEventListener("click", logout);
  } else {
    link.innerText = "Login";
    link.href = "login.html";
  }
});

getWorks();
getCategories();
setTous();
displayAdminMode();

// ==========================
// ======== Modale ==========
// ==========================

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  if (!target) return;

  modal = target;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0]?.focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop")?.addEventListener("click", stopPropagation);

  openModal1(); // injecte la modale 1 au démarrage
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  document.activeElement.blur();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close")?.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop")?.removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  index = e.shiftKey ? index - 1 : index + 1;
  if (index >= focusables.length) index = 0;
  if (index < 0) index = focusables.length - 1;
  focusables[index]?.focus();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal(e);
  if (e.key === "Tab" && modal !== null) focusInModal(e);
});

// ==========================
// == Gestion suppression ===
// ==========================

async function deleteWorks(id, figureElement) {
  const url = `http://localhost:5678/api/works/${id}`;
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      figureElement.remove();
      document.getElementById(id)?.remove();
    } else {
      alert("Échec de la suppression");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue");
  }
}

// ==========================
// == Switch modale photo ===
// ==========================

const switchModal = function () {
  const wrapper = document.querySelector(".modal-wrapper");
  wrapper.innerHTML = `
    <div class="modal-buttons-container">
      <button class="js-modal-back"><i class="fa-solid fa-arrow-left"></i></button>
      <button class="js-modal-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <h3>Ajout photo</h3>
    <div class="form add-photo-form">
      <form action="#" method="post">
        <label for="title">Titre</label>
        <input type="text" name="title" id="title" />
        <label for="category">Catégorie</label>
        <input type="text" name="category" id="category" />
        <hr />  
        <input type="submit" value="Valider" />
      </form>
    </div>
  `;

  document.querySelector(".js-modal-close").addEventListener("click", closeModal);
  document.querySelector(".js-modal-back").addEventListener("click", openModal1);
};

// ==========================
// == Modale galerie photo ==
// ==========================

function openModal1() {
  const wrapper = document.querySelector(".modal-wrapper");

  wrapper.innerHTML = `
    <div class="close-button-container">
      <button class="js-modal-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <h3>Galerie Photo</h3>
    <div class="gallery-modal"></div>
    <hr />
    <div class="modal-button-container">
      <button class="add-photo-button">Ajouter une photo</button>
    </div>
  `;

  document.querySelector(".js-modal-close").addEventListener("click", closeModal);
  document.querySelector(".add-photo-button").addEventListener("click", switchModal);

  const container = document.querySelector(".gallery-modal");
  container.innerHTML = "";

  for (let i = 0; i < allWorks.length; i++) {
    const data = allWorks[i];
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <div class="image-container">
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
        <i class="fa-solid fa-trash-can overlay-icon"></i>
      </div>
    `;

    figure.querySelector(".fa-trash-can").addEventListener("click", () => {
      deleteWorks(data.id, figure);
    });

    container.appendChild(figure);
  }
}
