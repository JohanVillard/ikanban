import createColumnForm from '../../components/forms/createColumnForm';
import Header from '../../components/header/Header';
import './create.css';

async function createColumnPage() {
    // Je crée le conteneur de l'application
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // Je crée le header en premier
    const header = Header('Création de colonne');
    appContainer.appendChild(header);

    // Je crée le conteneur de la carte
    const createContainer = document.createElement('section');
    createContainer.id = 'create-container';
    appContainer.appendChild(createContainer);

    createColumnForm('#create-container');
}

export default createColumnPage;
