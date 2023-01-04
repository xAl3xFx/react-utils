import * as React from 'react';
import {useEffect, useState, useRef, useMemo} from 'react';
import {UtilService} from "./util-service";

interface Props {
    data: any;
    fieldOrder: string[];
    formik: any;
    onFieldChangeCallback?: (field: string, value: any) => void;
    formElements: any;
    customElements: any;
    rowClassName: string;
    optionValue?: string;
    optionLabel?: string;
}

export const DynamicFieldset: React.FC<Props> = props => {
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
        //@ts-ignore
        return props.fieldOrder.map((key) => {
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
                        //@ts-ignore
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
    }, [props.formik.touched, props.formik.values, props.formElements, props.fieldOrder]);


    return <>
        <div className={'p-grid p-fluid p-mt-3 p-p-1'}>
            {generateForm}
        </div>
    </>
};
