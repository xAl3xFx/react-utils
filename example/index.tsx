import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {UtilService} from "../src";


UtilService.setIntlFormatter(({id}: {id: any}) => id);
UtilService.setPrimeflexVersion(3);
const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Component Demo</h1>
      {/*<ManyFieldsForm />*/}
        <RegistrationForm />
    </div>
  );
};

import * as React from 'react';
import { DynamicForm } from '../src';
import * as Yup from 'yup';

// 1. Define your validation schema
const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    birthDate: Yup.date().required('Required'),
    age: Yup.number().min(18, 'Must be at least 18'),
});

// 2. A custom component to demonstrate shared context access
const FormStatus = () => {
    const formik = DynamicForm.useDynamicForm();
    return <small className="text-secondary">Submitting: {String(formik.isSubmitting)}</small>;
};

export const RegistrationForm = () => {
    return (
        <div className="card p-4">
            <h2>User Registration</h2>

            <DynamicForm.Root
                initialValues={{ username: '', email: '', birthDate: null, age: 0, role: '' }}
                validationSchema={validationSchema}
                onSubmit={(values: any) => console.log('Form Submitted:', values)}
            >
                <div className="grid">
                    {/* Standard Fields */}
                    <div className="col-12 md:col-6">
                        <DynamicForm.InputText name="username" label="Username" />
                    </div>
                    <div className="col-12 md:col-6">
                        <DynamicForm.InputText name="email" label="Email" type="email" />
                    </div>

                    {/* Complex Fields */}
                    <div className="col-12 md:col-6">
                        <DynamicForm.Calendar name="birthDate" label="Birth Date" showIcon />
                    </div>
                    <div className="col-12 md:col-6">
                        <DynamicForm.Number name="age" label="Age" />
                    </div>

                    {/* Dropdowns & Selections */}
                    <div className="col-12">
                        <DynamicForm.Dropdown
                            name="role"
                            label="User Role"
                            options={[{label: 'Admin', value: 'admin'}, {label: 'User', value: 'user'}]}
                        />
                    </div>
                </div>

                <div className="flex justify-content-between mt-3">
                    <FormStatus />
                    <button type="submit" className="p-button p-component">
                        Register
                    </button>
                </div>
            </DynamicForm.Root>
        </div>
    );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
