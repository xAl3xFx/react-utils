import * as React from 'react';
import {InputText, InputTextProps} from "primereact/inputtext";
import {InputNumber, InputNumberProps} from "primereact/inputnumber";
import {Dropdown, DropdownProps} from "primereact/dropdown";
import {Skeleton} from "primereact/skeleton";
import {MultiSelect, MultiSelectProps} from "primereact/multiselect";
import {Calendar, CalendarProps} from "primereact/calendar";
import moment from "moment-timezone";
import cloneDeep from 'lodash.clonedeep';
import {Password, PasswordProps} from "primereact/password";

interface IDropdownOptionBase {
    key: number | string;
    description?: string;
    id?: number | string | boolean;
}

export type IDropdownOption = IDropdownOptionBase & { [key: string]: any }

const parseNestedObject = (object: any, key: string | number | symbol) => {
    let res = object;

    for (let currentKey of key.toString().split('.')) {
        if (res && res.hasOwnProperty(currentKey))
            res = res[currentKey]
        else
            return null
    }
    return res;
}

const setNestedObject = (object: any, key: string | number | symbol, value: any) => {
    let res = object;
    let tokens = key.toString().split('.');
    for (let i = 0; i < tokens.length; i++) {
        if(res && res.hasOwnProperty(tokens[i])){
            if (i === tokens.length - 1) {
                    res[tokens[i]] = value;
                } else {
                    res = res[tokens[i]];
                }
        }else return undefined
    }
    return object;
}

export interface TextFieldOptions {
    field: string;
    label: string;
    props?: InputTextProps;
}

export interface PasswordFieldProps {
    field: string;
    label: string;
    props?: PasswordProps;
}

export interface DropdownFieldOptions {
    field: string;
    label: string;
    options: IDropdownOption[];
    props?: DropdownProps;
    button?: JSX.Element;
    selectIfSingle?: boolean;
    optionValue?: string;
    optionLabel?: string;
}

export interface MultiselectFieldOptions {
    field: string;
    label: string;
    options: IDropdownOption[];
    props?: MultiSelectProps;
    optionValue?: string;
    optionLabel?: string;
    button?: JSX.Element;
}

export interface NumberFieldOptions {
    field: string;
    label: string;
    props?: InputNumberProps;
}

export interface CalendarFieldProps {
    field: string;
    label: string;
    props?: CalendarProps;
}

interface IFieldUtils {
    generateTextField: (options: TextFieldOptions) => JSX.Element;
    generateDropdownField: (options: DropdownFieldOptions) => JSX.Element;
    generateMultiselectField: (options: MultiselectFieldOptions) => JSX.Element;
    generateNumberField: (options: NumberFieldOptions) => JSX.Element;
    generateCalendarField: (options: CalendarFieldProps) => JSX.Element;
    generatePasswordField: (options: PasswordFieldProps) => JSX.Element;
}


export class UtilService {
    public static intlFormatter: any;
    public static optionValue: string;
    public static optionLabel: string;

    static setIntlFormatter(intlFormatter: any) {
        this.intlFormatter = intlFormatter;
    }

    static setOptionValue(optionValue: string) {
        this.optionValue = optionValue;
    }

    static setOptionLabel(optionLabel: string) {
        this.optionLabel = optionLabel;
    }

    static formikUtils(formik: any): [(name: string) => boolean, (name: string) => boolean | JSX.Element] {

        const isFormFieldValid = (name: string): boolean => !!(parseNestedObject(formik.touched, name) && parseNestedObject(formik.errors, name));

        const getFormErrorMessage = (name: string) => {
            return isFormFieldValid(name) &&
                <small className="p-error" style={{float: "left"}}>{parseNestedObject(formik.errors, name)}</small>;
        };

        return [isFormFieldValid, getFormErrorMessage]
    }

