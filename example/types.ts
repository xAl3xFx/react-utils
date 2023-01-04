interface IDropdownOptionBase {
    key: number | string;
    description?: string;
    id?: number | string | boolean;
}
export declare type IDropdownOption = IDropdownOptionBase & {
    [key: string]: any;
};
export interface CreateContactPersonRequest {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
}

export interface CreatePaymentRequest {
    /** @format int32 */
    liabilityId?: number;
    dueDate: DateOnly;
    /** @format double */
    amount: number;
    /** @format int32 */
    installmentSequenceNumber: string;
    paid: boolean;
}
