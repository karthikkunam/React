import _ from 'lodash';
import * as moment from 'moment';
import {PDFComponent} from './PDFComponent';      
import {getMargin, TEXT_TYPES} from './common';

export class PDFText extends PDFComponent {
    buildDefinition() {
        const definition = _.pick(this.props, [
            'width',
            'bold',
            'fontSize',
            'fillColor',
            'lineHeight',
            'alignment',
            'type',
            'format', 
            "colSpan", 
            "color"
        ]);

        ['fontSize', 'lineHeight'].forEach( prop => { 
            if(definition.hasOwnProperty(prop)){ 
                definition[prop] = parseFloat(definition[prop]); 
            }
        });

        ['colSpan'].forEach( prop => { 
            if(definition.hasOwnProperty(prop)){ 
                definition[prop] = parseInt(definition[prop]); 
            }
        });

        let text = this.props.children || this.props.text || this.text;
        if (text) {
            if (definition.type && definition.type === TEXT_TYPES.DATE) {
                let dateValue = moment.tz(text, definition.timeZone);
                if (definition.format) {
                    text = dateValue.format(definition.format);
                } else {
                    text = dateValue.format('YYYY-MM-DD');
                }
            }
        }
        definition.text = text || "";
        definition.margin = getMargin(this.props);
        this.definition = definition;
        return definition;
    }
}