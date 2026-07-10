import * as React from 'react';
import { FormikProvider, useFormik, FormikValues, FormikConfig } from 'formik';
import { DynamicFormContext, useDynamicForm } from '../context/DynamicFormContext';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { Calendar, CalendarProps } from 'primereact/calendar';
import { InputNumber, InputNumberProps } from 'primereact/inputnumber';
import { InputText, InputTextProps } from 'primereact/inputtext';
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';
import { Password, PasswordProps } from 'primereact/password';

interface CustomFieldProps {
    name: string;
    label: string;
}

export type DropdownFieldProps = CustomFieldProps & DropdownProps;
export type CalendarFieldProps = CustomFieldProps & CalendarProps;
export type InputNumberFieldProps = CustomFieldProps & InputNumberProps;
export type InputTextFieldProps = CustomFieldProps & InputTextProps;
export type MultiselectFieldProps = CustomFieldProps & MultiSelectProps;
export type PasswordFieldProps = CustomFieldProps & PasswordProps;



// --- Root Component ---
const Root = <T extends FormikValues>({ children, validationSchema, ...formikConfig }: { children: React.ReactNode } & FormikConfig<T>) => {
    const formik = useFormik<T>({...formikConfig, validationSchema});
    return (
        <DynamicFormContext.Provider value={formik}>
            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>{children}</form>
            </FormikProvider>
        </DynamicFormContext.Provider>
    );
};

// --- Field Components ---
const FieldWrapper = ({ name, label, children }: any) => {
    const formik = useDynamicForm();

    // Check if this field has been touched AND has an error
    const hasError = formik.touched[name] && formik.errors[name];

    return (
        <div className="field mb-3">
            {label && <label htmlFor={name} className="block mb-1">{label}</label>}
            {children}
            {hasError && (
                <small className="p-error block mt-1">
                    {formik.errors[name] as string}
                </small>
            )}
        </div>
    );
};

const InputTextComp = ({ name, label, ...props }: InputTextFieldProps) => {
    const formik = useDynamicForm();
    return <FieldWrapper name={name} label={label}><InputText id={name} name={name} value={formik.values[name]} onChange={formik.handleChange} {...props} /></FieldWrapper>;
};

const DropdownComp = ({ name, label, options, ...props }: DropdownFieldProps) => {
    const formik = useDynamicForm();
    return <FieldWrapper name={name} label={label}><Dropdown id={name} options={options} value={formik.values[name]} onChange={(e) => formik.setFieldValue(name, e.value)} {...props} /></FieldWrapper>;
};

const CalendarComp = ({ name, label, ...props }: CalendarFieldProps) => {
    const formik = useDynamicForm();
    return <FieldWrapper name={name} label={label}><Calendar id={name} value={formik.values[name]} onChange={(e) => formik.setFieldValue(name, e.value)} {...props} /></FieldWrapper>;
};

const NumberComp = ({ name, label, ...props }: InputNumberFieldProps) => {
    const formik = useDynamicForm();
    return <FieldWrapper name={name} label={label}><InputNumber id={name} value={formik.values[name]} onValueChange={(e) => formik.setFieldValue(name, e.value)} {...props} /></FieldWrapper>;
};

const MultiSelectComp = ({ name, label, options, ...props }: MultiselectFieldProps) => {
    const formik = useDynamicForm();
    return <FieldWrapper name={name} label={label}><MultiSelect id={name} options={options} value={formik.values[name]} onChange={(e) => formik.setFieldValue(name, e.value)} {...props} /></FieldWrapper>;
};

const PasswordComp = ({ name, label, ...props }: PasswordFieldProps) => {
    const formik = useDynamicForm();
    return <FieldWrapper name={name} label={label}><Password id={name} name={name} value={formik.values[name]} onChange={formik.handleChange} {...props} /></FieldWrapper>;
};

// --- Export Assembly ---
export const DynamicForm = {
    Root,
    InputText: InputTextComp,
    Dropdown: DropdownComp,
    Calendar: CalendarComp,
    Number: NumberComp,
    MultiSelect: MultiSelectComp,
    Password: PasswordComp,
    useDynamicForm
};
