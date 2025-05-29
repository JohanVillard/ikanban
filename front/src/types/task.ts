export type Task = {
    id: string;
    columnId: string;
    name: string;
    description: string;
    done: boolean;
    position: number;
};

export type UpdatedTask = {
    columnId: string;
    name: string;
    description: string;
    done: boolean;
    position: number;
};
