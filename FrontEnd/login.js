const loginApi = "http://localhost:5678/api/users/login";

document.getElementById("loginform").addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  const user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const response = await fetch(loginApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.status !== 200) {
    const errorBox = document.createElement("div");
    errorBox.className = "error-login";
    errorBox.textContent = "ERREUR LOGIN, VEUILLEZ RÉESSAYER";
    document.querySelector("form").prepend(errorBox);
  } else {
    const result = await response.json();
    const token = result.token;
    localStorage.setItem("authToken", token);
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
}




// faire un boucle pour le boutton login/logout if il ya le token logout et si y'a pas le token login
// crée dans l'html un message d'erreur et le caché via le CSS et ensuite l'affiche ou non via le JS 
// ajouter un add event listener sur la fonction log out


// étape 1 : enregistrer le token en local avec la fonction localstorage.setItem("token",tokenvalue) (voir doc) avoir le même nom du "token" sur le set ET get.
// étape 2 : pour récupérer le token dans la page " accueil" il faut utiliser la fonction localstorage.getItem("token")
// étape 3 : pour se déconnecter du localstorage.removeItem("token")a
// étape 4 : quand je refresh la page savoir si il y'a le token pour rediriger vers la page login OU la page d'accueil
