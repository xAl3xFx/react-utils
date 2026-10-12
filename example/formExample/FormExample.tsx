import { DynamicForm } from "../../src";
import {TestForm, validationSchema} from "./validation";
import {Fieldset} from "primereact/fieldset";
import TestCustomElement from "./TestCustomElement";
import {Button} from "primereact/button";
import {FieldArrayRenderProps} from "formik";
import * as React from "react";

export const FormExample = () => {
    const initialValues : TestForm = {
        name: '',
        email: '',
        age: 0,
        role: 0,
        password: '',
        birthDate: new Date(),
        classes: [],
        types: [],
        spentFuel: 0
    }

    const getLegend = (helpers: FieldArrayRenderProps) => {
        return <div className="flex align-items-center">
            <label>Test Fieldset</label>
            <Button
                type="button"
                icon="pi pi-plus"
                onClick={() => helpers.push("")} // Correct way: Triggers state update
            />
        </div>
    }

    const getTypeOptions = () => {
        return [
                {
                    "id": "7373505d-ec8b-4e3b-b4d5-e06f74711503",
                    "key": "7373505d-ec8b-4e3b-b4d5-e06f74711503",
                    "description": "Авто Кантар 1",
                    "items": null
                },
                {
                    "id": "e27957e9-a760-4cb0-a200-744f93339660",
                    "key": "e27957e9-a760-4cb0-a200-744f93339660",
                    "description": "Бариера Портал",
                    "items": null
                },
                {
                    "id": "1b6e418d-ba4d-44d8-9e6f-ebf5fb1c3f1a",
                    "key": "1b6e418d-ba4d-44d8-9e6f-ebf5fb1c3f1a",
                    "description": "Камера Портал Изход",
                    "items": null
                },
                {
                    "id": "d754465a-0eb0-49c5-afd4-0a9ed5295c31",
                    "key": "d754465a-0eb0-49c5-afd4-0a9ed5295c31",
                    "description": "Камера Портал Вход",
                    "items": null
                }
            ]
    }

    return (
        <div className="card p-4">
            <h2>User Registration</h2>

            <DynamicForm.Root
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values: TestForm) => console.log('Form Submitted:', values)}
            >
                <div className="grid">
                    {/* Standard Fields */}
                    <div className="col-12 md:col-6">
                        <DynamicForm.InputText className={"w-full"} name="name" label="Name" />
                    </div>
                    <div className="col-12 md:col-6">
                        <DynamicForm.InputText className={"w-full"} name="email" label="Email" type="email" />
                    </div>

                    {/* Complex Fields */}
                    <div className="col-12 md:col-6">
                        <DynamicForm.Calendar className={"w-full"} name="birthDate" label="Birth Date" showIcon />
                    </div>
                    <div className="col-12 md:col-6">
                        <DynamicForm.Number className={"w-full"} name="age" label="Age" />
                    </div>
                    <div className="col-12 md:col-6">
                        <DynamicForm.Number className={"w-full"} name="age" label="Age" />
                    </div>

                    {/* Dropdowns & Selections */}
                    <div className="col-12 md:col-6">
                        <DynamicForm.Dropdown
                            className={"w-full"}
                            name="role"
                            label="User Role"
                            options={[{label: 'Admin', value: 1}, {label: 'User', value: 2}]}
                        />
                    </div>

                   {/* This is an inner array*/}
                    <DynamicForm.Array name="classes" wrapperClassName={"col-12"}>
                        {(helpers) => (
                            <Fieldset legend={getLegend(helpers)} className="w-full">
                                {helpers.form.values.classes.map((_: any, index: number) => (
                                    <div key={index} className="flex align-items-center gap-2 w-full">
                                        <DynamicForm.InputText
                                            className={"w-full"}
                                            name={`classes.${index}`}
                                            label={`Class ${index}`}

                                        />
                                        <Button
                                            type="button"
                                            icon="pi pi-trash"
                                            severity="danger"
                                            onClick={() => {
                                                console.log("Removing class at index:", index);
                                                helpers.remove(index)
                                            }} // Correct way: Triggers state update
                                        />
                                    </div>
                                ))}
                            </Fieldset>
                        )}
                    </DynamicForm.Array>

                    <DynamicForm.Array name="types" wrapperClassName={"col-12"}>
                        {(helpers) => (
                            <Fieldset legend={getLegend(helpers)} className="w-full">
                                {helpers.form.values.types.map((_: any, index: number) => (
                                    <div key={index} className="flex align-items-center gap-2 w-full">
                                        <DynamicForm.Dropdown
                                            options={getTypeOptions() ?? []}
                                            optionLabel="description"
                                            optionValue="id"
                                            className="w-full"
                                            name={`types.${index}`}
                                            label={"type"}
                                            filter
                                        />
                                        <Button
                                            type="button"
                                            icon="pi pi-trash"
                                            severity="danger"
                                            onClick={() => {
                                                console.log("Removing class at index:", index);
                                                helpers.remove(index)
                                            }} // Correct way: Triggers state update
                                        />
                                    </div>
                                ))}
                            </Fieldset>
                        )}
                    </DynamicForm.Array>

                    <TestCustomElement/>

                    <div className="col-12 md:col-6">
                        <DynamicForm.Password
                            className={"w-full"}
                            name="password"
                            label="Password"
                        />
                    </div>
                </div>

                <DynamicForm.FormButtons />
            </DynamicForm.Root>
        </div>
    );
};
