import _ from 'lodash';
import {PDFComponent} from './PDFComponent';
import {getMargin} from './common';

export class PDFImage extends PDFComponent {
    buildDefinition() {
        const definition = _.pick(this.props, [
            'width',
            'height',
            'alignment'
        ]);
        definition.image = this.props.src || this.props.children || "";
        definition.margin = getMargin(this.props);
        this.definition = definition;
        return definition;
    }
}