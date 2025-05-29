import boardPage from './pages/board/board';
import boardsPage from './pages/boards/boards';
import createBoardPage from './pages/createPage/createBoard';
import createColumnPage from './pages/createPage/createColumn';
import createTaskPage from './pages/createPage/createTask';
import editBoardPage from './pages/editPage/editBoard';
import editColumnPage from './pages/editPage/editColumn';
import editTaskPage from './pages/editPage/editTask';
import loginPage from './pages/auth/login';
import registerPage from './pages/auth/register';
import { isAuthenticated } from './services/authServices';
import createProfilePage from './pages/auth/profile';

async function routes() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const boardId = params.get('boardId');
    const columnId = params.get('columnId');
    const taskId = params.get('taskId');

    const isAuth = await isAuthenticated();

    if (path === '/login') {
        loginPage();
    } else if (path === '/register') {
        registerPage();
    } else if (isAuth) {
        if (path === '/boards') {
            boardsPage();
        } else if (path === '/profile') {
            createProfilePage();
        } else if (path === '/create-board') {
            createBoardPage();
        } else if (boardId && params.get('edit-board') === 'true') {
            editBoardPage();
        } else if (boardId && params.get('create-column') === 'true') {
            createColumnPage();
        } else if (
            boardId &&
            columnId &&
            params.get('edit-column') === 'true'
        ) {
            editColumnPage();
        } else if (
            boardId &&
            columnId &&
            params.get('create-task') === 'true'
        ) {
            createTaskPage();
        } else if (
            boardId &&
            columnId &&
            taskId &&
            params.get('edit-task') === 'true'
        ) {
            editTaskPage();
        } else if (boardId) {
            boardPage(boardId);
        }
    } else {
        console.error('URL invalide ou ID manquant ou token expiré');
        window.location.href = '/login';
    }
}

routes();
