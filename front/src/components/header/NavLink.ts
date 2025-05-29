function NavLink(goTo: string, name: string): HTMLAnchorElement {
    const link = document.createElement('a');
    link.classList.add('header-title');
    link.href = goTo;
    link.textContent = name;

    return link;
}

export default NavLink;
