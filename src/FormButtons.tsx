import React, {useEffect, useState, useRef} from 'react';
import {Button} from "primereact/button";
import {UtilService} from "./util-service";

export type FormButtonsPosition = "start" | "center" | "end"

interface Props {
    isUpdate: boolean;
    onResetForm: () => void;
    position?: FormButtonsPosition;
    onCancelUpdate: () => void;
    className?: string;
    saveButtonLabel?: string;
    updateButtonLabel?: string;
    cancelUpdateButtonLabel?: string;
    clearButtonLabel?: string;

}

export const FormButtons: React.FC<Props> = props => {
    const f = UtilService.intlFormatter;
    const getSubmitButtonLabel = () => {
        if(props.isUpdate){
            if(props.updateButtonLabel){
                return props.updateButtonLabel;
            }else{
                return f({id: 'update'});
            }
        }else{
            if(props.saveButtonLabel){
                return props.saveButtonLabel;
            }else{
                return f({id: 'save'});
            }
        }
    }

    const getResetButtonLabel = () => {
        if(props.isUpdate){
            return f({id: 'initialValues'});
        }else{
            if(props.clearButtonLabel){
                return props.clearButtonLabel;
            }else{
                return f({id: 'reset'});
            }
        }
    }

    return <>
        <div className={`p-grid p-justify-${props.position} p-fluid`}>
            <div className={props.className}>
                <Button type={'submit'} label={getSubmitButtonLabel()}/>
            </div>
            <div className={props.className}>
                <Button type="reset" onClick={props.onResetForm} label={getResetButtonLabel()}/>
            </div>

            {
                props.isUpdate &&
                <div className={props.className}>
                    <Button type="button" onClick={props.onCancelUpdate} label={props.cancelUpdateButtonLabel || f({id: "cancelChange"})}/>
                </div>
            }

        </div>
    </>
};

FormButtons.defaultProps = {
    position: "center",
    className: 'p-col-12 p-md-3 p-lg-3 p-xl-2'
}
