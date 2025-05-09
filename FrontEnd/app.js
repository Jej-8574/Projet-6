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
      '<p><a href="modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode Édition</a></p>';
    document.body.prepend(editBanner);
    document.getElementById("login").innerText = "log out"
  }
}
// document.getElementById("login").innerText = "log out"
document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('login');
  const token = localStorage.getItem('authToken');
  // if (!link) return;
  if (token) {
    console.log("coucou")
    link.innerText = 'Logout';
    link.href = '#';
    link.addEventListener('click', () => {
      logout();
    });
  } else {
    link.innerText = 'Login';
    link.href = 'login.html';
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


const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.setAttribute('aria-hidden')
  target.setAttribute('aria-modal','true')

}

document.querySelectorAll('.js-modal').forEach((a) => {
  a.addEventListener("click",openModal);
})