import createBoardForm from '../../components/forms/createBoardForm';
import Header from '../../components/header/Header';
import './create.css';

function createBoardPage(): void {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // Je crée le header en premier
    const header = Header('Création de tableau');
    appContainer.appendChild(header);

    // Je crée le conteneur de la carte de création
    const createContainer = document.createElement('section');
    createContainer.id = 'create-container';
    appContainer.appendChild(createContainer);

    // Et je le construis
    createBoardForm('#create-container');
}

export default createBoardPage;
