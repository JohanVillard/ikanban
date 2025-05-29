import './buttons.css';

function SubmitBtn(submitButtonText: string): HTMLButtonElement {
    const submitBtn = document.createElement('button');
    submitBtn.id = 'submit-btn';
    submitBtn.type = 'submit';

    const submitBtnTxt = document.createElement('span');
    submitBtnTxt.id = 'submit-btn-txt';
    submitBtnTxt.textContent = submitButtonText;

    submitBtn.appendChild(submitBtnTxt);

    return submitBtn;
}

export default SubmitBtn;
