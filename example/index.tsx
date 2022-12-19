import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import {UtilService} from "../src/util-service";
import {useFormik} from "formik";
import {DynamicForm} from "../src";
import {FormElementValues} from "../src";
import {IDropdownOption} from "../src/util-service";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import {validationSchema} from "./validation";

const age: FormElementValues<'dropdown'> = {
    type: 'dropdown',
    label: 'age',
    options: [],
}

let name: FormElementValues<'dropdown'> = {
    type: "dropdown",
    label: "name",
    options: [],
    props: {showClear: true}
}

export interface TestCreate {
    name: string;
    age: number;
}

const App = () => {
    const initialValues = {
        age: undefined,
        name: undefined
    }

    const [formElements, setFormElements] = useState({age, name});
    const [selectedAge, setSelectedAge] = useState<number>();
    const [formData, setFormData] = useState({...initialValues});

    useEffect(() => {
        const tempFormElements = {...formElements};
        tempFormElements.age.options =  ageOptions;
        setFormElements(tempFormElements);
    }, []);

    useEffect(() => {
        const tempFormElements = {...formElements};
        if(selectedAge !== undefined){
            tempFormElements.name.options = nameOptions1;
            setFormElements(tempFormElements);
        }else {
            tempFormElements.name.options = [];
            setFormElements(tempFormElements);
        }
    }, [selectedAge]);



    const ageOptions : IDropdownOption[] = [
        {
            key: 1,
            description: '1',
            id: 1
        },
        {
            key: 2,
            description: '2',
            id: 2
        },
    ]

    const nameOptions1 : IDropdownOption[] = [
        {key: 1, description: "asdf", id: 1},
    ]

    const nameOptions2 : IDropdownOption[] = [
        {key: 1, description: "asdf2", id: 1},
    ]

    const options2 : IDropdownOption[] = [
        {
            key: 1,
            kur: '1',
            value: 1
        },
        {
            key: 2,
            kur: 'Kririirausiduuairu asdda',
            value: 2,
        },
        {
            key: 3,
            kur: 'Kririirausiduuairu asdda123123',
            value: 3,
        },
        {
            key: 4,
            kur: 'Kririirausiduuairu asddafkjasdjf',
            value: 4,
        },
        {
            key: 5,
            kur: 'Kririirausiduuairu asdda jaskdj aw8u',
            value: 5,
        },
    ]

    UtilService.setIntlFormatter(({id}) => id);

    const formik = useFormik({
        initialValues,
        onSubmit: (data) => {

        }
    })


    const handleFieldChange = (field: string, value: any) => {
        if(field === "age") setSelectedAge(value);
    }

    const handleFormReset = () => {
        setFormData({...initialValues});
        setSelectedAge(undefined);
    }

    const {generateDropdownField} = UtilService.fieldUtils(formik);

    return (
        <div className={'p-mt-3'}>
                <DynamicForm
                    formElements={formElements}
                    initialValues={formData}
                    fieldOrder={['age', 'name']}
                    onCreate={() => Promise.resolve(true)}
                    onUpdate={() => Promise.resolve(true)}
                    isUpdate={false}
                    onFieldChangeCallback={handleFieldChange}
                    onFormReset={handleFormReset}
                    validationSchema={validationSchema}
                    onCancelUpdate={() => 0} />
            </div>
    )
};

ReactDOM.render(<App/>, document.getElementById('root'));
