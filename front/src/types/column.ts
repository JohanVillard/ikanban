export type Column = {
    id: string;
    name: string;
    userId: string;
    wip: number;
};

export type ColumnCommandsArgs = {
    columnHeader: HTMLDivElement;
    column: Column;
    boardId: string;
    columnElement: HTMLElement;
};
