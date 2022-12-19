import {TestCreate} from "./index";
import * as yup from 'yup';

export const validationSchema: yup.SchemaOf<TestCreate> = yup.object({
    age: yup.number().required(),
    name: yup.string().required()
})
