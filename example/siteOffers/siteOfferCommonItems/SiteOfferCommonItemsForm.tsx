import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {formElements} from "./site-offer-common-items-form";
import {DynamicForm} from "../../../src";

interface Props {
    selectedSiteOfferCommonItemId: number | undefined;
    onCreate: () => void;
    onUpdate: () => void;
    onCancel: () => void;
}

const initialValues: any= {
    warehouseItemId: 0,
    name: "",
    measuringUnitName: "",
    price: 0
}

const SiteOfferCommonItemsForm: React.FC<Props> = props => {
    const formikRef = useRef<any>();

    const [selectedWarehouseItemId, setSelectedWarehouseItemId] = useState<number>();



    const [formData, setFormData] = useState({...initialValues});
    const [formElementsState, setFormElementsState] = useState(formElements);


    const isUpdate = props.selectedSiteOfferCommonItemId !== undefined;


    const handleCancelUpdate = () => {
        props.onCancel();
        setFormData({...initialValues});
    }

    const handleFormReset = () => {
        setFormData({...initialValues});
    }

    const handleCreate = async (data: any) => {
        try {
            props.onCreate();
            return true;
        } catch (e) {
            return false;
        }
    }

    const handleUpdate = async (data: any) => {
        try {
            props.onUpdate();
            setFormData({...initialValues});
            return true
        } catch (e) {
            return false;
        }
    }

    const fieldChangeCb = (field: string, value: any) => {
        if (field === "warehouseItemId") {
            setSelectedWarehouseItemId(value ? value : undefined);
        }


    }

    return <>
        <DynamicForm initialValues={formData} onFormReset={handleFormReset} onCreate={handleCreate}
                     onUpdate={handleUpdate} isUpdate={isUpdate} onCancelUpdate={handleCancelUpdate}
                     fieldOrder={['warehouseItemId', 'name', 'measuringUnitName', 'price']}
                     rowClassName={'col-12 md:col-4 mb-3'}
                     scrollToForm={false}
                     onFieldChangeCallback={fieldChangeCb}
                     formButtonsClassName={"col-12 md:col-4"}
                     formElements={formElementsState}
                     setFormikRef={(formik: any) => formikRef.current = formik}
        />


    </>
};

export default SiteOfferCommonItemsForm;
