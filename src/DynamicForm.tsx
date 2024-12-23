import * as React from 'react';
import {useEffect, useState, useRef, useMemo} from 'react';
import {InputTextProps} from "primereact/inputtext";
import {DropdownProps} from "primereact/dropdown";
import {CalendarProps} from "primereact/calendar";
import {InputNumberProps} from "primereact/inputnumber";
import {FormikValues, useFormik} from "formik";
import {MultiSelectProps} from "primereact/multiselect";
import * as Yup from 'yup';
import {FormButtons, FormButtonsPosition} from "./FormButtons";
import {IDropdownOption, UtilService} from "./util-service";
import {PasswordProps} from "primereact/password";

export type FormElementType = 'text' | 'dropdown' | 'calendar' | 'number' | 'multiselect' | 'password';

type FormElementProps<T extends FormElementType> =
    T extends "text"
        ?
        {
            props?: InputTextProps;
        }
        :
        T extends "dropdown"
            ?
            {
                props?: DropdownProps;
                options: IDropdownOption[];
                button?: JSX.Element;
                selectIfSingle?: boolean;
            }
            :
            T extends "calendar"
                ?
                {
                    props?: CalendarProps;
                }
                :
                T extends 'multiselect'
                    ?
                    {
                        props?: MultiSelectProps;
                        options: IDropdownOption[];
                        button?: JSX.Element;
                    }
                    :
                    T extends 'password'
                        ?
                        {
                            props?: PasswordProps
                        }
                        :
                        {
                            props?: InputNumberProps
                        };

export type FormElementValues<T extends FormElementType> = FormElementProps<T> & {
    type: T;
    label: string;
}

export type FormElement<T> = { [key in keyof Partial<T>]: FormElementValues<FormElementType> }

interface Props<T, K> {
    onFieldChangeCallback?: (field: string, value: any) => void;
    formElements: FormElement<T>;
    isUpdate: boolean;
    onCreate: (values: T) => Promise<boolean>;
    onUpdate: (values: K) => Promise<boolean>;
    onFormReset?: () => void;
    children?: React.ReactNode;
    validationSchema?: Yup.SchemaOf<any>;
    rowClassName?: string;
    formButtonsPosition?: FormButtonsPosition;
    formButtonsClassName?: string;
    initialValues: T;
    fieldOrder: (keyof T)[] | string[];
    customElements?: { [key in keyof Partial<T> | string]: (formik: any) => JSX.Element };
    onCancelUpdate: () => void;
    className?: any;
    setFormikRef?: (formik: any) => void;
    formik?: any;
    saveButtonLabel?: string;
    updateButtonLabel?: string;
    cancelUpdateButtonLabel?: string;
    clearButtonLabel?: string;
    clearButtonOnUpdateLabel?: string;
    optionLabel?: string;
    optionValue?: string;
    disableSaveButton?: boolean;
    disableSaveButtonIfErrors?: boolean;
    hideButtons?: boolean;
    formGridClassName?: string;
    scrollToForm?: boolean;
    readOnly?: boolean;
}

