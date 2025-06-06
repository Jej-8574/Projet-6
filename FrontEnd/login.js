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
