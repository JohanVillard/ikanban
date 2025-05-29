import CredentialsForm from './form/CredentialsForm';
import createIKanbanLogo from '../../components/iKanbanLogo/iKanbanLogo';
import './auth.css';
import CredentialsLink from './link/credentialsLink';

function loginPage(): void {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    const credentialsCard = document.createElement('section');
    credentialsCard.id = 'credentials-card';

    appContainer.appendChild(credentialsCard);

    // Créer le logo de l'application
    createIKanbanLogo('#credentials-card');

    // Créer le conteneur mail, mot de passe et bouton => form
    CredentialsForm('#credentials-card');

    // Créer le lien vers l'enregistrement utilisateur
    CredentialsLink('#credentials-card');
}

export default loginPage;
