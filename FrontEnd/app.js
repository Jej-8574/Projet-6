let allWorks = [];

async function getWorks(filter) {
  document.querySelector(".gallery").innerHTML = "";
  document.querySelector(".gallery-modal").innerHTML = "";

  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    allWorks = await response.json();
  } catch (error) {
    console.error(error.message);
    return;
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
      <i class="fa-solid fa-trash-can overlay-icon"></i>
    </div>
  `;
  figure2.querySelector(".fa-trash-can").addEventListener("click", () => {
    deleteWorks(data.id, figure2);
  });
  document.querySelector(".gallery-modal").append(figure2);
}

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

function setTous() {
  document.querySelector(".tous").addEventListener("click", () => {
    getWorks();
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
    const editBanner = document.createElement("div");
    editBanner.className = "edit";
    editBanner.innerHTML =
      '<p><a href="#modal1"><i class="fa-regular fa-pen-to-square"></i>Mode Édition</a></p>';
    document.body.prepend(editBanner);
    document.getElementById("login").innerText = "log out";
  }
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
}

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

// ========== MODALE ==========
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
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    ?.addEventListener("click", stopPropagation);

  openModal1();
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
    ?.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    ?.removeEventListener("click", stopPropagation);
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

// ========== SUPPRESSION ==========
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
      allWorks=allWorks.filter(item => item.id !== id)
    } else {
      alert("Échec de la suppression");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue");
  }
}

// ========== MODALE PHOTO ==========

function openModal1() {
  openModal1Only();

  document
    .querySelector(".js-modal-close")
    .addEventListener("click", closeModal);
  document
    .querySelector(".add-photo-button")
    .addEventListener("click", switchModal);

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
document.querySelectorAll(".js-modal-close").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      modal.removeAttribute("aria-modal");
    });
    modal = null;
  });
});

function switchModal() {
  openModal2Only();

  document
    .querySelector(".js-modal-close")
    .addEventListener("click", closeModal);
  document
    .querySelector(".js-modal-back")
    .addEventListener("click", openModal1Only);

  const selectCategory = document.getElementById("category");
  selectCategory.innerHTML = '<option value=""></option>';

  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categories) => {
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        selectCategory.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Erreur chargement catégories :", err);
    });
}

function openModal1Only() {
  document.getElementById("modal1").style.display = "flex";
  document.getElementById("modal2").style.display = "none";
}

function openModal2Only() {
  document.getElementById("modal1").style.display = "none";
  document.getElementById("modal2").style.display = "flex";
}

// ajout photo 

const fileInput = document.getElementById("file-upload");
const preview = document.getElementById("img-preview");
const uploadLabel = document.getElementById("upload-label");

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type.startsWith("image/")) {
    const previewURL = URL.createObjectURL(file);
    preview.src = previewURL;
    preview.style.display = "block";
    uploadLabel.style.display = "none";
  }
});

document.querySelector(".add-photo-form form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("file-upload").files[0];
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const token = localStorage.getItem("authToken");

  if (!file || title === "" || category === "") return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  const res = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.ok) {
    allWorks = [];
    getWorks();
    openModal1Only();
    e.target.reset();
    preview.style.display = "none";
    uploadLabel.style.display = "flex";
  }
});
