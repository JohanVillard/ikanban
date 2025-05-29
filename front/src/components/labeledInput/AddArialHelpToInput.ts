import AriaInputHelp from './AriaInputHelp';

function addAriaHelpToInput(
    inputField: HTMLInputElement | HTMLTextAreaElement,
    helpId: string,
    helpText: string
): HTMLDivElement {
    const ariaInputHelp = AriaInputHelp(`${helpId}-help`, helpText);

    inputField?.addEventListener('focus', () => {
        ariaInputHelp.classList.remove('hidden');
    });
    inputField?.addEventListener('blur', () => {
        ariaInputHelp.classList.add('hidden');
    });

    return ariaInputHelp;
}

export default addAriaHelpToInput;
