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

const App = () => {
    const initialValues = {
        age: []
    }

    const options : IDropdownOption[] = [
        {
            key: 1,
            label: '1',
            value: 1
        },
        {
            value: 2,
            label: '2',
            key: 2
        },
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

    UtilService.setIntlFormatter(() => 0)
    UtilService.setOptionValue('value')
    UtilService.setOptionLabel('label')

    const formik = useFormik({
        initialValues,
        onSubmit: (data) => {

        }
    })

    const age: FormElementValues<'multiselect'> = {
        type: 'multiselect',
        label: 'age',
        options: options2,
        button: <Button icon={'pi pi-plus'} />
    }

    const {generateDropdownField} = UtilService.fieldUtils(formik);
    const formElements = {
        age
    }
    return (
        <div className={'p-mt-3'}>
            <div style={{width: '20vw'}}>
                <DynamicForm formElements={formElements} initialValues={initialValues} fieldOrder={['age']}
                             optionLabel={'kur'}
                             onCreate={() => Promise.resolve(true)} onUpdate={() => Promise.resolve(true)} isUpdate={false}
                             onCancelUpdate={() => 0}></DynamicForm>
            </div>
            {/*{generateDropdownField({field: 'person.age', label: 'age', options, selectIfSingle: true})}*/}
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
