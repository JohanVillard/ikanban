export type ColumnDbRecord = {
    id: string;
    board_id: string;
    name: string;
    position: number;
    wip: number | null;
};

export type Column = {
    id: string;
    boardId: string;
    name: string;
    position: number;
    wip: number | null;
};

export type ColumnValidationInput = {
    name: string;
    wip: number | null;
    boardId: string;
    isNewName?: boolean;
};
