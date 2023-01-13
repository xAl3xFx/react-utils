import * as React from 'react';
import {useEffect, useMemo, useRef} from 'react';
import {UtilService} from "./util-service";
import {FormElement} from "./DynamicForm";
import {FormikValues} from "formik";
import {Button} from "primereact/button";

interface Props<T> {
    fieldOrder: (keyof T)[] | string[];
    formik: any;
    onFieldChangeCallback?: (field: string, value: any) => void;
    formElements: FormElement<T>;
    customElements?: { [key in keyof Partial<T> | string]: (formik: any) => JSX.Element };
    rowClassName?: string;
    optionValue?: string;
    optionLabel?: string;
    formGridClassName?: string;
    elementKey?: string | number;
    removeElementHandler?: (key: string | number) => any;
    removeButtonTooltip?: string;
}

export const DynamicFieldset = <T extends FormikValues, >(
    props: Props<T>
) => {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
        }
    }, []);

    const {
        generateTextField,
        generateDropdownField,
        generateNumberField,
        generateCalendarField,
        generateMultiselectField,
        generatePasswordField
    } = UtilService.fieldUtils(props.formik, props.onFieldChangeCallback);

    const generateForm = useMemo(() => {
        // console.log('DynamicForm: generateForm called');
        const result = props.fieldOrder.map((key) => {
            let el;
            if (props.customElements && props.customElements[key]) {
                el = props.customElements[key](props.formik);
                return <div key={String(key)} className={props.rowClassName}>{el}</div>
            }

            const label = props.formElements[key].label;
            const elProps = props.formElements[key].props;
            switch (props.formElements[key].type) {
                case "text": {
                    //@ts-ignore
                    el = generateTextField({field: key, label, props: elProps});
                    break;
                }
                case "number": {
                    //@ts-ignore
                    el = generateNumberField({field: key, label, props: elProps});
                    break;
                }
                case "calendar": {
                    //@ts-ignore
                    el = generateCalendarField({field: key, label, props: elProps});
                    break;
                }
                case "dropdown": {
                    //@ts-ignore
                    el = generateDropdownField({
                        field: key,
                        label,
                        options: props.formElements[key].options,
                        props: {...elProps, filter: true},
                        selectIfSingle: true,
                        optionValue: props.optionValue,
                        optionLabel: props.optionLabel,
                        button: props.formElements[key].button
                    });
                    break;
                }
                case "multiselect": {
                    //@ts-ignore
                    el = generateMultiselectField({
                        field: key,
                        label,
                        options: props.formElements[key].options,
                        elProps,
                        optionValue: props.optionValue,
                        optionLabel: props.optionLabel,
                        button: props.formElements[key].button
                    });
                    break;
                }
                case "password": {
                    //@ts-ignore
                    el = generatePasswordField({field: key, label, options: props.formElements[key].options, elProps});
                    break;
                }
                default: {
                    el = null;
                }
            }

            return <div key={String(key)} className={props.rowClassName}>{el}</div>
        })

        if (props.removeElementHandler && props.elementKey !== undefined) {
            result.push(
                <div key={props.elementKey + '-remove'} className={'p-col-12 p-md-1'}>{<Button
                    onClick={() => props.removeElementHandler!(props.elementKey!)} type={"button"}
                    icon={'pi pi-trash'} className={'p-button-danger'}
                    tooltip={props.removeButtonTooltip}
                    tooltipOptions={{position: "top"}}/>}</div>
            )
        }

        return result;
    }, [props.formik.touched, props.formik.values, props.formElements, props.fieldOrder]);


    return <>
        <div className={props.formGridClassName || 'p-grid p-fluid p-mt-3 p-p-1'}>
            {generateForm}
        </div>
    </>
};

DynamicFieldset.defaultProps = {
    rowClassName: 'p-col-12 p-md-4',
    removeButtonTooltip: "Премахни"
}
