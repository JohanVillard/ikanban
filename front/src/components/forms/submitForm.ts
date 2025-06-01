import { authUser, updateUser } from '../../services/authServices';
import registerUser from '../../services/registerServices';
import {
    cleanFormErrorMsg,
    handleFormResponse,
    handleFrontValidationError,
} from '../../utils/userMessageHandlers';
import { goBack, goTo } from '../../utils/navigation';
import { jsObjectToJSON } from '../../utils/utils';

function handleSubmitFormData(formUserData: HTMLFormElement): void {
    formUserData.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Je nettoie les conteneurs de message pour l'utilisateur
        cleanFormErrorMsg();

        const path = window.location.pathname;

        // Je récupére les données du formulaire
        const formData = new FormData(formUserData);

        // Transformation en objet JS
        const jsObjectData = Object.fromEntries(formData.entries());

        const isDataValid = handleFrontValidationError(jsObjectData);
        if (isDataValid) {
            // On ne peux pas passer directement une instance de FormData dans fetch.
            // Pour envoyer notre requête, nous devons la convertir en JSON.
            const formDataJsonString = jsObjectToJSON(jsObjectData);

            // Ajouter les fonctions de soumission associées au chemin de la page
            // ainsi que les fonctions de navigations
            // Typage à améliorer
            const routeFunctionMapping: Record<string, Function[]> = {
                '/login': [authUser, () => goTo('/boards')],
                '/register': [registerUser, goBack],
                '/profile': [updateUser, goBack],
            };

            const routeFunction = routeFunctionMapping[path];

            try {
                if (routeFunction) {
                    const result = await routeFunction[0](formDataJsonString);
                    // Je valide le backend et remonte les erreurs
                    handleFormResponse(result);
                    if (result.success) routeFunction[1]();
                } else {
                    console.log(
                        `Aucune fonction définie pour le chemin : ${path}`
                    );
                }
            } catch (error) {
                console.error('Réponse inattendue du serveur', error);
            }
        }
    });
}

export default handleSubmitFormData;
