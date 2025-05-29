export type TaskDbRecord = {
    id: string;
    column_id: string;
    name: string;
    description: string;
    done: boolean;
    position: number;
};

export type Task = {
    id: string;
    columnId: string;
    name: string;
    description: string;
    done: boolean;
    position: number;
};
