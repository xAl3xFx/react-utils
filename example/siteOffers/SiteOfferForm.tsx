import * as React from 'react';
import {ChangeEventHandler, useEffect, useMemo, useRef, useState} from 'react';
import {FieldArrayRenderProps, FormikContextType} from "formik";
import {formElements} from "./site-offer-form";
import {TreeSelectProps} from "primereact/treeselect";
import {TreeNode} from "primereact/treenode";
import {FloatLabel} from "primereact/floatlabel";
import {InputNumber} from "primereact/inputnumber";
import {Checkbox, CheckboxChangeEvent} from "primereact/checkbox";
import {InputText} from "primereact/inputtext";
import {DynamicForm, UtilService} from '../../src';
import DynamicFormArrayHelper from "../Test/DynamicFormArrayHelper";

interface Props {
    isUpdate: boolean;
}

const SiteOfferForm: React.FC<Props> = props => {
    const initialValues: any = {
        validFrom: new Date(),
        validTo: null,
        siteId: 0,
        downtimeAfterFirstHour: 0,
        concreteTruckTransportUnder6M3Price: 22,
        items: [],
        activities: [],
        commonItems: []
    }
    const formikRef = useRef<FormikContextType<any>>();


    const [formData, setFormData] = useState({...initialValues});
    const [formElementsState, setFormElementsState] = useState(formElements);

    useEffect(() => {
        setTimeout(() => {
            setFormData({...initialValues, items: [{name: "test123", measuringUnitName: "test123", priceWithoutTransport: 0, priceWithTransport: 0, includeInExport: true}] });
        }, 2000)
    }, [])

    const getTreeLeafs = (tree: any): TreeNode[] => {
        return (tree.children && tree.children.length > 0) ? tree.children.flatMap(getTreeLeafs) : [tree];
    }

    // const activityTypesDropdownOptions = (allActivityTypes ?? []).map(at => ({
    //     id: at.id,
    //     key: at.id.toString(),
    //     description: at.name
    // }));

    const handleCancelUpdate = () => {
        setFormData({...initialValues});
    }

    const handleFormReset = () => {
        if (!props.isUpdate)
            setFormData({...initialValues});

    }

    const remapActivitiesBeforeSubmit = (data: any) => {
        const remappedActivities = data.activities?.map(activity => {
            //VehicleKinds is an object, which keys look like this: 1-1-1, 1-1, 1, etc. We need only those, which are
            //In this format : 1-1-1. The third digit is the id of the vehicle kind -  we need to build a list from them
            return {
                ...activity,
                //@ts-ignore
                vehicleKindIds: Object.keys(activity.vehicleKindIds)
                    .filter(vk => vk.split("-").length === 3)
                    .map(key => Number(key.split("-")[2]))
            };
        })
        return {...data, activities: remappedActivities}
    }

    const handleCreate = async (data: any) => {
        try {
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    const handleUpdate = async (data: any) => {
        try {
            setFormData({...initialValues});
            return true;
        } catch (e) {
            return false;
        }
    }

    const emptyWarehouseItemRow: any = {
        warehouseItemId: 0,
        name: "",
        measuringUnitName: "",
        priceWithoutTransport: null,
        priceWithTransport: 0,
        includeInExport: true,
    }

    const emptyActivityRow: any = {
        activityTypeId: 0,
        name: "",
        measuringUnitName: "",
        activityToQuantity: 0,
        isFixed: false,
        vehicleKindIds: [],
        price: 0
    }

    const emptyCommonItemRow: any = {
        warehouseItemId: 0,
        name: "",
        measuringUnitName: "",
        price: 0
    }

    const onChangeCallback = (field: string, value: any) => {
        // console.log("Change:", field, value)
        // if (field.split(".")[2] === "activityTypeId") {
        //     console.log("Changing name: ", field, value)
        //     const activityType = allActivityTypes?.find(at => at.id === value);
        //     const index = Number(field.split(".")[1]);
        //     if (formikRef.current && formikRef.current.values.activities && activityType) {
        //         formikRef.current.setFieldValue(`activities.${index}.measuringUnitName`, activityType.measuringUnitName);
        //         formikRef.current.setFieldValue(`activities.${index}.name`, activityType.name);
            // }
        // }
    }


    // const handleWarehouseItemIdSelection = (key: "items" | "commonItems", index: number, value: number) => {
    //
    //
    //     const warehouseItem = allWarehouseItems?.find(at => at.id === value);
    //     if (formikRef.current && formikRef.current.values.items && warehouseItem) {
    //         formikRef.current.setFieldValue(`${key}.${index}.measuringUnitName`, measuringUnitOptions?.find(mu => mu.id === warehouseItem.measuringUnitId)?.description || "");
    //         formikRef.current.setFieldValue(`${key}.${index}.name`, warehouseItem.name);
    //     }
    // }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
    }

    const warehouseItemRow = (key: any, dataField: any) => {
        const warehouseItemId = formikRef.current?.values.items?.[key]?.warehouseItemId;

        const {
            generateNumberField,
            generateTextField
        } = UtilService.fieldUtils(formikRef?.current, onChangeCallback);
        const fieldClass = 'col-12 lg:col';


        const result = [];

        // @ts-ignore
        result.push(...[
            <div key={key + '-name'} className={fieldClass}>{generateTextField({
                field: `${dataField}.${key}.name`,
                props: {},
                label: 'name'
            })}</div>,
            <div key={key + '-measuringUnitName'} className={fieldClass}>{generateTextField({
                field: `${dataField}.${key}.measuringUnitName`,
                props: {},
                label: 'measuringUnitId'
            })}</div>,
            <div key={key + '-priceWithTransport'} className={fieldClass}>{generateNumberField({
                field: `${dataField}.${key}.priceWithTransport`,
                props: {maxFractionDigits: 2, inputMode: "decimal"},
                label: 'priceWithTransport'
            })}</div>,
            <div key={key + '-priceWithoutTransport'} className={fieldClass}>{generateNumberField({
                field: `${dataField}.${key}.priceWithoutTransport`,
                props: {maxFractionDigits: 2, inputMode: "decimal"},
                label: 'priceWithoutTransport'
            })}</div>
        ])

        return result;
    }

    const commonItemRow = (key: any, dataField: any) => {
        const warehouseItemId = formikRef.current?.values.commonItems?.[key]?.warehouseItemId;

        const {
            generateNumberField,
            generateTextField
        } = UtilService.fieldUtils(formikRef?.current, onChangeCallback);
        const fieldClass = 'col-12 lg:col';

        const result = [];

        // @ts-ignore
        result.push(...[
            <div key={key + '-name'} className={fieldClass}>{generateTextField({
                field: `${dataField}.${key}.name`,
                props: {},
                label: 'name'
            })}</div>,
            <div key={key + '-measuringUnitName'} className={fieldClass}>{generateTextField({
                field: `${dataField}.${key}.measuringUnitName`,
                props: {},
                label: 'measuringUnitId'
            })}</div>,
            <div key={key + '-price'} className={fieldClass}>{generateNumberField({
                field: `${dataField}.${key}.price`,
                props: {maxFractionDigits: 2, inputMode: "decimal"},
                label: 'price'
            })}</div>
        ])

        return result;
    }

    const activitiesRow = (key: any, dataField: any) => {
        const {
            generateNumberField,
            generateTextField,
            generateDropdownField,
            generateTreeSelectField
        } = UtilService.fieldUtils(formikRef?.current, onChangeCallback);
        const fieldClass = 'col-12 lg:col';

        const result = [];

        // @ts-ignore
        result.push(...[
            <div className={fieldClass}>{generateDropdownField({
                field: `${dataField}.${key}.activityTypeId`,
                props: {filter: true},
                label: 'activityTypeId',
                options: []
            })}
            </div>,
            <div key={key + '-name'} className={fieldClass}>{generateTextField({
                field: `${dataField}.${key}.name`,
                props: {keyfilter: "num"},
                label: 'name'
            })}</div>,
            <div key={key + '-measuringUnitId'} className={fieldClass}>{generateTextField({
                field: `${dataField}.${key}.measuringUnitName`,
                props: {},
                label: 'measuringUnitId'
            })}</div>,
            <div key={key + '-activityToQuantity'} className={fieldClass}>{generateNumberField({
                field: `${dataField}.${key}.activityToQuantity`,
                props: {maxFractionDigits: 2, inputMode: "decimal"},
                label: 'activityToQuantity'
            })}</div>,
            <div className={fieldClass}>{generateDropdownField({
                field: `${dataField}.${key}.isFixed`,
                props: {},
                label: 'isFixed',
                options: []
            })}
            </div>,
            <div key={key + '-price'} className={fieldClass}>{generateNumberField({
                field: `${dataField}.${key}.price`,
                props: {maxFractionDigits: 2, inputMode: "decimal"},
                label: 'price'
            })}</div>,
            <div key={key + '-measuringUnitName'} className={fieldClass}>{generateTreeSelectField({
                field: `${dataField}.${key}.vehicleKindIds`,
                props: {selectionMode: "checkbox", valueTemplate: treeSelectValueTemplate},
                label: 'vehicleKindIds',
                options: []
            })}</div>,

        ])

        return result;
    }

    const treeSelectValueTemplate = (selectedNodes: TreeNode | TreeNode[], props: TreeSelectProps) => {
        const selectedNodesToArray = Array.isArray(selectedNodes) ? selectedNodes : [selectedNodes];
        const selectedLabels = selectedNodesToArray.filter(node => node.key?.toString().split("-").length === 3);

        let valueToRender = selectedLabels.length > 0 ? selectedLabels.map(node => node.label).join(",") :  "select";

        if (selectedLabels.length > 2) {
            valueToRender = "selectedRecordsCount";
        }

        return <div className="flex align-items-center">
            <div style={{fontSize: "1rem"}}>{valueToRender}</div>
        </div>
    }

    const handleItemDelete = (key: any, arrayHelper: FieldArrayRenderProps) => {
        arrayHelper.remove(key);
    }


    const onFieldChangeCb = (field: string, value: any) => {

    }

    const WrapItemsDynamicFormArrayHelper = (props: any) => {
        return (
            <div className={"p-3 w-full"}>
                <DynamicFormArrayHelper dataField={'items'} fields={warehouseItemRow}
                                        showDeleteButton deleteButtonClassName={'block'}
                                        emptyElement={emptyWarehouseItemRow} formik={props.formik}
                                        legend={'siteOfferConcreteSectionTitle'}
                                        deleteButtonHandler={handleItemDelete}/>
            </div>
        )
    }

    const WrapActivitiesDynamicFormArrayHelper = (props: any) => {
        return (
            <div className={"p-3 w-full"}>
                <DynamicFormArrayHelper dataField={'activities'} fields={activitiesRow}
                                        showDeleteButton deleteButtonClassName={'block'}
                                        emptyElement={emptyActivityRow} formik={props.formik}
                                        legend={'siteOfferTransportSectionTitle'}
                                        deleteButtonHandler={handleItemDelete}/>
            </div>
        )
    }

    const WrapCommonItemsDynamicFormArrayHelper = (props: any) => {
        return (
            <div className={"p-3 w-full"}>
                <DynamicFormArrayHelper dataField={'commonItems'} fields={commonItemRow}
                                        showDeleteButton deleteButtonClassName={'block'}
                                        emptyElement={emptyCommonItemRow} formik={props.formik}
                                        legend={'siteOfferAdditivesSectionTitle'}
                                        deleteButtonHandler={handleItemDelete}/>
            </div>
        )
    }

    const customElements = {
        downtimeAfterFirstHour: (formik: any) => {
            const [, getFormErrorMessage] = UtilService.formikUtils(formik);

            return <>
                <div className="p-inputgroup w-full">
                    <FloatLabel>
                        <InputNumber
                            value={formik.values.downtimeAfterFirstHour}
                            onValueChange={(e) => formik.setFieldValue('downtimeAfterFirstHour', e.value)}
                            mode="decimal"
                            inputMode="decimal"
                            pt={{input: {root: {className: 'border-noround-right'}}}}
                            locale={UtilService.locale}
                            min={0}
                            maxFractionDigits={3}
                            className="w-full"
                        />
                        <label>{'downtimeAfterFirstHour'}</label>
                    </FloatLabel>

                    <span className="p-inputgroup-addon">
                        {"лв./30мин."}
                    </span>
                </div>
                {getFormErrorMessage('downtimeAfterFirstHour')}
            </>
        },
        concreteTruckTransportUnder6M3Price: (formik: any) => {
            const [, getFormErrorMessage] = UtilService.formikUtils(formik);

            return <>
                <div className="p-inputgroup w-full">
                    <FloatLabel>
                        <InputNumber
                            value={formik.values.concreteTruckTransportUnder6M3Price}
                            onValueChange={(e) => formik.setFieldValue('concreteTruckTransportUnder6M3Price', e.value)}
                            mode="decimal"
                            inputMode="decimal"
                            pt={{input: {root: {className: 'border-noround-right'}}}}
                            locale={UtilService.locale}
                            min={0}
                            maxFractionDigits={3}
                            className="w-full"
                        />
                        <label>{'concreteTruckTransportUnder6M3Price'}</label>
                    </FloatLabel>

                    <span className="p-inputgroup-addon">
                        {"лв."}
                    </span>
                </div>
                {getFormErrorMessage('downtimeAfterFirstHour')}
            </>
        },
    }

    return <>
        <DynamicForm
            formElements={formElementsState}
            isUpdate={props.isUpdate}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            customElements={customElements}
            initialValues={formData}
            // validationSchema={validationSchema}
            formButtonsClassName={`col-12 ${props.isUpdate ? "md:col-4" : "md:col-6"} mt-4`}
            setFormikRef={(formik: any) => formikRef.current = formik}
            onFormReset={handleFormReset}
            onFieldChangeCallback={onFieldChangeCb}
            fieldOrder={['siteId', 'validFrom', 'validTo', 'downtimeAfterFirstHour', 'concreteTruckTransportUnder6M3Price']}
            onCancelUpdate={handleCancelUpdate}>

            <WrapItemsDynamicFormArrayHelper/>
            <WrapActivitiesDynamicFormArrayHelper/>
            <WrapCommonItemsDynamicFormArrayHelper/>

        </DynamicForm>
    </>
};

export default SiteOfferForm
