export const determineMinLDU=(ldu, inputQnty)=>{
    let minLDU, remainder;
    if (inputQnty > 1) {
        if (inputQnty % ldu === 0) {
            minLDU = inputQnty - ldu;
        } else {
            remainder = Math.floor(inputQnty / ldu);
            minLDU = (remainder * ldu);
        }
    } else if (inputQnty === 1 && ldu === 1) {
        minLDU = 1;
    } else { }
    return minLDU;
}

export const determineMaxLDU=(ldu, inputQnty)=>{
    let maxLDU, remainder;
    if (inputQnty > 1) {
        if (inputQnty % ldu === 0) {
            maxLDU = inputQnty + ldu;
        } else {
            remainder = Math.floor(inputQnty / ldu);
            maxLDU = (remainder * ldu) + ldu;
        }
    } else if (inputQnty === 1 && ldu === 1) {
        maxLDU = inputQnty + 1;
    } else { }
    return maxLDU;
}