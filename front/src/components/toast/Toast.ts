import './Toast.css';

const FADE_DUR = 500;
const DISPLAY_DUR = 3000;
let toastContain: HTMLDivElement;

function Toast(message: string, extraClasses?: string): void {
    // 1. Je crée un conteneur global pour les messages de toast avec la clase .toastContain
    if (!toastContain) {
        toastContain = document.createElement('div');
        toastContain.classList.add('toastContain');
        document.body.appendChild(toastContain);
    }

    // 2. J'ajoute des toast avec les classes .toast et extraClasses
    const EL = document.createElement('div');
    if (extraClasses) EL.classList.add('toast', extraClasses);
    EL.textContent = message;
    toastContain.prepend(EL);

    // 3. Je transitionne le message de toast
    setTimeout(() => EL.classList.add('open'), 10);
    setTimeout(() => EL.classList.remove('open'), DISPLAY_DUR);
    setTimeout(() => toastContain.removeChild(EL), DISPLAY_DUR + FADE_DUR);
}

export default Toast;
