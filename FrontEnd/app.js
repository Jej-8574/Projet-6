let allWorks = [];

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

function setFigure(data) {
  const figure = document.createElement("figure");
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
    <i class="fa-solid fa-trash-can overlay-icon"></i>
  </div>
`;
  document.querySelector(".gallery-modal").append(figure2);
}

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
function setTous() {
  document.querySelector(".tous").addEventListener("click", () => {
    getWorks("tous");
    console.log(allWorks);
    for (let annonce of allWorks) {
      setFigure(annonce);
    }
  });
}

function setFilter(data) {
  const div = document.createElement("div");
  div.className = data.id;
  div.innerHTML = data.name;
  div.addEventListener("click", () => getWorks(data.id));

  document.querySelector(".div-container").append(div);
}

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

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
}

// Toutes les images au chagement
getWorks();
getCategories();
setTous();
displayAdminMode();

// modale

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

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

const stopPropagation = function (e) {
  e.stopPropagation();
};

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

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }

  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
    console.log(focusables);
  }
});


// faire le bouton modifier à coté de " mes projets " pour avoir accès à la modal
// afficher avec le bon css la modal
// afficher les différentes photos du site + le corbeille pour la suppression
// ne pas les appeler API 2 fois + quelle soit affichés sans refresh de la page
