
import { storeDetails } from '../../lib/storeDetails';

export const validateRolesAndReadOnlyView = () =>{
    const { readOnly } = storeDetails();
    /**To DO: validate for different roles */

    return readOnly;
}


