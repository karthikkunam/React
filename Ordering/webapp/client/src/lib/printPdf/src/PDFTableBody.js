import {PDFComponent} from './PDFComponent';

export class PDFTableBody extends PDFComponent {
    constructor(props) {
        super(props);
        this.contentField = 'body';
        this.isArray = true;
    }
    buildDefinition() {
        let definition = {};
        if (this.props.widths) {
            definition.widths = this.props.widths;
        }
        this.definition = definition;
        return definition;
    }
}
