function updateWipDisplay(columnId: string) {
    const wipDisplay = document.querySelector<HTMLDivElement>(
        `#wip-display-${columnId}`
    );
    const tasksList = document.querySelector<HTMLUListElement>(
        `#task-list-${columnId}`
    );
    if (!wipDisplay || !tasksList) return;
    console.log(
        `[${columnId}] -> tâches HTML:\n`,
        [...tasksList.querySelectorAll('li')].map((li) => li.textContent)
    );

    const tasksCount = tasksList.querySelectorAll('li').length;
    const wipLimit = parseInt(wipDisplay.dataset.wip || '', 10);

    wipDisplay.classList.remove('wip-stop', 'wip-ok');

    if (!wipLimit) return; // infini

    if (tasksCount >= wipLimit) {
        wipDisplay.classList.add('wip-stop');
    } else {
        wipDisplay.classList.add('wip-ok');
    }
}

export default updateWipDisplay;
