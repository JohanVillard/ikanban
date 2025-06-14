import { Column } from '../../types/column';

/**
 * Crée un composant qui affiche le nombre limite de tâches d'une colonne.
 *
 * @param column - La colonne d'où le WIP (Work In Progress) est extrait.
 * @returns Un élément HTML affichant la limite de tâches.
 */
function WipElement(column: Column): HTMLHeadingElement {
    // J'ajoute le nombre de tâches autorisées pour cette colonne
    const wipElement = document.createElement('h3');
    wipElement.id = `wip-display-${column.id}`;
    if (column.wip) {
        wipElement.textContent = column.wip.toString();
        wipElement.dataset.wip = column.wip.toString(); // Permet d'actualiser le DOM
        wipElement.title = `Limite: ${column.wip} tâches`;
    } else {
        wipElement.classList.add('fa-solid', 'fa-infinity');
        wipElement.dataset.wip = ''; // Permet d'actualiser le DOM
        wipElement.title = `Aucune limite`;
    }

    wipElement.setAttribute('aria-label', wipElement.title);

    return wipElement;
}

export default WipElement;
