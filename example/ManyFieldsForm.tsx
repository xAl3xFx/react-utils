import * as React from 'react';
import {useEffect, useState, useRef} from 'react';
import {DynamicForm, FormElementValues, UtilService} from "../src";
import {validationSchema} from "./validation";
import {PaymentFieldset} from "./PaymentFieldset";
import {CreatePaymentRequest} from "./types";

interface Props {

}

let text : FormElementValues<'text'> = {
    type: 'text',
    label: 'text',
    props: {required: false}
}

let numberOfDeposits: FormElementValues<'number'> = {
    type: "number",
    label: "numberOfDeposits",
}

let totalAmount: FormElementValues<'number'> = {
    type: "number",
    label: "totalAmount",
}

let dropdown: FormElementValues<'dropdown'> = {
    type: "dropdown",
    label: "totalAmountDropdown",
    options: [{id: 1, key: 1, description: 'Тест1'}, {id: 2, key: 2, description: 'Тест2'}],
    props:{optionValue: 'id', optionLabel: 'description', placeholder: 'Choose'}
}

const initialValues  = {
    numberOfDeposits: 20,
    totalAmount: 0,
    payments: [],
    dropdown: 0
}

const initialPayment: CreatePaymentRequest = {
    amount: 0,
    dueDate: new Date(),
    paid: false,
    installmentSequenceNumber: ""
}

const ManyFieldsForm : React.FC<Props> = props => {
    const didMountRef = useRef(false);
    const [formElements, setFormElements] = useState({numberOfDeposits, totalAmount, text, dropdown});
    const [formData, setFormData] = useState({...initialValues});
    UtilService.setIntlFormatter(({id}) => id);
    const formikRef = useRef<any>();

    useEffect(() => {
        if(!didMountRef.current) {
            didMountRef.current = true;
        }
    }, []);

    const addPayments = (value: number) => {
        const payments : any = [];
        const monthPaymentAmount = formikRef.current.values.totalAmount / value;
        for(let i = 0; i < value; i++) {
            const newPayment : any = {...initialPayment};
            newPayment.installmentSequenceNumber = i + 1;
            newPayment.amount = monthPaymentAmount;
            payments.push(newPayment);
        }
        if(formikRef.current)
            formikRef.current.setValues({...formikRef.current.values, payments})
    }

    const handleFieldChange = (field: string, value: any) => {
        if(field === "numberOfDeposits") addPayments(+value);
    }

    return <>
        <div className={''}>
            <DynamicForm
                formElements={formElements}
                initialValues={formData}
                fieldOrder={['text', 'numberOfDeposits', 'totalAmount', 'dropdown']}
                rowClassName={'col-12 md:col-4 mb-3'}
                onCreate={() => Promise.resolve(true)}
                onUpdate={() => Promise.resolve(true)}
                onFieldChangeCallback={handleFieldChange}
                setFormikRef={(formik) => formikRef.current = formik}
                isUpdate={false}
                validationSchema={validationSchema}
                onCancelUpdate={() => 0} >
                <PaymentFieldset legend={'asd'} dataField={'payments'} numberOfPayments={formData.numberOfDeposits} />
            </DynamicForm>
        </div>
    </>
};

export default ManyFieldsForm;
