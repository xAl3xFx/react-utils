import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import {UtilService} from "../src/util-service";
import {useFormik} from "formik";

const App = () => {
    const initialValues = {
        person:{
            age: 0
        }
    }

    const options = [
        {
            id: 1,
            description: '10',
            key: 1
        },
    ]

    UtilService.setIntlFormatter(() => 0)

    const formik = useFormik({
        initialValues,
        onSubmit: (data) => {

        }
    })

    const {generateDropdownField} = UtilService.fieldUtils(formik);
  return (
    <div>
        {generateDropdownField({field: 'person.age', label: 'age', options, selectIfSingle: true})}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
