import {PDFComponent} from './PDFComponent';

export class PDFColumns extends PDFComponent {
    constructor(props) {
        super(props);
        this.isArray = true;
        this.contentField = 'columns'
    }
}