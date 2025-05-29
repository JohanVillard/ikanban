import './buttons.css';

function CancelBtn(cancelButtonText: string): HTMLButtonElement {
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'cancel-btn';

    const cancelBtnTxt = document.createElement('span');
    cancelBtnTxt.id = 'cancel-btn-txt';
    cancelBtnTxt.textContent = cancelButtonText;

    cancelBtn.appendChild(cancelBtnTxt);

    return cancelBtn;
}

export default CancelBtn;
