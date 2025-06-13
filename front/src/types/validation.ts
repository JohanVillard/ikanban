export type ValidationRule = {
    label: string;
    notEmpty?: boolean;
    minLength?: number;
    isStrongPassword?: PasswordOptions;
    pattern?: string;
    matchWith?: string;
    errorMessages?: {
        notEmpty?: string;
        minLength?: string;
        pattern?: string;
        matchWith?: string;
        isStrongPassword?: string;
    };
};

export type PasswordOptions = {
    minLength: number;
    minLowercase: number;
    minUppercase: number;
    minNumbers: number;
    minSymbols: number;
};

export type JsFormData = {
    name?: string;
    email?: string;
    password?: string;
    description?: string;
    wip?: string;
};
