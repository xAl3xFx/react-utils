import * as yup from "yup";

export interface TestForm {
    name: string;
    age: number;
    email: string;
    password: string;
    role: number;
    birthDate: Date,
    classes: string[],
    types: string[],
    spentFuel: number;
}

export const validationSchema: yup.ObjectSchema<TestForm> = yup.object({
    name: yup.string().required(),
    age: yup.number().required().positive(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    role: yup.number().required().positive(),
    birthDate: yup.date().required(),
    classes: yup.array().of(yup.string().required()).required(),
    types: yup.array().of(yup.string().required()).required(),
    spentFuel: yup.number().required().positive()
})
