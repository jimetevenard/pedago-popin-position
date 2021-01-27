(function(){

    let popup = window.parent.document.querySelector('#la-popup');

    /**
     * Lien courant (le dernier cliqué) que doit
     * suivre la popup.
     */
    let currentLink;

    /**
     * Fonction utilitaire pour déterminer si le noeud cliqué est
     * un lien avec la classe .weblink
     * 
     * @param {Node} node 
     */
    function isLink(node){
        return node && node.nodeName === 'A' && node.className === 'weblink';
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
     * Retourne le status d'affichage de la popup, via la valeur de
     * son attribut 'data-show' 
     * 
     */
    function isPopupDisplayed(){
        return popup.getAttribute('data-show') === true.toString();
    }

    /**
     * Met à jour l'attribut style de la popup,
     * avec les valeurs x et y en params
     * 
     * Relative au document parent, la popup est définie dans style.css en position: fixed;
     * 
     * @param {number} left propriété CSS left, en px,
     * @param {number} top propriété CSS top, en px
     */
    function updatePopupStyle(left,top){
        popup.setAttribute('style',`top: ${Math.floor(top)}px; left: ${Math.floor(left)}px;`);
    }

    /**
     * Handler pour écouter le clic sur un élément HTML dans l'iframe.
     * 
     * @param {Event} event 
     */
    function clickIframeHandler(event){
        if(isLink(event.target)){
            event.preventDefault();
            currentLink = event.target;
            togglePopup(true, event.target.textContent );
            movePopup();
        } else {
            togglePopup(false);
            currentLink = undefined;
        }
    }

    /**
     * Recalcule la position de la popup et la déplace
     * via la fonction updatePopupStyle()
     */
    function movePopup(){
        if(isLink(currentLink)){
            // Voir https://developer.mozilla.org/fr/docs/Web/API/Element/getBoundingClientRect

            /**
            * DOMRect du lien (par rapport à sa window, c'est à dire l'iframe
            */
            let LinkRect = currentLink.getBoundingClientRect();
            
            /**
             * DOMRect de l'iframe (par rapport à la window parente)
             * 
             * RAPPEL : Ce script est appelé depuis l'iframe (ce qui diffère de tinyMCE !!)
             * donc la variable globale 'window' ci-dessous est l'objet window de l'iframe.
             */
            let IFrameRect = window.parent.document.querySelector("iframe#foo").getBoundingClientRect();

            /**
             * Position Y du lien par rapport à la vue globale.
             */
            let LinkYFromParent = IFrameRect.y + LinkRect.y;

            /**
             * Position X du lien par rapport à la vue globale.
             */
            let LinkXFromParent = IFrameRect.x + LinkRect.x;

            
            function isLinkVisible(){
                let visibleInsideFrameX = LinkRect.x > 0 && LinkRect.x < window.innerWidth;
                let visibleInsideFrameY = LinkRect.y > 0 && LinkRect.y < window.innerHeight;

                let visibleInParentX = LinkXFromParent > 0 && LinkXFromParent < window.top.innerWidth;
                let visibleInParentY = LinkYFromParent > 0 && LinkYFromParent < window.top.innerHeight;

                return visibleInsideFrameX && visibleInsideFrameY && visibleInParentX && visibleInParentY;
            }

            
            if(isLinkVisible()){
                if(!isPopupDisplayed()){
                    togglePopup(true);
                }
                updatePopupStyle(LinkXFromParent,LinkYFromParent);
            } else {
                togglePopup(false);
            }
            
        }
    }


    // Listener sur le click dans l'iframe
    document.querySelector("body.frame-content").addEventListener("click", clickIframeHandler);

    // Listener sur le scroll à l'intérieur de l'iframe
    document.addEventListener('scroll', movePopup);

    // Listener sur le scroll à l'esterieur de l'iframe
    window.parent.document.addEventListener('scroll', movePopup);

})();