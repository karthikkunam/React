
import { IMAGE_KEY } from '../../constants/ActionTypes';
const DEFAULT_IMAGE = 'https://das-7-eleven.azureedge.net/thumbnail/No_Image_Available.JPG';

export const imageAvailabilityCheck = (Item) => {
    //console.log(Item.thumbnail, IMAGE_KEY, `https://das-7-eleven.azureedge.net/thumbnail/No_Image_Available.JPG?${IMAGE_KEY}`, `${Item.thumbnail}?${IMAGE_KEY}`);
    if(Item.thumbnail === null || Item.thumbnail === '' || typeof(Item.thumbnail) === 'undefined'){
        return `${DEFAULT_IMAGE}?${IMAGE_KEY}`
    }else{
        return `${Item.thumbnail}?${IMAGE_KEY}`
    }
}