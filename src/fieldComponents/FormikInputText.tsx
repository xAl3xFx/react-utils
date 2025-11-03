// FormikInputText.tsx
import React, { useMemo, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import { InputText } from "primereact/inputtext";
import debounce from "lodash.debounce";
import {TextFieldOptions} from "../util-service";

interface FormikInputTextProps extends TextFieldOptions {
    name: string;
    label: string;
    required?: boolean;
    debounceDelay?: number;
    onValueChange?: (field: string, value: any) => void;
}

export const FormikInputText: React.FC<FormikInputTextProps> = ({
                                                                    name,
                                                                    label,
                                                                    required,
                                                                    debounceDelay = 200,
                                                                    onValueChange,
                                                                    ...props
                                                                }) => {
    const [field, meta, helpers] = useField(name);
    const { setFieldValue } = useFormikContext<any>();

    // ✅ Create a debounced handler for external callbacks (if any)
    const debouncedValueChange = useMemo(() => {
        if (!onValueChange) return undefined;
        return debounce((field: string, value: any) => {
            onValueChange(field, value);
        }, debounceDelay);
    }, [onValueChange, debounceDelay]);

    // ✅ Clean up debounce on unmount
    useEffect(() => {
        return () => debouncedValueChange?.cancel();
    }, [debouncedValueChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFieldValue(name, value);
        if (debouncedValueChange) {
            debouncedValueChange(name, value);
        }
    };

    const showError = meta.touched && meta.error;

    return (
        <div className="p-field">
      <span className="p-float-label">
        <InputText
            id={name}
            {...field}
            value={field.value ?? ""}
            onChange={handleChange}
            {...props}
        />
          {label && (
              <label htmlFor={name}>
                  {required && <span className="required-label">*</span>}
                  {label}
              </label>
          )}
      </span>
            {showError && <small className="p-error">{meta.error}</small>}
        </div>
    );
};
