import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {DynamicForm_deprecated} from "../src/deprecated/DynamicForm_deprecated";

interface Props {
    formik?: any;
    formElements: any;
    formData: any;
}

export const NestedForm: React.FC<Props> = props => {

    return <>
        <DynamicForm_deprecated formElements={props.formElements} isUpdate={false} onCreate={async () => false} hideButtons formik={props.formik}
                                onUpdate={async () => false} initialValues={props.formData} fieldOrder={['numberOfDeposits', 'totalAmount',]}
                                onCancelUpdate={() => 0}/>
    </>
};

