import {FormElementValues, UtilService} from "@xal3xfx/react-utils";

const warehouseItemId: FormElementValues<'dropdown'> = {
    type: "dropdown",
    label: "warehouseItemId",
    props: {},
    options: []
}

const name: FormElementValues<'text'> = {
    type: "text",
    label: "name",
    props: {},
}

const measuringUnitName: FormElementValues<'text'> = {
    type: "text",
    label: "measuringUnitName",
    props: {},
}

const price: FormElementValues<'number'> = {
    type: "number",
    label: "price",
    props: {locale: UtilService.locale, maxFractionDigits: 3, inputMode: "decimal"}
}

export const formElements = {
    warehouseItemId,
    name,
    measuringUnitName,
    price
}