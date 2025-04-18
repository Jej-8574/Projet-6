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

// Toutes les images au chagement
getWorks();
getCategories();
setTous();

// étape 1 : crée le html / css de la page " login "
// étape 2 : crée le JS pour le login
// étape 3 : crée dans le JS login la fonction qui permet de récupéré via API (api login)
// étape 4 : enregistrer le token en local avec la fonction localstorage.setItem("token",tokenvalue) (voir doc) avoir le même nom du "token" sur le set ET get.
// étape 5 : pour récupérer le token dans la page " accueil" il faut utiliser la fonction localstorage.getItem("token")
// étape 6 : pour se déconnecter du localstorage.removeItem("token")
