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
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
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
  figure.setAttribute("id",data.id)
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
const trashIcon = figure2.querySelector(".fa-trash-can");
  trashIcon.addEventListener("click", (e) => {
    deleteWorks(data.id, figure2);
  });
  document.querySelector(".gallery-modal").append(figure2);
}

// ---- Récupération des catégories et création des filtres ----
async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    for (let i = 0; i < json.length; i++) {
      setFilter(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// ---- Gestion du bouton "Tous" ----
function setTous() {
  document.querySelector(".tous").addEventListener("click", () => {
    getWorks("tous");
    console.log(allWorks);
    for (let annonce of allWorks) {
      setFigure(annonce);
    }
  });
}

// ---- Création des boutons de filtre dynamiques ----
function setFilter(data) {
  const div = document.createElement("div");
  div.className = data.id;
  div.innerHTML = data.name;
  div.addEventListener("click", () => getWorks(data.id));

  document.querySelector(".div-container").append(div);
}

// ---- Affichage du mode admin si connecté ----
function displayAdminMode() {
  if (localStorage.getItem("authToken")) {
    console.log("ok");
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

// ---- Gère l’état du bouton login/logout au chargement ----
document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("login");
  const token = localStorage.getItem("authToken");
  if (token) {
    console.log("coucou");
    link.innerText = "Logout";
    link.href = "#";
    link.addEventListener("click", () => {
      logout();
    });
  } else {
    link.innerText = "Login";
    link.href = "login.html";
  }
});

// ---- Appels au chargement ----
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

// ---- Ouverture de la modale ----
const openModal = function (e) {
  e.preventDefault();

  const target = document.querySelector(e.target.getAttribute("href"));
  if (!target) return;

  modal = target;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

// ---- Fermeture de la modale ----
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();

  document.activeElement.blur();

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");

  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);

  modal = null;
};

// ---- Empêche fermeture au clic intérieur ----
const stopPropagation = function (e) {
  e.stopPropagation();
};

// ---- Gestion du focus clavier dans la modale ----
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((ƒ) => f === modal.querySelector(":focus"));
  if (index >= focusables.length) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

// ---- Listeners d'ouverture de modale ----
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// ---- Raccourcis clavier dans la modale ----
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }

  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
    console.log(focusables);
  }
});

async function deleteWorks(id, figureElement) {
  const url = `http://localhost:5678/api/works/${id}`;
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      figureElement.remove();
      // alert("Image supprimée !");
      document.getElementById(id).remove()
    } else {
      alert("Échec de la suppression");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue");
  }
}




// ==========================
// ====== TODO / Notes ======
// ==========================

// faire le bouton modifier à coté de " mes projets " pour avoir accès à la modal
// afficher avec le bon css la modal
// afficher les différentes photos du site + le corbeille pour la suppression
// ne pas les appeler API 2 fois + quelle soit affichés sans refresh de la page

