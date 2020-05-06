import {PDFComponent} from './PDFComponent';

export class PDFContent extends PDFComponent {
    constructor(props) {
        super(props);
        this.isArray = true;
        this.contentField = 'content';
    }
}