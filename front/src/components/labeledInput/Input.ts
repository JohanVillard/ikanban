function Input(type: string, id: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = type;
    input.name = id;
    input.id = id;
    input.classList.add('input-field');

    // J'informe le lecteur d'écran qu'il doit lire ces informations
    input.setAttribute('aria-describedby', `${id}-help ${id}-error`);

    return input;
}

export default Input;
