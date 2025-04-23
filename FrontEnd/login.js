const loginApi = "http://localhost:5678/api/users/login";

document.getElementById("loginform").addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  let response = await fetch(loginApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  console.log(response);
  if (response.status != 200) {
    const errorBox = document.createElement("div");
    errorBox.className = "error-login";
    errorBox.innerHTML = "ERREUR LOGIN TRY AGAIN";
    document.querySelector("form").prepend(errorBox);
  }
  let result = await response.json();
  const token = result.token;
  sessionStorage.setItem("authToken",token);
  window.location.href = "index.html"
}

// étape 1 : enregistrer le token en local avec la fonction localstorage.setItem("token",tokenvalue) (voir doc) avoir le même nom du "token" sur le set ET get.
// étape 2 : pour récupérer le token dans la page " accueil" il faut utiliser la fonction localstorage.getItem("token")
// étape 3 : pour se déconnecter du localstorage.removeItem("token")
// étape 4 : quand je refresh la page savoir si il y'a le token pour rediriger vers la page login OU la page d'accueil
