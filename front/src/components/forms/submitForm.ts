import { authUser, updateUser } from '../../services/authServices';
import registerUser from '../../services/registerServices';
import { cleanFormErrorMsg, handleFormResponse } from '../../utils/DOMManip';
import { goBack } from '../../utils/navigation';
import { formDataToJSON } from '../../utils/utils';

function handleSubmitFormData(formUserData: HTMLFormElement): void {
    formUserData.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Je nettoie les conteneurs de message pour l'utilisateur
        cleanFormErrorMsg();

        const path = window.location.pathname;

        // Je récupére les données du formulaire
        const formData = new FormData(formUserData);

        // On ne peux pas passer directement une instance de FormData dans fetch.
        // Pour envoyer notre requête, nous devons la convertir en JSON.
        const formDataJsonString = formDataToJSON(formData);

        // Ajouter les fonctions de soumission assiciées au chemin de la page
        const routeFunctionMapping: Record<string, Function> = {
            '/login': authUser,
            '/register': registerUser,
            '/profile': updateUser,
        };

        console.log(formDataJsonString);

        const routeFunction = routeFunctionMapping[path];

        try {
            if (routeFunction) {
                const result = await routeFunction(formDataJsonString);
                handleFormResponse(result);
                if (result.success) goBack();
            } else {
                console.log(`Aucune fonction définie pour le chemin : ${path}`);
            }
        } catch (error) {
            console.error('Réponse inattendue du serveur', error);
        }
    });
}

export default handleSubmitFormData;
