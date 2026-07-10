import * as React from 'react';
import { Button } from "primereact/button";
import { UtilService } from "../util-service";
import {useDynamicForm} from "../context/DynamicFormContext";


export type FormButtonsPosition = "start" | "center" | "end";

export interface FormButtonsProps {
    position?: FormButtonsPosition;
    className?: string;
    // Keep labels as optional props in case the user wants to override defaults
    saveButtonLabel?: string;
    updateButtonLabel?: string;
    cancelButtonLabel?: string;
    resetButtonLabel?: string;
    onCancel?: () => void;
}

export const FormButtons: React.FC<FormButtonsProps> = (props) => {
    const formik = useDynamicForm(); // Now it knows everything about the form!
    const f = UtilService.intlFormatter;

    // We assume your library logic determines "isUpdate" via formik status or a custom check
    // If you don't have isUpdate in formik, you can pass it as a prop,
    // but usually, checking if initialValues matches current or a status flag is better.
    const isUpdate = !!formik.values.id; // Example logic: if id exists, it's an update

    const wrapperClassName = `p-fluid grid justify-content-${props.position || "center"}`;
    const defaultClassName = 'col-12 md:col-3 lg:col-3 xl:col-2';

    return (
        <div className={wrapperClassName}>
            <div className={props.className || defaultClassName}>
                <Button
                    type="submit"
                    label={isUpdate ? (props.updateButtonLabel || f({id: 'update'})) : (props.saveButtonLabel || f({id: 'save'}))}
                    disabled={formik.isSubmitting || !formik.isValid}
                />
            </div>
            <div className={props.className || defaultClassName}>
                <Button
                    type="button"
                    onClick={() => formik.resetForm()}
                    label={props.resetButtonLabel || f({id: 'reset'})}
                />
            </div>
            {isUpdate && props.onCancel && (
                <div className={props.className || defaultClassName}>
                    <Button type="button" onClick={props.onCancel} label={props.cancelButtonLabel || f({id: "cancelChange"})} />
                </div>
            )}
        </div>
    );
};
