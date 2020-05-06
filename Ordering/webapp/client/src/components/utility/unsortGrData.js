import _ from 'lodash';

export const unsortGrData = (originalData, grItem) => {
    let data = [];
     originalData && originalData.length > 0 && originalData.forEach(cat => {
        cat.items = _.map(cat.items, function(item) {
            return item.itemId === grItem.itemId ? grItem : item;
          });
          data.push(cat)
      });
    return data;
}

