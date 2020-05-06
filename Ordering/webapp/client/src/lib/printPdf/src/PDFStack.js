import {PDFComponent} from './PDFComponent';

export class PDFStack extends PDFComponent {
    constructor(props) {
        super(props);
        this.isArray = true;
        this.contentField = 'stack';
    }
}
