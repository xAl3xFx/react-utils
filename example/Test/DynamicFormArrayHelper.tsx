import * as React from 'react';
import {useEffect, useRef} from 'react';
import {FieldArray, FieldArrayRenderProps, FormikProvider} from "formik";
// import '../styles/dynamic-array.css'
import {Button} from "primereact/button";
import {Fieldset} from "primereact/fieldset";
import {UtilService} from "../../src";

interface Props {
    formik?: any;
    dataField: string;
    legend: string;
    fields: (key: any, parentKey: string) => React.ReactNode[];
    deleteButtonIndex?: number;
    children?: React.ReactNode | React.ReactNode[];
    parentKey?: string;
    addButtonLabel?: string;
    emptyElement: any;
    disableAddButton?: boolean;
    hideAddButton?: boolean;
    showDeleteButton?: boolean;
    deleteButtonLabel?: (key: number) => string;
    deleteButtonHandler?: (key: number, arrayHelper: FieldArrayRenderProps, parentKey?: string) => void;
    deleteButtonClassName?: string;
    additionalItems?: (formik: any, field: string) => JSX.Element
    disableDeleteButton?: boolean | ((index: number) => boolean);
    fieldsetLegendTemplate?: React.ReactNode;
}

const DynamicFormArrayHelper: React.FC<Props> = props => {
    const didMountRef = useRef(false);

    const field = props.parentKey ? `${props.parentKey}.${props.dataField}` : props.dataField;

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
        }
    }, []);


    const handleDeleteButtonClick = (key: number, arrayHelper: FieldArrayRenderProps) => {
        if (props.deleteButtonHandler) {
            props.deleteButtonHandler(key, arrayHelper, props.parentKey);
        } else {
            arrayHelper.remove(key);
        }
    }


    const generateItem = (element: any, index: number, arrayHelper: FieldArrayRenderProps) => {
        const fields = props.fields(index, field);
        const uniqueKey = props.dataField + "." + (element.id || index);

        const isDeleteButtonDisabled = typeof props.disableDeleteButton === 'function'
            ? props.disableDeleteButton(index)
            : props.disableDeleteButton;

        if (props.showDeleteButton) {
            return <div key={uniqueKey} className={'p-grid flex flex-wrap col-12 gap-2'}>
                {fields}

                <div key={uniqueKey + '.remove'}
                     className={props.deleteButtonClassName || 'col-12 md:col-2'}>
                    <Button
                        disabled={isDeleteButtonDisabled}
                        onClick={() => handleDeleteButtonClick(index, arrayHelper)} type={"button"}
                        icon={'pi pi-times'}
                        severity={"danger"}
                        label={props.deleteButtonLabel ? props.deleteButtonLabel(index) : undefined}/>
                </div>

                <div key={uniqueKey + ".children"}
                     className={' col-12 p-0 flex justify-content-end'}>
                    <div className={"col-11 p-0 flex justify-content-start"}>
                        {props.children ? renderChildrenWithFormik(index) : <></>}
                    </div>
                </div>

            </div>
        } else {
            return <div key={uniqueKey} className={'p-grid flex flex-wrap col-12 gap-2'}>
                {fields}
                <div className={' col-12 p-0 flex justify-content-end'}>
                    <div className={"col-11 p-0 flex justify-content-start"}>
                        {props.children ? renderChildrenWithFormik(index) : <></>}
                    </div>
                </div>
            </div>
        }
    }

    const addItem = (arrayHelper: FieldArrayRenderProps) => {
        arrayHelper.push(props.emptyElement)
    }

    const renderChildrenWithFormik = (index: number) => {
        if (!props.children) return;

        if (Array.isArray(props.children)) {
            return props.children.map(child => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, {
                        // @ts-ignore
                        formik: props.formik,
                        parentKey: props.parentKey ? `${props.parentKey}.${props.dataField}.${index}` : `${props.dataField}.${index}`
                    });
                }
            })
        } else if (React.isValidElement(props.children)) {
            // @ts-ignore
            return React.cloneElement(props.children, {
                // @ts-ignore
                formik: props.formik,
                parentKey: props.parentKey ? `${props.parentKey}.${props.dataField}.${index}` : `${props.dataField}.${index}`
            });
        }
    }

    const getAddButton = (arrayHelper: FieldArrayRenderProps) => {
        if (props.hideAddButton) return null;
        return <div className={"p-grid flex"}>
            <div className={`${props.fieldsetLegendTemplate !== undefined ? 'ml-2' : 'ml-3'} flex gap-2`}>
                {props.fieldsetLegendTemplate}
                <Button icon={'pi pi-plus'} label={props.addButtonLabel ? props.addButtonLabel : undefined}
                        disabled={props.disableAddButton}
                        onClick={() => addItem(arrayHelper)} type={"button"}/>
            </div>
        </div>
    }

    if(!props.formik) return null;

    return <>
        <FormikProvider value={props.formik}>
            <FieldArray name={field}
                        render={(arrayHelper) =>
                            <Fieldset legend={<div
                                className={'flex justify-content-center align-items-center'}>{props.legend}{getAddButton(arrayHelper)}</div>}
                                      pt={{content: {className: "px-0 py-2 mx-2"}}}
                                      className={'w-full mx-1'}>
                                <div className={"w-full flex flex-column gap-4 flex-wrap"}>
                                    {
                                        (UtilService.getNestedObjectParser(props.formik.values, field))?.map((element: any, i: number) => generateItem(element, i, arrayHelper))
                                    }


                                </div>
                            </Fieldset>


                        }/>

        </FormikProvider>


    </>
};

export default DynamicFormArrayHelper
