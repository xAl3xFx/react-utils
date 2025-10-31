import {FormElementValues, UtilService} from "@xal3xfx/react-utils";

const validFrom: FormElementValues<'calendar'> = {
    type: "calendar",
    label: "validFrom",
    props: {showIcon: true},
}

const validTo: FormElementValues<'calendar'> = {
    type: "calendar",
    label: "validTo",
    props: {showIcon: true, showButtonBar: true},
}

const siteId: FormElementValues<'dropdown'> = {
    type: "dropdown",
    label: "siteId",
    props: {},
    options: []
}

const downtimeAfterFirstHour: FormElementValues<'number'> = {
    type: "number",
    label: "downtimeAfterFirstHour",
    props: {}
}

export const formElements = {
    siteId,
    validFrom,
    validTo,
    downtimeAfterFirstHour
}
