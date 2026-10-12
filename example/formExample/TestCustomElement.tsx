import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {DynamicForm, UtilService}  from '../../src';
import {FloatLabel} from "primereact/floatlabel";
import {Checkbox, CheckboxChangeEvent} from "primereact/checkbox";
import {InputNumber} from "primereact/inputnumber";

interface Props {

}

const TestCustomElement: React.FC<Props> = props => {
    const didMountRef = useRef(false);
    const formik = DynamicForm.useDynamicForm()

    const [checkedSpentFuel, setCheckedSpentFuel] = useState(false);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
        }
    }, []);


    const spentFuel = (formik: any) => {
        const [, getFormErrorMessage] = UtilService.formikUtils(formik);
        const field = "spentFuel";

        return <>

            {getFormErrorMessage(field)}
        </>
    }


    return <>
        <div className="p-inputgroup flex-1">
            <FloatLabel>
                <InputNumber useGrouping={false} inputMode={'decimal'}
                             pt={{input: {root: {className: 'border-noround-right'}}}}
                             maxFractionDigits={3} value={formik.values["spentFuel"]} onChange={e => {formik.setFieldValue("spentFuel", e.value);
                }} />
                <label>{"Spent Fuel"}</label>
            </FloatLabel>

            <span className="p-inputgroup-addon p-0">
                    <Checkbox checked={true} tooltipOptions={{position: "top"}}
                              tooltip={checkedSpentFuel ? 'automaticByNorm' : 'manually'}
                              onChange={(e: CheckboxChangeEvent) => {
                                  setCheckedSpentFuel(!!e.checked)
                              }}/>
                </span>
        </div>

    </>

}
export default TestCustomElement;

