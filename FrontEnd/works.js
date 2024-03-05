// Récupération des travaux eventuellement stockées dans le localStorage
let works = window.localStorage.getItem('works');
async function loadWorks() {
if (works === null){
    // Récupération des travaux depuis l'API
    const workReponse = await fetch('http://localhost:5678/api/works');
    works = await workReponse.json();
    // Transformation des travaux en JSON
    const listWorks = JSON.stringify(works);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("works", listWorks);
}else{
    works = JSON.parse(works);
}   return works;
}
loadWorks();

// Récupération des catégories
let categories = window.localStorage.getItem('categories');
async function loadCategories() {
if (categories === null) {
    const catReponse = await fetch('http://localhost:5678/api/categories');
    categories = await catReponse.json();
    const listCat = JSON.stringify(categories);
    window.localStorage.setItem("categories", listCat);
}else{
    categories = JSON.parse(categories);
}   return categories;
}
loadCategories();

// Génération des travaux et intégration
function genWorks(works){
    for (let i = 0; i < works.length; i++) {

        const figure = works[i];
        // Récupération de l'élément du DOM qui accueillera les fiches figures
        const sectionGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à un travail
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        workElement.className = "workContainer";
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;        
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = figure.title;
        // Liaison de la balise figure a la section Gallery
        sectionGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
    }
}
genWorks(works);

// Création et activation des boutons de filtres
// Bouton affichage de tous projets
const allButton = document.createElement("button");
allButton.className = "filterButtons";
filterBar.appendChild(allButton);
allButton.textContent = "Tous";
allButton.addEventListener("click", function () {
    window.localStorage.removeItem("works");
    document.querySelector(".gallery").innerHTML = "";
    genWorks(works);
});

// Boutons par catégories
for (let category of categories) {
    const filterButtons = document.createElement("button");
    filterButtons.className = "filterButtons";
    filterButtons.dataset.id = category.id;
    filterButtons.textContent = category.name;
    filterBar.appendChild(filterButtons);

    filterButtons.addEventListener("click", function () {
    const worksObjects = works.filter(function (works) {
        return works.category.id === category.id;
    });
    document.querySelector(".gallery").innerHTML = "";
    genWorks(worksObjects);
});
}  

//MODAL
// Création de la gallerie dans Modal1
function genModalWorks(works){
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const sectionModalGallery = document.querySelector(".modal-gallery");
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id
        workElement.className = "workContainer";
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;        
        sectionModalGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        // création des boutons de suppresion
        const trashBtn = document.createElement("button");
        trashBtn.className = "fa-solid fa-trash-can trashBtn";
        trashBtn.type = "button";
        workElement.appendChild(trashBtn);
    }
}
genModalWorks(works);

// Récupération des catégories pour intégration dans Select de la Modal
for (let category of categories) {
    let categorySelection = document.createElement("option");
    categorySelection.setAttribute("value", `${category.id}`);
    categorySelection.innerHTML = `${category.name}`;
    document.getElementById("addPhotoCategory").appendChild(categorySelection);
}

// Fonction de suppression d'un Work dans la Modal
function deleteWorks() {
    // Cible l'icône de suppression
    const trashBtn = document.querySelector(".trashBtn");
    // Suppression projet au clic sur l'icône
    trashBtn.addEventListener("click", async () => {
        const token = JSON.parse(sessionStorage.getItem("token"));
        let id = works.id;

        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token.token}`
                }
            })
            if (response.ok) {
                // On met l'affichage à jour
                document.querySelector(".workContainer").innerHTML = "";
                const updatedWorks = await loadWorks();
                genModalWorks(updatedWorks);
                genWorks(updatedWorks);
            }
        } catch (error) { alert("problème de connexion au serveur") }
    })
}
