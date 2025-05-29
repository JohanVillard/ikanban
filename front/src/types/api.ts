import { Board } from './board';
import { Column } from './column';
import { Task } from './task';
import { User } from './user';

export type DeleteStatus = {
    isDeleted: boolean;
    message: string;
};

export type AuthObject = {
    success: boolean;
    token: string;
    message: string;
    errors: Errors;
};

export type Errors = {
    name?: { msg: string };
    email?: { msg: string } | undefined;
    password?: { msg: string };
};

export type ApiSuccess<T> = {
    success: true;
    data?: T;
    message?: string;
};

export type ApiFailure = {
    success: false;
    error: string;
};

export type ValidationError = {
    success: false;
    errors: {
        [field: string]: { msg: string };
    };
};

export type UserProfileResponse = ApiSuccess<User> | ApiFailure;
export type AuthUserResponse =
    | ApiSuccess<string>
    | ApiFailure
    | ValidationError;
export type RegisterUserResponse =
    | ApiSuccess<User>
    | ApiFailure
    | ValidationError;
export type UpdateUserResponse =
    | ApiSuccess<User>
    | ApiFailure
    | ValidationError;

export type DeleteUserResponse = ApiSuccess<string> | ApiFailure;

export type BoardResponse = ApiSuccess<Board> | ApiFailure | ValidationError;

export type ColumnResponse = ApiSuccess<Column> | ApiFailure | ValidationError;
export type ColumnsInBoardResponse = ApiSuccess<Column[]> | ApiFailure;

export type TaskResponse = ApiSuccess<Task> | ApiFailure | ValidationError;
export type TaskInBoardResponse = ApiSuccess<Task> | ApiFailure;
export type TaskListInBoardResponse = ApiSuccess<Task[]> | ApiFailure;
export type UpdateTaskResponse = ApiSuccess<Partial<Task>> | ApiFailure;

export type FormResponse =
    | AuthUserResponse
    | RegisterUserResponse
    | BoardResponse
    | UpdateUserResponse
    | ColumnResponse
    | TaskResponse
    | UpdateTaskResponse;

export type ApiSuccessData =
    | User
    | Board
    | Column
    | Task
    | Partial<Task>
    | string;
