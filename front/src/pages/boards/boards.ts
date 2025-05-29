import Header from '../../components/header/Header';
import { deleteBoard, fetchBoards } from '../../services/boardServices';
import { goTo } from '../../utils/navigation';
import './boards.css';

async function boardsPage() {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    const boardCard = document.createElement('section');
    boardCard.id = 'board-card';

    const boardHeader = Header('Mes tableaux');
    appContainer.appendChild(boardHeader);

    // Bouton pour le bureau
    const createBoardBtnDesktop = document.createElement('button');
    createBoardBtnDesktop.id = 'create-board-btn';
    createBoardBtnDesktop.textContent = '+ Nouveau tableau';
    createBoardBtnDesktop.addEventListener('click', () =>
        goTo('/create-board')
    );

    boardCard.appendChild(createBoardBtnDesktop);

    // Bouton pour le mobile
    const createBoardBtnMobile = document.createElement('button');
    createBoardBtnMobile.id = 'create-board-mobile';
    createBoardBtnMobile.textContent = '+';
    createBoardBtnDesktop.addEventListener('click', () =>
        goTo('/create-board')
    );

    boardCard.appendChild(createBoardBtnMobile);

    // Création de la liste des projets de l'utilisateur
    const boardList = document.createElement('ul');
    boardList.classList.add('board-list');

    const boards = await fetchBoards();
    appContainer.appendChild(boardCard);

    if (boards) {
        // ToDo: Des fonctions asynchrones dont dans cette boucle
        // Deux questions :
        // - L'ordre des tableaux change à chaque MAJ. Fix ?
        // - forEach est pour les fonctions synchrones. J'utilise for...of ?
        // Ajout d'une recherche et/ou d'un tri à terme
        boards.forEach((board) => {
            const boardItem = document.createElement('li');
            boardItem.classList.add('board-item');
            boardItem.setAttribute('role', 'listitem');

            // Je crée la colonne nom
            const nameCol = document.createElement('a');
            nameCol.classList.add('board-col', 'board-name');
            nameCol.textContent = board.name;
            nameCol.href = `/board?boardId=${board.id}`;

            // Je crée la colonne modification
            const updateCol = document.createElement('button');
            updateCol.classList.add('board-col', 'update-board-btn');

            // Je crée l'icône correspondante
            const updateIcon = document.createElement('i');
            updateIcon.classList.add('fas', 'fa-edit');
            updateCol.appendChild(updateIcon);

            updateCol.addEventListener('click', async () => {
                window.location.href = `/board?boardId=${board.id}&edit-board=true`;
            });

            // Je crée la colonne suppression
            const deleteCol = document.createElement('button');
            deleteCol.classList.add(
                'board-col',
                'delete-board-btn',
                'fas',
                'fa-trash'
            );
            deleteCol.addEventListener('click', async () => {
                // Je crée une fenêtre de validation
                const confirmed = confirm(
                    `Supprimer le tableau ${board.name} ?`
                );
                if (!confirmed) return;

                await deleteBoard(board.id);

                // Je mets à jour le DOM en retirant la node supprimée
                boardItem.remove();
            });

            // J'ajoute les colonnes à la ligne boardItem
            boardItem.appendChild(nameCol);
            boardItem.appendChild(updateCol);
            boardItem.appendChild(deleteCol);

            // J'ajoute la ligne à la liste des tableaux
            boardList.appendChild(boardItem);
        });

        // J'ajoute la liste à la carte et celle-ci au conteneur de l'app
        boardCard.appendChild(boardList);
    }
}

export default boardsPage;
