import { logoutUser } from '../../services/authServices';

async function handleLogoutUser(e: Event) {
    e.preventDefault();

    const confirmed = confirm('Voulez-vous vraiment vous déconnecter ?');
    if (!confirmed) return;

    try {
        await logoutUser();
        window.location.href = '/login';
    } catch (error) {
        console.error(`Erreur lors de la déconnexion: ${error}`);
    }
}

export default handleLogoutUser;
