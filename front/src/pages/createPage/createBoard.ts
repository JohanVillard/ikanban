import createBoardForm from '../../components/forms/createBoardForm';
import Header from '../../components/header/Header';
import './create.css';

function createBoardPage(): void {
    // 1. Conteneur d'app
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // 2. Header
    const header = Header('Création de tableau');
    appContainer.appendChild(header);

    // 3. Conteneur de section
    const createContainer = document.createElement('section');
    createContainer.id = 'create-container';
    appContainer.appendChild(createContainer);

    // 4. Formulaire
    createBoardForm('#create-container');
}

export default createBoardPage;
