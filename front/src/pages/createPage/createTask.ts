import createTaskForm from '../../components/forms/createTaskForm';
import Header from '../../components/header/Header';
import './create.css';

async function createTaskPage() {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // Je crée le header en premier
    const header = Header('Création de la tâche');
    appContainer.appendChild(header);

    // Je crée un conteneur de la carte
    const createContainer = document.createElement('section');
    createContainer.id = 'create-container';
    appContainer.appendChild(createContainer);

    createTaskForm('#create-container');
}

export default createTaskPage;
