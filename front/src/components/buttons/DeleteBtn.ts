import './buttons.css';

function DeleteBtn(): HTMLButtonElement {
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'delete-btn';
    deleteBtn.type = 'submit';

    const deleteBtnTxt = document.createElement('span');
    deleteBtnTxt.id = 'delete-btn-txt';
    deleteBtnTxt.textContent = 'Supprimer';

    deleteBtn.appendChild(deleteBtnTxt);

    return deleteBtn;
}

export default DeleteBtn;
