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

const initialValues  = {
    numberOfDeposits: 20,
    totalAmount: 0,
    payments: []
}

const initialPayment: CreatePaymentRequest = {
    amount: 0,
    dueDate: new Date(),
    paid: false,
    installmentSequenceNumber: ""
}

const ManyFieldsForm : React.FC<Props> = props => {
    const didMountRef = useRef(false);
    const [formElements, setFormElements] = useState({numberOfDeposits, totalAmount, text});
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

    console.log(UtilService.getYesNoOptions())

    return <>
        <div className={''}>
            <DynamicForm
                formElements={formElements}
                initialValues={formData}
                fieldOrder={['text', 'numberOfDeposits', 'totalAmount']}
                rowClassName={'mt-4'}
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
