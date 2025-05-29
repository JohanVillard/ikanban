import './messageContainer.css';

function ValidationContainer(): HTMLDivElement {
    const validationContainer = document.createElement('div');
    validationContainer.id = 'form-validation';

    return validationContainer;
}

export default ValidationContainer;
