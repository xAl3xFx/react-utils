import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {DynamicForm} from "../src";

interface Props {
    formik?: any;
    formElements: any;
    formData: any;
}

export const NestedForm: React.FC<Props> = props => {

    return <>
        <DynamicForm formElements={props.formElements} isUpdate={false} onCreate={async () => false} hideButtons formik={props.formik}
                     onUpdate={async () => false} initialValues={props.formData} fieldOrder={['numberOfDeposits', 'totalAmount',]}
                     onCancelUpdate={() => 0}/>
    </>
};

