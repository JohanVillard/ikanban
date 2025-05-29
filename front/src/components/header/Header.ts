import './header.css';
import HeaderTitle from './HeaderTitle';
import createNav from './Nav';

function Header(pageName: string): HTMLElement {
    const header = document.createElement('header');
    header.classList.add('header');

    const headerAppName = HeaderTitle('iKanban', 1);
    const headerPageName = HeaderTitle(pageName, 2);

    header.appendChild(headerAppName);
    header.appendChild(headerPageName);
    header.appendChild(createNav());

    return header;
}

export default Header;
