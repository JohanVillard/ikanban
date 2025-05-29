import CredentialsForm from './form/CredentialsForm';
import Header from '../../components/header/Header';
import { fetchUserProfile } from '../../services/authServices';
import './auth.css';

async function createProfilePage() {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    const header = Header('Mon Profil');
    appContainer.appendChild(header);

    const profileContainer = document.createElement('section');
    profileContainer.id = 'edit-container';
    appContainer.appendChild(profileContainer);

    // Je récupère les données de l'utilisateur
    const data = await fetchUserProfile();

    if (data.success === false) {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'no-data-display';
        errorContainer.textContent = "Erreur d'affichage de votre profil";
        return;
    }

    if (data.success === true) {
        // Je crée la carte de modification de l'utilisateur
        CredentialsForm('#edit-container');

        const user = data.data;
        if (!user) {
            console.error("L'utilisateur n'existe pas");
            return;
        }

        // Je place les infos de l'utilisateur dans les champs de saisie
        // querySelector retourne un Element | null et ne possède pas la propriéyé .value
        // Il faut préciser à TS l'élément attendu
        const nameInput = document.querySelector<HTMLInputElement>('#name');
        if (!nameInput) {
            console.error(`Le conteneur ${nameInput} n'existe pas`);
            return;
        }
        nameInput.value = user.name;

        const mailInput = document.querySelector<HTMLInputElement>('#email');
        if (!mailInput) {
            console.error(`Le conteneur ${mailInput} n'existe pas`);
            return;
        }
        mailInput.value = user.email;
    }
}

export default createProfilePage;
