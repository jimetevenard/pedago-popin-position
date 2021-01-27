(function(){

    let popup = window.parent.document.querySelector('#la-popup');

    /**
     * Fonction utilitaire pour déterminer si le noeud cliqué est
     * un lien avec la classe .weblink
     * 
     * @param {Node} node 
     */
    function isLink(node){
        return node.nodeName === 'A' && node.className === 'weblink';
    }

    /**
     * Affiche ou masque la popup, via la valeur de
     * son attribut 'data-show' (cf. style.css )
     * 
     * @param {boolean} doDisplay true pour afficher la popup, false pour la cacher.
     */
    function togglePopup(doDisplay, label){
        let booleanValueAsString = Boolean(doDisplay).toString(); // "true" / "false" as string
        popup.setAttribute('data-show',booleanValueAsString);
        if(doDisplay && label){
            popup.querySelector('p.label').innerHTML = label;
        }
    }

    /**
     * Handler pour écouter le clic sur un élément HTML dans l'iframe.
     * 
     * @param {Event} event 
     */
    function clickIframeHandler(event){
        if(isLink(event.target)){
            event.preventDefault();
            togglePopup(true, event.target.textContent );
            return false;
        } else {
            togglePopup(false);
        }
    }


    // Listener sur le click dans l'iframe
    document.querySelector("body.frame-content").addEventListener("click", clickIframeHandler);

    // Listener sur le scroll à l'intérieur de l'iframe
    document.addEventListener('scroll',() => {
        console.log("On a scrollé DANS l'iframe !");
    });

    // Listener sur le scroll à l'esterieur de l'iframe
    window.parent.document.addEventListener('scroll',() => {
        console.log("On a scrollé EN DEHORS l'iframe !");
    });

})();