function AriaInputHelp(id: string, helpTxt: string): HTMLDivElement {
    const div = document.createElement('div');
    div.id = `${id}`;
    div.classList.add(`${id}`);
    div.classList.add(`hidden`); // L'aide est caché par défaut
    div.textContent = `${helpTxt}`;

    return div;
}

export default AriaInputHelp;
