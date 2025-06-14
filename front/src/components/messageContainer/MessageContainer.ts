import './messageContainer.css';

function MessageContainer(type: 'validation' | 'error'): HTMLDivElement {
    const container = document.createElement('div');
    if (type === 'validation') {
        container.id = 'form-validation';
    } else {
        container.id = 'form-error';
    }

    return container;
}

export default MessageContainer;
