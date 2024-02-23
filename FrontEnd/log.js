// Sélection , liaison du FORM à une écoute d'événement
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    // Bloque la soumission auto du formulaire
    e.preventDefault();
    // Récupération de l'email et mot de passe entré par l'utilisateur
        const email= document.getElementById("email").value;
        const password= document.getElementById("password").value;
    // Envoi de la requête POST à l'API
    const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",        
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
    // Ajout des infos d'identification dans le body de la requête
                body: JSON.stringify({ email, password }),
                });
    // Si réponse ok
    if (response.ok) {
        // Récupération données de la réponse
        const data = await response.json();
        // Stockage Token dans la session utilisateur
        sessionStorage.setItem("token", data.token);
        // Redirection utilisateur vers page d'accueil
        window.location.replace("index.html");
        // Si réponse échec
    }   else if (response.status === 404) {
            // Efface si erreur précédente présente
            document.getElementById("error").innerHTML = "";
            // Sélection élément HTML pour afficher message d'erreur
            const connexion = document.getElementById("error");
            // Création élément HTML p pour afficher message d'erreur
            const error = document.createElement("p");
            // texte du message d'erreur
            error.innerText = `"Erreur dans l'email"`;
            // Centrage texte du message d'erreur
            error.style.textAlign = `center`;
            // Définition couleur texte du message d'erreur
            error.style.color = `red`;
            // Ajout une marge en bas du message d'erreur
            error.style.marginTop = `15px`;
            // Insère le message d'erreur avant le dernier élément enfant de l'élément HTML sélectionné
            connexion.insertBefore(error, connexion.lastElementChild);
            }
        else if (response.status === 401) {
            // Efface si erreur précédente présente
            document.getElementById("error").innerHTML = "";
            // Sélection élément HTML pour afficher message d'erreur
            const connexion = document.getElementById("error");
            // Création élément HTML p pour afficher message d'erreur
            const error = document.createElement("p");
            // texte du message d'erreur
            error.innerText = `"Erreur dans le mot de passe"`;
            // Centrage texte du message d'erreur
            error.style.textAlign = `center`;
            // Définition couleur texte du message d'erreur
            error.style.color = `red`;
            // Ajout une marge en bas du message d'erreur
            error.style.marginTop = `15px`;
            // Insère le message d'erreur avant le dernier élément enfant de l'élément HTML sélectionné
            connexion.insertBefore(error, connexion.lastElementChild);
        }
    })

// Vérification de la présence des Token de Log
let token = window.sessionStorage.getItem("token");
// Affichage de la page Admin au log
if (token) {
    let logged = document.querySelectorAll(".logged");
    for (let i = 0; i < logged.length; i++) {
    logged[i].style.display = null;
    }
    document.getElementById("filterBar").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = null;
}
// Déconnexion
const logout = document.getElementById("logout");
logout.addEventListener("click", (event) => {
  window.sessionStorage.clear();
});