export const validateOrderQty=(value)=>{
    if (value !== "" && value !== null && Number.isInteger(value) && value >= 0) {
        return true;
    }
    return false
}