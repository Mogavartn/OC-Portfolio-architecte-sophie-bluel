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
async function deleteWorks() {
    // Cible tous les icônes de suppression
    const trashBtns = document.querySelectorAll(".trashBtn");
    // Itère sur chaque bouton de suppression et ajoute un écouteur d'événements
    trashBtns.forEach(trashBtn => {
        trashBtn.addEventListener("click", async () => {
            // Demander une confirmation avant la suppression
            const confirmation = confirm("Voulez-vous vraiment supprimer cet élément ?");
            if (!confirmation) return; // Si l'utilisateur annule, sortir de la fonction

            const token = window.sessionStorage.getItem("token");
            const id = trashBtn.parentElement.dataset.id; // Obtenez l'ID du parent de l'icône

            try {
                const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "*/*",
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (response.ok) {
                    // Supprimez le parent de l'icône de suppression
                    const parentElement = trashBtn.parentElement;
                    parentElement.remove();
                    // Réception de response en text
                    const responseData = await response.text(); 

                // Check if response data is not empty
                if (responseData.trim() !== "") {
                    console.log("Réponse après suppression :", responseData);
                    }
                    // Mise à jour des affichages après la suppression réussie
                    const updatedWorks = await loadWorks(works);
                    genWorks(updatedWorks);
                    genModalWorks(updatedWorks);
                } else {
                    console.error("La suppression de l'élément a échoué. Statut de réponse :", response.status);
                }
            } catch (error) {
                console.error("Problème lors de la suppression de l'élément :", error);
            }
        });
    });
}
// Appel de la fonction pour ajouter les écouteurs d'événements une fois que les éléments sont générés
deleteWorks();

// Ajout de Works dans la Modal
// Sélection de l'élément input de type file
const imgPreview = document.querySelector(".blueDivAdd");
// Sélection des parties à cacher lorsque le preview apparait
const addPhotoFormBtnInput = document.querySelector(".addPhotoFormBtnInput");
const addPhotoFormBtnAll = document.querySelector(".addPhotoFormBtn");
const imageWaiting = document.querySelector(".imageWaiting");
const imgFormat = document.querySelector(".imgFormat");
// Ajout d'un écouteur d'événements pour le changement de fichier
addPhotoFormBtnInput.addEventListener("change", function() {
    getImgData();
});
function getImgData() {
	const files = addPhotoFormBtnInput.files[0];
	if (files) {
		const fileReader = new FileReader();
        imageWaiting.setAttribute('aria-hidden', true) ;
        imageWaiting.style.display = "none";
        addPhotoFormBtnAll.setAttribute('aria-hidden', true) ;
        addPhotoFormBtnAll.style.display = "none";
        imgFormat.setAttribute('aria-hidden', true) ;
        imgFormat.style.display = "none";
		fileReader.readAsDataURL(files);
		fileReader.addEventListener("load", function () {
		imgPreview.style.display = "null";
		imgPreview.innerHTML = '<img src="' + this.result + '" />';
        });
	}
}

// Création de la fonction de validation du formulaire d'envoi de Works
// On écoute les événements de modification des champs
addPhotoFormBtnInput.addEventListener("change", validateForm);

const addPhotoTitle = document.querySelector("#addPhotoTitle");
addPhotoTitle.addEventListener("input", validateForm);

const addPhotoCategory = document.querySelector("#addPhotoCategory");
addPhotoCategory.addEventListener("change", validateForm);

const submitPhoto = document.querySelector(".submitPhoto");

// Validation du formulaire et activation du bouton Submit d'envoi
function validateForm() {
    // On vérifie si les champs sont remplis
    if (addPhotoFormBtnInput.value !== "" && addPhotoTitle.value !== "" && addPhotoCategory.value !== "0") {
        submitPhoto.disabled = false; // On active le bouton "submit"
        submitPhoto.classList.add("sendForm")
    } else {
        submitPhoto.classList.remove("sendForm")
        submitPhoto.disabled = true; // On désactive le bouton "submit"
    }
}
// On écoute l'envoi du nouveau projet
submitPhoto.addEventListener("click", (e) => {
    postNewWork(addPhotoFormBtnInput, addPhotoTitle, addPhotoCategory);
    validateForm();
    e.preventDefault(); 
})
// Function d'envoi du nouveau Work
async function postNewWork(addPhotoFormBtnInput, addPhotoTitle, addPhotoCategory) {

    const formData = new FormData();
    const newWorkImg = addPhotoFormBtnInput.files[0];
    const newWorkTitle = addPhotoTitle.value;
    const newWorkCategory = addPhotoCategory.value;
    const token = window.sessionStorage.getItem("token");

    formData.append("image", newWorkImg);
    formData.append("title", newWorkTitle);
    formData.append("category", newWorkCategory);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: formData
        })
        if (response.ok) {
            const works = await loadWorks();
            genModalWorks(works);
            genWorks(works);
        }
    } catch (error) { alert("problème de connexion au serveur") }
}