import './credentialsLink.css';

function CredentialsLink(cssSelector: string): void {
    const container = document.querySelector(cssSelector);

    if (container) {
        const path = window.location.pathname;
        const credentialsLinkText = document.createElement('span');

        let destination;
        let linkText;

        if (path === '/login') {
            destination = '/register';
            linkText = "S'enregistrer";
        } else if (path === '/register') {
            destination = '/login';
            linkText = 'Se connecter';
        }

        const credentialsLink = document.createElement('a');
        credentialsLink.id = 'credentials-link';
        credentialsLinkText.id = 'credentials-link-text';

        if (destination && linkText) {
            credentialsLink.href = destination;
            credentialsLinkText.textContent = linkText;
        } else {
            console.error('destination && linkText ne sont pas définis.');
        }

        container.appendChild(credentialsLink);
        credentialsLink.appendChild(credentialsLinkText);
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default CredentialsLink;
