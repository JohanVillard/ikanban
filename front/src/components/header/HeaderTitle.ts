function HeaderTitle(title: string, level: 1 | 2) {
    const headerTitle = document.createElement(`h${level}`);
    headerTitle.classList.add('header-title');
    headerTitle.textContent = title;

    return headerTitle;
}

export default HeaderTitle;
