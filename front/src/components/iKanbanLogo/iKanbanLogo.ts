import './iKanbanLogo.css';

function createIKanbanLogo(cssSelector: string): void {
    const container = document.querySelector(cssSelector);

    if (container) {
        const iKanbanlogo = document.createElement('img');
        iKanbanlogo.id = 'ikanban-logo';
        iKanbanlogo.src = '/iKanbanLogo.png';
        iKanbanlogo.alt = 'Logo iKanban';
        iKanbanlogo.setAttribute('aria-label', 'Logo iKanban');
        container.appendChild(iKanbanlogo);
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default createIKanbanLogo;
