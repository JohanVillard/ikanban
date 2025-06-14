import './buttons.css';

function CancelBtn(cancelButtonText: string): HTMLButtonElement {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-btn';
    cancelBtn.type = 'button';

    const cancelBtnTxt = document.createElement('span');
    cancelBtnTxt.id = 'cancel-btn-txt';
    cancelBtnTxt.textContent = cancelButtonText;

    cancelBtn.appendChild(cancelBtnTxt);

    return cancelBtn;
}

export default CancelBtn;
