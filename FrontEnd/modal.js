// Déclaration des modales 1 & 2
let modal1 = document.getElementById("modal1");
let modal2 = document.getElementById("modal2");
// On récupère les élements focusable dans la modale pour tab
const focusableSelector = "button, a, input, textarea"
let focusablesElements = []
let previouslyFocusedElement = null

// MODALE 1
// Création de la fonction openModal1
const openModal1 = async function (e) {
    // Prevent du click sur le lien 
    e.preventDefault()
    // Récupération des élements focusable et mise en tableau
    focusablesElements = Array.from(modal1.querySelectorAll(focusableSelector))
    // Recherche du dernier element focusé qu'on sauve dans la variable
    previouslyFocusedElement = document.querySelector(':focus')
    // Affichage de la boite modale en retirant le display none
    modal1.style.display = null
    // On met le premier élément en focusable par défaut
    focusablesElements[0].focus()
    // Change l'attribut aria-hidden et aria-modal
    modal1.setAttribute('aria-hidden', false)
    modal1.setAttribute('aria-modal', true)
    // Fermeture de la modal au click dessus
    modal1.addEventListener('click', closeModal1)
    // Recherche de l'élement de fermeture de modal
    modal1.querySelector('.js-modal-close').addEventListener('click', closeModal1)
    // Intégration du stop propagation
    modal1.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

// Création de la fonction de fermeture closeModal1
// Fonction inverse de l'ouverture 
const closeModal1 = function(e) {
    // On bloque la tentative de fermeture d'une modal non existante
    if (modal1 === null) return
    // Si le focus existait on le reprend et lui redonne le focus
    if (previouslyFocusedElement !== 0) previouslyFocusedElement.focus()
    // Prevent du click
    e.preventDefault()
    // Change l'attribut aria-hidden et aria-modal
    modal1.setAttribute('aria-hidden', true) 
    modal1.removeAttribute('aria-modal')
    // Suppression de l'Event Listener
    modal1.removeEventListener('click', closeModal1)
    modal1.querySelector('.js-modal-close').removeEventListener('click', closeModal1)
    // Suppression du stop propagatrion
    modal1.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    // On attend la fin de l'animation
    const hideModal1 = function () {
        // Masquage de la boite modale
        modal1.style.display = "none"
        modal1.removeEventListener('animationend', hideModal1)
        // Modal null à nouveau
        modal1 = null
    }
    modal1.addEventListener('animationend', hideModal1)
}

// Création de fonction pour empêcher propagation de l'event vers les parents
// (empêche la fermeture de modal en clickant n'importe ou)
const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    // On court-circtuite le fonctionnement normal de Tab
    e.preventDefault()
    // On réccupère l'index de l'element actuellement focus
    let index = focusablesElements.findIndex(f => f === modal1.querySelector(':focus'))
    // Si Shift Tab
    if (e.shiftKey === true) {
    // On enlève un cran à l'index
        index--
    } else {
    // On ajoute un cran à l'index
        index++
    }
    // On vérifie l'index par rapport a la taille des élémeents focusable
    // pour ensuite remettre l'index à 0
    if (index >= focusablesElements.length) {
        index = 0
    }
    if (index < 0) {
        index = focusablesElements.length - 1
    }
    focusablesElements[index].focus()
}

// Cible les liens qui ouvrent boite modal
// avec écoute du click pour chacun et qui lance la fonction openModal
document.querySelectorAll('.js-modal').forEach(a =>{
    a.addEventListener('click', openModal1)
})

// Création de l'event listener clavier pour la fermeture Modal
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    // Création d'un event listener clavier pour Tab
    if (e.key === "Tab" && modal1 !== null) {
        focusInModal(e)
    }
})