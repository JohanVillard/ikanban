import editTaskForm from '../../components/forms/editTaskForm';
import Header from '../../components/header/Header';
import './edit.css';

async function editTaskPage() {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // Je crée et attache le header en premier
    const header = Header('Modification de la tâche');
    appContainer.appendChild(header);

    // Je crée un conteneur de mise à jour
    const editContainer = document.createElement('section');
    editContainer.id = 'edit-container';
    appContainer.appendChild(editContainer);

    editTaskForm('#edit-container');
}

export default editTaskPage;
