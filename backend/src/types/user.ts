export type UserDbRecord = {
    id: string;
    name: string;
    email: string;
    password_hash: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
};

export type NewUser = {
    name: string;
    email: string;
    password: string;
    passconf: string;
};
