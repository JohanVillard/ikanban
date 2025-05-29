import LogoutButton from './LogoutButton';
import NavLink from './NavLink';

function Nav(): HTMLElement {
    const path = window.location.pathname;
    const nav = document.createElement('nav');

    if (path != '/boards') {
        const boardsLink = NavLink('/boards', 'Tableaux');
        nav.appendChild(boardsLink);
    }

    if (path != '/profile') {
        const profileLink = NavLink('/profile', 'Profil');
        nav.appendChild(profileLink);
    }

    const logoutBtn = LogoutButton();

    nav.appendChild(logoutBtn);
    return nav;
}

export default Nav;
