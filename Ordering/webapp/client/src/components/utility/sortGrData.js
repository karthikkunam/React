import _ from 'lodash';

export const sortGrData = (grData, descriptionFlag, statusFlag, onOrderFlag, balanceOnHandFlag, quantityFlag) => {
    let data;
    if( descriptionFlag === 0 || descriptionFlag === 2 ){
        data =  _.orderBy(grData, ['name'], ['asc']);
    } else {
        data =  _.orderBy(grData, ['name'], ['desc']);
    }

    if( onOrderFlag === 1 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['onOrder'], ['asc']);
    } else if ( onOrderFlag === 2 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['onOrder'], ['desc']);
    }

    
    if( balanceOnHandFlag === 1 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['totalBalanceOnHandQty'], ['asc']);
    } else if ( balanceOnHandFlag === 2 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['totalBalanceOnHandQty'], ['desc']);
    }

    if( quantityFlag === 1 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['untransmittedOrderQty'], ['asc']);
    } else if ( quantityFlag === 2 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['untransmittedOrderQty'], ['desc']);
    }

    if( statusFlag === 1 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['orderChangeStatus'], ['asc']);
    } else if ( statusFlag === 2 ) {
        const itemArray = constructArray(grData);
        data =  _.orderBy(itemArray, ['orderChangeStatus'], ['desc']);
    }
    return data;

}

function constructArray(data){
    let itemArray = [];
    data && data.length > 0 && data.forEach(cat => {
        cat && cat.items && cat.items.forEach(item =>{
            itemArray.push(item);
        })
    });
    return itemArray;
}


export const customizedgrData = (data) => {
    let catArray = [];
    data && data.length > 0 && data.forEach(cat => {
        cat && cat.categories && cat.categories.forEach(category =>{
            let demoItems = [];
            if(category.items && category.items.length > 0){
                for(let i=0;i<5;i++){
                    if(category.items[i] && category.items[i].orderChangeStatus){
                        let finalData = getGRItemStatus(category.items[i]);
                        delete category.items[i].orderChangeStatus;
                        category.items[i] = {
                            ...category.items[i],
                            orderChangeStatus: finalData,
                        }
                    }
                    demoItems.push(category.items[i]);
                }
            }
            delete category.items;
            category = {
                ...category,
                items: sortItems(demoItems),
            }

            catArray.push(category);
        })
    });
    return catArray;
}

function getGRItemStatus (Item){
    if (parseInt(Item.untransmittedOrderQty) >= 0 ||
        Item.isUserModifiedItemForecastQty === 'T') {
        return "Approved"
    } else if (Item.orderChangeStatus === "Recieved") {
        return "Approved"
    } else {
        return "Pending Approval"
    }
}

function sortItems (items){
    return items.sort(function(a, b) {
        if (a.itemName && b.itemName && a.itemName.toUpperCase() < b.itemName.toUpperCase()) {
        return -1;
        }
        if (a.itemName && b.itemName && a.itemName.toUpperCase() > b.itemName.toUpperCase()) {
        return 1;
        }
    
        // names must be equal
        return 0;
    })
}