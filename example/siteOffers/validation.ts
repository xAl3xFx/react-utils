import * as yup from "yup";
import {
    CreateSiteOfferCommand,
    SiteOfferActivityRequest,
    SiteOfferCommonItemRequest,
    SiteOfferItemRequest
} from "../../../lib/services/warehouses-service";
import vehicleKinds from "../../core/nomenclatures/vehiclesKinds/VehicleKinds";


const siteOfferActivity: yup.ObjectSchema<Omit<SiteOfferActivityRequest, "vehicleKindIds">> = yup.object({
    activityTypeId: yup.number().required().positive(),
    name: yup.string().required(),
    measuringUnitName: yup.string().required(),
    activityToQuantity: yup.number().required(),
    isFixed: yup.boolean().required(),
    price: yup.number().required().positive(),
})


const siteOfferItem: yup.ObjectSchema<SiteOfferItemRequest> = yup.object({
    warehouseItemId: yup.number().required().positive(),
    name: yup.string().required(),
    measuringUnitName: yup.string().required(),
    priceWithTransport: yup.number().positive().required(),
    priceWithoutTransport: yup.number().nullable().optional(),
    includeInExport: yup.boolean().required()
});

const siteOfferCommonItem: yup.ObjectSchema<SiteOfferCommonItemRequest> = yup.object({
    warehouseItemId: yup.number().required().positive(),
    name: yup.string().required(),
    measuringUnitName: yup.string().required(),
    price: yup.number().positive().required()
});

export const validationSchema: yup.ObjectSchema<CreateSiteOfferCommand> = yup.object({
    siteId: yup.number().required(),
    validFrom: yup.date().required(),
    validTo: yup.date().nullable().optional(),
    downtimeAfterFirstHour: yup.number().required(),
    items: yup.array().of(siteOfferItem).required(),
    concreteTruckTransportUnder6M3Price: yup.number().required(),
    activities: yup.array().of(siteOfferActivity).required(),
    commonItems: yup.array().of(siteOfferCommonItem).required(),
});
