import './messageContainer.css';

function ErrorContainer(): HTMLDivElement {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'form-error';

    return errorContainer;
}

export default ErrorContainer;
