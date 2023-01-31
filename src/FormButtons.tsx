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
    disableSaveButton?: boolean;
    disableSaveButtonIfErrors?: boolean;

}

export const FormButtons: React.FC<Props> = props => {
    const f = UtilService.intlFormatter;

    const [primeflexVersion, setPrimeflexVersion] = useState(UtilService.primeflexVersion);

    const defaultClassName = (primeflexVersion === 2 ? "p-col-12 p-md-3 p-lg-3 p-xl-2" : 'col-12 md:col-3 lg:col-3 xl:col-2');
    const wrapperClassName = (primeflexVersion === 2 ? `p-fluid p-grid p-justify-${props.position || "center"}` : `p-fluid grid justify-content-${props.position || "center"}`);


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

    useEffect(() => {
        if(!primeflexVersion) throw new Error("Unspecified primeflex version!");
    }, [primeflexVersion]);

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
        <div className={wrapperClassName}>
            <div className={props.className || defaultClassName}>
                <Button type={'submit'} label={getSubmitButtonLabel()} disabled={props.disableSaveButton || props.disableSaveButtonIfErrors}/>
            </div>
            <div className={props.className || defaultClassName}>
                <Button type="button" onClick={props.onResetForm} label={getResetButtonLabel()}/>
            </div>

            {
                props.isUpdate &&
                <div className={props.className || defaultClassName}>
                    <Button type="button" onClick={props.onCancelUpdate} label={props.cancelUpdateButtonLabel || f({id: "cancelChange"})}/>
                </div>
            }

        </div>
    </>
};

FormButtons.defaultProps = {
    position: "center",
}