export const DynamicForm = <T extends FormikValues, K extends FormikValues>(
    props: Props<T, K>
) => {
    const [primeflexVersion, setPrimeflexVersion] = useState(UtilService.primeflexVersion);

    const defaultRowClassName = (primeflexVersion === 2 ? "p-col-12 p-md-4" : 'col-12 md:col-4 mb-3');
    const defaultFormGridClassName = (primeflexVersion === 2 ? "p-grid p-fluid p-mt-3 p-p-1" : 'grid p-fluid mt-3 p-1');

    const formRef = useRef<HTMLFormElement | null>();
    const didMountRef = useRef(false);

    useEffect(() => {
        if (!primeflexVersion) throw new Error("Unspecified primeflex version!");
    }, []);


    const resetForm = () => {
        if (!props.isUpdate)
            formik.resetForm();
        else
            formik.setValues({...props.initialValues}, false);
        if (props.onFormReset)
            props.onFormReset();
    }

    useEffect(() => {
        formik.setValues({...props.initialValues});
    }, [props.initialValues]);

    useEffect(() => {
        if (!props.isUpdate || !formRef.current || props.scrollToForm === false) return;
        setTimeout(() => {
            var element = formRef.current;
            if (!element) return;
            var headerOffset = 150;
            var elementPosition = element.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        },)

    }, [props.isUpdate, formRef.current, props.scrollToForm]);

    // useEffect(() => {
    //     console.log('DynamicForm: Updated');
    // });

    const formik = props.formik || useFormik({
        initialValues: {...props.initialValues},
        validationSchema: props.validationSchema,
        onSubmit: (data: T | K) => {
            if (props.isUpdate) {
                props.onUpdate(data as K).then(result => {
                    //Do not use resetForm() here because it will just reset initialValues from update.
                    if (result) {
                        formik.resetForm();
                        if (props.onFormReset)
                            props.onFormReset();
                    }
                });
            } else {
                props.onCreate(data as T).then(result => {
                    if (result)
                        resetForm()
                });
            }
        }
    });

    useEffect(() => {
        if (props.setFormikRef) {
            props.setFormikRef(formik);
        }
    }, [formik]);

    const {
        generateTextField,
        generateDropdownField,
        generateNumberField,
        generateCalendarField,
        generateMultiselectField,
        generatePasswordField
    } = UtilService.fieldUtils(formik, props.onFieldChangeCallback);

    //TODO: If need to optimize try this first
    // useEffect(() => {
    //     if(props.fieldOrder && props.fieldOrder.length > 0 && !didMountRef.current){
    //         didMountRef.current = true;
    //         const formFields = props.fieldOrder.map((key) => {
    //             let el;
    //             if (props.customElements && props.customElements[key]) {
    //                 el = props.customElements[key](formik);
    //                 return <div key={String(key)} className={props.rowClassName}>{el}</div>
    //             }
    //
    //             const label = props.formElements[key].label;
    //             const elProps = props.formElements[key].props;
    //             switch (props.formElements[key].type) {
    //                 case "text": {
    //                     console.log('calling generateTextField')
    //                     //@ts-ignore
    //                     el = generateTextField({field: key, label, props: elProps});
    //                     break;
    //                 }
    //                 case "number": {
    //                     //@ts-ignore
    //                     el = generateNumberField({field: key, label, props: elProps});
    //                     break;
    //                 }
    //                 case "calendar": {
    //                     //@ts-ignore
    //                     el = generateCalendarField({field: key, label, props: elProps});
    //                     break;
    //                 }
    //                 case "dropdown": {
    //                     if(key === "siteId") {
    //                     }
    //                     //@ts-ignore
    //                     el = generateDropdownField({field: key, label, options: props.formElements[key].options, props: {...elProps, filter: true}, selectIfSingle: true, optionValue: props.optionValue, optionLabel: props.optionLabel, button: props.formElements[key].button});
    //                     // el = generateDropdownField(key, label, props.formElements[key].options, elProps, undefined, true);
    //                     break;
    //                 }
    //                 case "multiselect": {
    //                     //@ts-ignore
    //                     el = generateMultiselectField({field: key, label, options: props.formElements[key].options, elProps, optionValue: props.optionValue, optionLabel: props.optionLabel, button: props.formElements[key].button});
    //                     break;
    //                 }
    //                 case "password": {
    //                     //@ts-ignore
    //                     el = generatePasswordField({field: key, label, options: props.formElements[key].options, elProps});
    //                     break;
    //                 }
    //                 default: {
    //                     el = null;
    //                 }
    //             }
    //
    //             return <div key={String(key)} className={props.rowClassName}>{el}</div>
    //         });
    //         setFormFields(formFields);
    //     }
    // }, [props.fieldOrder]);


    const generateForm = useMemo(() => {
        // console.log('DynamicForm: generateForm called');
        //@ts-ignore
        return props.fieldOrder.map((key) => {
            let el;
            if (props.customElements && props.customElements[key]) {
                el = props.customElements[key](formik);
                return <div key={String(key)} className={props.rowClassName || defaultRowClassName}>{el}</div>
            }

            const label = props.formElements[key].label;
            const elProps = {...props.formElements[key].props, disabled: props.formElements[key].props?.disabled || props.readOnly};
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
                    if (key === "siteId") {
                    }
                    //@ts-ignore
                    el = generateDropdownField({field: key, label, options: props.formElements[key].options, props: {...elProps, filter: true}, selectIfSingle:  props.formElements[key].selectIfSingle ?? true, optionValue: props.optionValue, optionLabel: props.optionLabel, button: props.formElements[key].button
                    });
                    // el = generateDropdownField(key, label, props.formElements[key].options, elProps, undefined, true);
                    break;
                }
                case "multiselect": {
                    //@ts-ignore
                    el = generateMultiselectField({field: key, label, options: props.formElements[key].options, props: {...elProps}, optionValue: props.optionValue, optionLabel: props.optionLabel, button: props.formElements[key].button
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

            return <div key={String(key)} className={props.rowClassName || defaultRowClassName}>{el}</div>
        })
    }, [formik.touched, formik.values, props.formElements, props.fieldOrder]);

    const childrenWithFormik = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            //@ts-ignore
            return React.cloneElement(child, {formik});
        }
        return child;
    });

    return <>
        <form ref={(ref) => formRef.current = ref} onSubmit={formik.handleSubmit}
              style={{...props.className, overflow: 'hidden'}} noValidate>
            <div className={props.formGridClassName || defaultFormGridClassName}>
                {generateForm}
                {childrenWithFormik}
            </div>
            {!props.hideButtons &&
                <FormButtons className={props.formButtonsClassName} isUpdate={props.isUpdate} onResetForm={resetForm}
                             saveButtonLabel={props.saveButtonLabel}
                             disableSaveButton={props.disableSaveButton}
                             disableSaveButtonIfErrors={props.disableSaveButtonIfErrors ? Object.keys(formik.errors).length > 0 : false}
                             cancelUpdateButtonLabel={props.cancelUpdateButtonLabel}
                             clearButtonLabel={props.clearButtonLabel}
                             clearButtonOnUpdateLabel={props.clearButtonOnUpdateLabel}
                             updateButtonLabel={props.updateButtonLabel}
                             position={props.formButtonsPosition} onCancelUpdate={props.onCancelUpdate}
                />}
        </form>
    </>
};

// DynamicForm.defaultProps = {
//     rowClassName: primeflexVersion === 2 ? "p-col-12 p-md-4" : 'col-12 md:col-4',
// }
