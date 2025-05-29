import { deleteUser } from '../../../../services/authServices';

async function handleDeleteUser(e: Event) {
    e.preventDefault();
    const firstConfirmation = window.confirm(
        'Souhaitez-vous réellement effacer votre compte ?'
    );
    if (!firstConfirmation) {
        return; // L'utilisateur a annulé
    }

    const secondConfirmation = window.prompt(
        '⚠️ Cette action est irréversible.\n\n' +
            'La suppression de votre compte entraînera la perte définitive de toutes vos données (tableaux, tâches, paramètres...).\n\n' +
            'Pour confirmer, veuillez taper : EFFACER'
    );
    if (secondConfirmation === 'EFFACER') {
        const isUserDeleted = await deleteUser();
        console.log(isUserDeleted);
    }
}

export default handleDeleteUser;
