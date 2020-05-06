
import _ from 'lodash';
export const PAGE_ORIENTATION = {
    LANDSCAPE: 'landscape',
    PORTRAIT: 'portrait'
}

export const PAGE_SIZE = {
    A4: 'A4',
    A3: 'A3',
    A2: 'A2'
}

export const TEXT_TYPES = {
    DATE: 'date',
    NUMBER: 'number'
}

export const getMargin = (props = {}) => {
    let isMargingSet = false;
    ['marginLeft', 'marginRight', 'marginTop', 'marginBottom'].forEach(prop => {
        if (_.has(props, prop)) {
            isMargingSet = true;
        }
    });
    if (isMargingSet) {
        return [
            Number.parseInt(props.marginLeft) || 0,
            Number.parseInt(props.marginTop) || 0,
            Number.parseInt(props.marginRight) || 0,
            Number.parseInt(props.marginBottom) || 0
        ]
    } else {
        return [0, 0, 0, 0]
    }
}