    static fieldUtils(formik: any, onChangeCallback?: (field: string, value: any) => void): IFieldUtils {
        const [_, getFormErrorMessage] = this.formikUtils(formik);

        const generateTextField = (options: TextFieldOptions) => {
            return <>
                <div className="p-field">
                <span className="p-float-label">
                    <InputText {...formik.getFieldProps(options.field)} {...options.props || {}} onChange={e => {
                        if (onChangeCallback) {
                            onChangeCallback(options.field, e.target.value);
                        }
                        formik.handleChange(e);
                    }}/>
                    <label>{this.intlFormatter({id: options.label})}</label>
                </span>
                    {getFormErrorMessage(options.field)}
                </div>
            </>
        }

        const generatePasswordField = (options: PasswordFieldProps) => {
            return <>
                <div className="p-field">
                <span className="p-float-label">
                    <Password onChange={e => {
                        if (onChangeCallback)
                            onChangeCallback(options.field, e.target.value);
                        formik.handleChange(e);
                    }} {...formik.getFieldProps(options.field)} {...options.props || {}}/>
                    <label>{this.intlFormatter({id: options.label})}</label>
                </span>
                    {getFormErrorMessage(options.field)}
                </div>
            </>
        }

        const generateNumberField = (options: NumberFieldOptions) => {
            return <>
                <div className="p-field">
            <span className="p-float-label">
                <InputNumber name={options.field} value={formik.values[options.field]}
                             onValueChange={e => {
                                 if (onChangeCallback)
                                     onChangeCallback(options.field, e.value);
                                 formik.handleChange(e);
                             }} {...options.props || {}}/>
                <label>{this.intlFormatter({id: options.label})}</label>
            </span>
                    {getFormErrorMessage(options.field)}
                </div>
            </>
        }

        const generateDropdownField = (options: DropdownFieldOptions) => {
            if (options.selectIfSingle) {
                const parsedValue = parseNestedObject(formik.values, options.field);
                if (parsedValue !== null && options.options && options.options.length === 1 && parsedValue !== options.options[0][options.optionValue || this.optionValue || 'id']) {
                    const clonedValues = cloneDeep(formik.values);
                    const changedValues = setNestedObject(clonedValues, options.field, options.options[0][options.optionValue || this.optionValue || 'id']);
                    formik.setValues(changedValues);
                    if (onChangeCallback)
                        onChangeCallback(options.field, options.options[0][options.optionValue || this.optionValue || 'id']);
                }
            }
            if (options.button !== undefined) {
                return <>
                    <div className="p-field">
                <span className="p-float-label">
                    <div className="p-inputgroup">
                    <Dropdown name={options.field} optionValue={options.optionValue || this.optionValue || 'id'}
                              optionLabel={options.optionLabel || this.optionLabel || 'description'}
                              options={options.options}
                              value={parseNestedObject(formik.values, options.field)} onChange={e => {
                        if (e.value !== 'SkeletonOption') {
                            if (onChangeCallback)
                                onChangeCallback(options.field, e.value);
                            formik.handleChange(e)
                        }
                    }
                    }
                              itemTemplate={(option: any) => this.skeletonOptionTemplate(option, options.optionLabel)} {...options.props}/>
                        {options.button}
                        <label className={'p-ml-2'}>{this.intlFormatter({id: options.label})}</label>
                    </div>
                </span>
                        {getFormErrorMessage(options.field)}
                    </div>
                </>
            } else {
                return <>
                    <div className="p-field">
                <span className="p-float-label">
                    <Dropdown name={options.field} optionValue={options.optionValue || this.optionValue || 'id'}
                              optionLabel={options.optionLabel || this.optionLabel || 'description'}
                              options={options.options}
                              value={parseNestedObject(formik.values, options.field)} onChange={e => {
                        if (e.value !== 'SkeletonOption') {
                            if (onChangeCallback)
                                onChangeCallback(options.field, e.value)
                            formik.handleChange(e)
                        }
                    }
                    }
                              itemTemplate={(option: any) => this.skeletonOptionTemplate(option, options.optionLabel)} {...options.props}/>
                    <label>{this.intlFormatter({id: options.label})}</label>
                </span>
                        {getFormErrorMessage(options.field)}
                    </div>
                </>
            }

        }

        const generateMultiselectField = (options: MultiselectFieldOptions) => {
            if (options.button !== undefined) {
                return <>
                    <div className="p-field">
                        <span className="p-float-label">
                            <div className="p-inputgroup">
                                <MultiSelect name={options.field}
                                             optionValue={options.optionValue || this.optionValue || 'id'}
                                             optionLabel={options.optionLabel || this.optionLabel || 'description'}
                                             options={options.options}
                                             maxSelectedLabels={3}
                                             value={parseNestedObject(formik.values, options.field)} onChange={e => {
                                    if (e.value !== 'SkeletonOption') {
                                        if (onChangeCallback)
                                            onChangeCallback(options.field, e.value);
                                        formik.handleChange(e)
                                    }
                                }
                                }
                                             itemTemplate={(option: any) => this.skeletonOptionTemplate(option, options.optionLabel)} {...options.props}/>
                                {options.button}
                                <label className={'p-ml-2'}>{this.intlFormatter({id: options.label})}</label>
                            </div>
                        </span>
                        {getFormErrorMessage(options.field)}
                    </div>
                </>
            } else {
                return <>
                    <div className="p-field">
                <span className="p-float-label">
                    <MultiSelect name={options.field} optionValue={options.optionValue || this.optionValue || 'id'}
                                 optionLabel={options.optionLabel || this.optionLabel || 'description'}
                                 options={options.options}
                                 maxSelectedLabels={3}
                                 value={parseNestedObject(formik.values, options.field)} onChange={e => {
                        if (e.value !== 'SkeletonOption') {
                            if (onChangeCallback)
                                onChangeCallback(options.field, e.value);
                            formik.handleChange(e)
                        }
                    }
                    }
                                 itemTemplate={(option: any) => this.skeletonOptionTemplate(option, options.optionLabel)} {...options.props}/>
                    <label>{this.intlFormatter({id: options.label})}</label>
                </span>
                        {getFormErrorMessage(options.field)}
                    </div>
                </>
            }
        }

        const generateCalendarField = (options: CalendarFieldProps) => {
            return <>
                <div className="p-field">
                <span className="p-float-label">
                    <Calendar name={options.field} value={parseNestedObject(formik.values, options.field)}
                              onChange={e => {
                                  if (onChangeCallback)
                                      onChangeCallback(options.field, e.value)
                                  formik.handleChange(e);
                              }} {...options.props} />
                    <label>{this.intlFormatter({id: options.label})}</label>
                </span>
                    {getFormErrorMessage(options.field)}
                </div>
            </>
        }

        return {
            generateTextField,
            generateDropdownField,
            generateNumberField,
            generateMultiselectField,
            generateCalendarField,
            generatePasswordField
        }
    }

