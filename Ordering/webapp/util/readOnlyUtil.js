
export const readOnlyUtil = (decodedAuthPayload) =>{
    const {
        store: {
            user: {
                roles
            }
        },
        readOnly
    } = decodedAuthPayload;

    /**To DO: validate for different roles */

    return readOnly;
}


