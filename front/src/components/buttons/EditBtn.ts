import './buttons.css';

function EditBtn(): HTMLButtonElement {
    const editBtn = document.createElement('button');
    editBtn.id = 'edit-btn';
    editBtn.type = 'submit';

    const editBtnTxt = document.createElement('span');
    editBtnTxt.id = 'edit-btn-txt';
    editBtnTxt.textContent = 'Modifier';

    editBtn.appendChild(editBtnTxt);

    return editBtn;
}

export default EditBtn;
