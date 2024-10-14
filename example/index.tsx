import 'react-app-polyfill/ie11';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import 'primeflex/primeflex.css';
import {UtilService} from "../src";
import {useFormik} from "formik";
import {FormElementValues} from "../src";
import {IDropdownOption} from "../src/util-service";
import {useEffect, useState} from "react";
const ManyFieldsForm = React.lazy(() => import("./ManyFieldsForm"))
export interface TestCreate {
    age: number;
    name?: string;
}

const age: FormElementValues<'dropdown'> = {
    type: 'dropdown',
    label: 'age',
    options: [],
}

let name: FormElementValues<'text'> = {
    type: "text",
    label: "name",
}

const initialValues = {
    age: undefined,
    name: ""
}


UtilService.setIntlFormatter(({id}) => id);
UtilService.setPrimeflexVersion(3);

const App = () => {
    const [formElements, setFormElements] = useState({age, name});
    const [selectedAge, setSelectedAge] = useState<number>();
    const [formData, setFormData] = useState({...initialValues});

    useEffect(() => {
        const tempFormElements = {...formElements};
        tempFormElements.age.options =  ageOptions;
        setFormElements(tempFormElements);
    }, []);

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

    return <React.Suspense fallback={<></>}><ManyFieldsForm /></React.Suspense>
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>

)

