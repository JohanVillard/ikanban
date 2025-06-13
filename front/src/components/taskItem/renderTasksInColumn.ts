import { fetchTasksByColumns } from '../../services/taskServices';
import { Column } from '../../types/column';
import { Task } from '../../types/task';
import TaskItem from './createTaskItem';

async function renderTasksInColumn(
    boardId: string,
    column: Column,
    tasksList: HTMLUListElement | null
): Promise<Task[]> {
    // Je récupère les tâches appartenant à la colonne
    const result = await fetchTasksByColumns(boardId, column.id);

    if (!result.success) {
        console.warn(
            `Erreur survenue lors de la récupération des tâches : ${result.error}`
        );
        return [];
    } else {
        const tasks = result.data || [];

        // Je trie les tâches par ordre de position
        tasks.sort((a, b) => a.position - b.position);
        for (const task of tasks) {
            const taskItem = TaskItem(task, boardId, column);
            tasksList?.appendChild(taskItem);
        }

        return tasks;
    }
}

export default renderTasksInColumn;
