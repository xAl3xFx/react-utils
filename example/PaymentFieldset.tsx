import * as React from 'react';
import {useEffect, useState, useRef} from 'react';
import {Fieldset} from "primereact/fieldset";
import {FieldArray, FieldArrayRenderProps, FormikProvider} from "formik";
import {Message} from "primereact/message";
import {CreateContactPersonRequest, IDropdownOption} from "./types";
import {DynamicForm, FormElementValues, UtilService} from "../src";

interface Props {
    legend: string;
    formik?: any;
    dataField: string;
    numberOfPayments: number;
}

export const PaymentFieldset: React.FC<Props> = props => {
    const didMountRef = useRef(false);

    UtilService.setIntlFormatter(({id}) => id);
    const {
        generateTextField,
        generateCalendarField,
        generateDropdownField,
        generateNumberField
    } = UtilService.fieldUtils(props.formik);

    const payedOptions: IDropdownOption[] = [
        {id: false, key: 1, description: "Не"},
        {id: true, key: 1, description: "Да"},
    ]

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
        }
    }, []);

    const generatePaymentItem = (contactPerson: CreateContactPersonRequest, key: number, arrayHelper: FieldArrayRenderProps) => {
        const dueDate: FormElementValues<'calendar'> = {
            type: "calendar",
            label: "dueDate",
        }

        const amount: FormElementValues<'number'> = {
            type: "number",
            label: "amount",
        }
        const paid: FormElementValues<'dropdown'> = {
            type: "dropdown",
            label: "paid",
            options: payedOptions
        }

        return <DynamicForm fieldOrder={['dueDate', 'amount', 'paid']} onCancelUpdate={() => 0}
                            onCreate={() => Promise.resolve(true)}
                            initialValues={{dueDate: undefined, amount: 0, paid: 0}} onUpdate={() => Promise.resolve(true)} isUpdate={false}
                            formElements={{dueDate, amount, paid}}/>
    }

    const fieldsetLegend = (arrayHelper: FieldArrayRenderProps) => <div className={'p-d-flex p-ai-center'}>
        <h2>{props.legend}</h2>
    </div>

    return <>
        <FormikProvider value={props.formik}>
            <FieldArray name={props.dataField}
                        render={(arrayHelper) =>
                            <Fieldset legend={fieldsetLegend(arrayHelper)} className={'p-col-12'}
                                      style={{margin: '1rem'}}>
                                {(props.formik.values[props.dataField]?.map((contactPerson: CreateContactPersonRequest, i: number) => generatePaymentItem(contactPerson, i, arrayHelper)))}
                                {props.formik.errors[props.dataField] ?
                                    <Message severity="error"
                                             text={`грешка ${props.formik.values.payments.reduce((acc: any, el: any) => acc + +el.amount, 0)}/${props.formik.values.totalAmount}`}
                                    />
                                    : null}
                            </Fieldset>
                        }/>
        </FormikProvider>
    </>
};