    static generateDropdownOptionsFromData<T>(gridData: T[], valueColumn: keyof T, labelColumn: keyof T | string, labelFields?: (keyof T)[]) {
        if (typeof labelColumn === "string" && labelFields) {
            const labelColumnQuestionMarksCount = labelColumn.split('').reduce((acc, el) => {
                if (el === '?')
                    acc++;
                return acc;
            }, 0)
            if (labelColumnQuestionMarksCount !== labelFields?.length)
                throw Error("Question marks count in `labelColumn` does not match `labelFields` length.")
        }

        return gridData.reduce((acc: any, el) => {
            if (acc.some((option: any) => option[this.optionValue || 'id'] === el[valueColumn])) {
                return acc;
            }
            if (labelFields && typeof labelColumn === 'string') {
                let description = labelColumn;
                labelFields.forEach(labelField => {
                    //@ts-ignore
                    description = description.replace('?', parseNestedObject(el, labelField));
                })
                return [...acc, {
                    [this.optionValue || 'id']: el[valueColumn],
                    [this.optionLabel || 'description']: description,
                    key: el[valueColumn]
                }];
            } else {
                return [...acc, {
                    [this.optionValue || 'id']: el[valueColumn],
                    //@ts-ignore
                    [this.optionLabel || 'description']: String(el[labelColumn]),
                    key: el[valueColumn]
                }];
            }

        }, []);
    }

    static initialDropdownOptions = Array.from(Array(5).keys()).map(key => {
        return {
            key: key + 1,
            [UtilService.optionValue || 'id']: 'SkeletonOption',
            [UtilService.optionLabel || 'description']: "SkeletonOption"
        }
    });

    static generateDropdownOptionsFromLis(list: string[]) {
        return list.map(el => {
            return {
                [UtilService.optionValue || 'id']: el,
                [UtilService.optionLabel || 'description']: el,
                key: el
            }
        })
    }

    static skeletonOptionTemplate = (option: any, optionLabel?: string) => {
        if (option[optionLabel || UtilService.optionLabel || 'description'] === 'SkeletonOption') {
            return <Skeleton/>
        } else {
            return <div>{option[optionLabel || UtilService.optionLabel || 'description']}</div>
        }
    }

    static numberWithSpaces = (x: any) => {
        return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    static formatUtcToLocal = (date: string) => {
        return moment.utc(date).tz('Europe/Sofia').format('DD.MM.YYYY HH:mm:ss')
    }

    static getNestedObjectParser = parseNestedObject;

}
