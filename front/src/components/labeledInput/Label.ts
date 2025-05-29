function Label(forInputId: string, labelText: string) {
    const labelContainer = document.createElement('label');
    labelContainer.classList.add('label-container');
    labelContainer.setAttribute('for', forInputId);
    labelContainer.textContent = labelText;

    return labelContainer;
}

export default Label;
