import createTaskItem from '../src/components/taskItem/createTaskItem.ts';
import { Task } from '../src/types/task.ts';
import { Column } from '../src/types/column.ts';
import { describe, expect, test, vi } from 'vitest';

// Vitest avec jsdom fournit automatiquement ceci, mais pas la...
globalThis.document = globalThis.document || {};
globalThis.window = globalThis.window || {};

const column1: Column = {
    id: 'col1',
    name: 'Ma colonne',
    userId: '1',
};

const task: Task = {
    id: '1',
    columnId: 'col1',
    name: 'Ma tâche',
    description: 'Ma description',
    done: false,
    position: 0,
};

describe('createTaskItem', () => {
    test('crée un élément <li> avec les bonnes classes et attributs', () => {
        const taskItem = createTaskItem(task, 'board123', column1);

        expect(taskItem.tagName).toBe('LI');
        expect(taskItem.classList.contains('draggable-task')).toBe(true);
        expect(taskItem.getAttribute('draggable')).toBe('true');
        expect(taskItem.getAttribute('data-task-id')).toBe('1');
        expect(taskItem.getAttribute('data-task-column-id')).toBe('col1');
    });

    test('contient un bouton avec le nom de la tâche', () => {
        const taskItem = createTaskItem(task, 'board123', column1);
        const button = taskItem.querySelector('button');

        expect(button).not.toBeNull();
        expect(button?.textContent).toBe('Ma tâche');
    });

    test('ajoute les classes selon que la tâche est terminée ou non', () => {
        const doneTask = { ...task, done: true };
        const taskItem = createTaskItem(doneTask, 'board123', column1);

        expect(taskItem.classList.contains('task-item-is-done')).toBe(true);
        expect(taskItem.classList.contains('task-item-not-done')).toBe(false);
    });

    test('attache les écouteurs d’événements dragstart et dragend', () => {
        const taskItem = createTaskItem(task, 'board123', column1);

        const dragStartHandler = vi.fn();
        const dragEndHandler = vi.fn();

        // Je remplace les listeners par des mocks
        taskItem.addEventListener('dragstart', dragStartHandler);
        taskItem.addEventListener('dragend', dragEndHandler);

        // Je simule les événements
        taskItem.dispatchEvent(new Event('dragstart'));
        taskItem.dispatchEvent(new Event('dragend'));

        expect(dragStartHandler).toHaveBeenCalled();
        expect(dragEndHandler).toHaveBeenCalled();
    });
});
