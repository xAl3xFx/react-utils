// import type { ReactNode } from 'react';
//
// export interface ThingProps {
//   children?: ReactNode;
// }
//
// export const Thing = ({ children }: ThingProps) => {
//   return (
//     <div>
//       {children ?? 'the snozzberries taste like snozzberries'}
//     </div>
//   );
// };

import {DynamicFieldset} from "./DynamicFieldset";
import {DynamicForm, FormElement, FormElementType, FormElementValues} from "./DynamicForm";
import {IDropdownOption, UtilService} from "./util-service";

export {
    UtilService,
    DynamicForm,
    type FormElement,
    type FormElementValues,
    type FormElementType,
    type IDropdownOption,
    DynamicFieldset
}
