


export const storeSearchAndSort = (data,value) => {
    // var searchResults = data.filter(function (store) {

    //     if  (store.storeId && store.storeId.toString().toLowerCase().search(value.toLowerCase()) !== -1 )
    //         // (store.storeNickName && store.storeNickName.toString().toLowerCase().search(
    //            // value.toLowerCase()) !== -1 ) ){
    //                 return true
    //            // }
    //             else return false
    //   });

    let searchResults = data.filter(store => (store.storeId && store.storeId.toString().startsWith(value)) || (store.storeNickName && store.storeNickName.toLowerCase().indexOf(value)!==-1))

    searchResults = searchResults.sort(function(a, b){return a.storeId-b.storeId}) // Sort the array first by storeID
    return sortStores(searchResults,value); // Secondary sort is by alphabetical order
    
}

function sortStores (stores, value ){

    return stores.sort(function(a, b) {
         if ( ( a.storeId && a.storeId.toString().toLowerCase().search(value.toLowerCase()) === -1 ) &&  (b.storeId && b.storeId.toString().toLowerCase().search(value.toLowerCase()) === -1 ) && ( a.storeNickName && a.storeNickName.toString().toLowerCase().search(value.toLowerCase()) !== -1 ) &&  (b.storeNickName && b.storeNickName.toString().toLowerCase().search(value.toLowerCase()) !== -1 ) &&   a.storeNickName > b.storeNickName ){
            return 1;
         } 
        else if (( a.storeId && a.storeId.toString().toLowerCase().search(value.toLowerCase()) === -1 ) &&  (b.storeId && b.storeId.toString().toLowerCase().search(value.toLowerCase()) === -1 ) && ( a.storeNickName && a.storeNickName.toString().toLowerCase().search(value.toLowerCase()) !== -1 ) &&  (b.storeNickName && b.storeNickName.toString().toLowerCase().search(value.toLowerCase()) !== -1 ) &&   a.storeNickName < b.storeNickName ){
            return -1;
        } 
        else return 0;
      })


}