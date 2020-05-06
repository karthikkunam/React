export const formatCurrency=(price, currency = '$')=>{
    // const formatter = new Intl.NumberFormat('en-US', {
    //     style: 'currency',
    //     currency: 'USD',
    //   });
    //return formatter.format(price);

    //Added for v40 compatibility
    if(price !== "" && price !== null && typeof(price) != 'undefined'){
      return currency + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }else{
      return ''
    }
}