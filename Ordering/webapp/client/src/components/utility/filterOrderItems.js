
export const filterOrderItems = (data) => {
    let Body = []
    data.forEach(item => {
        //if(item && item.untransmittedOrderQty){
            Body.push(item)
       // }
    });
    return Body
}