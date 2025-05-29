import handleLogoutUser from './handler';

function LogoutButton(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.classList.add('header-title', 'logout-button');
    btn.textContent = 'Déconnexion';

    btn.addEventListener('click', handleLogoutUser);

    return btn;
}

export default LogoutButton;
