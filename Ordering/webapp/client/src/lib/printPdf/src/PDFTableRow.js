import {PDFComponent} from './PDFComponent';

export class PDFTableRow extends PDFComponent {
    constructor(props) {
        super(props);
        this.isArray = true;
    }
}