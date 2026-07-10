import { createContext, useContext } from 'react';
import { FormikContextType } from 'formik';

export const DynamicFormContext = createContext<FormikContextType<any> | null>(null);

export const useDynamicForm = () => {
    const context = useContext(DynamicFormContext);
    if (!context) throw new Error("DynamicForm_deprecated sub-components must be wrapped in <DynamicForm_deprecated.Root>");
    return context;
};
