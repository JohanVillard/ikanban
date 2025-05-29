import editBoardForm from '../../components/forms/editBoardForm';
import Header from '../../components/header/Header';
import './edit.css';

async function editBoardPage() {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // Je crée et attache le header en premier
    const header = Header('Modification de tableau');
    appContainer.appendChild(header);

    // Je crée un conteneur de mise à jour
    const editContainer = document.createElement('section');
    editContainer.id = 'edit-container';
    appContainer.appendChild(editContainer);

    editBoardForm('#edit-container');
}

export default editBoardPage;
