import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import html2Canvas from 'html2canvas';

import { PDFComponent } from './PDFComponent';
import { getMargin, PAGE_ORIENTATION } from './common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// const openPdf = function (options, win) {
//     let pdfContent = ''
//     try {
//         this.getBase64(function (result) {
//             pdfContent = result;
//         }, options);
//     } catch (e) {
//         win.close();
//         throw e;
//     }
//     return pdfContent;
// };

const printScreen = function (options, win) {
    window.print();
    // options = options || {};
    // options.autoPrint = true; 

    // try {
    //     const element = document.body; 
    //     html2Canvas(element, {scale:2}).then(canvas => {
    //         const data = canvas.toDataURL("img/jpeg",2);
    //         const dim = getElementDimention(element); 
    //         const w = dim.width; 
    //         const h = dim.height;

    //         let html  = '<html><head><title></title></head>';
    //             html += '<body style="width: 100%; padding: 0; margin: 0;"';
    //             html += ' onload="window.focus(); window.print(); window.close()">';
    //             html += '<img src="' + data + '" /></body></html>';

    //         const printWindow = window.open('', 'to_print', `height=${h},width=${w}`);

    //         printWindow.document.open();
    //         printWindow.document.write(html);
    //         printWindow.document.close();
    //        // printWindow.close();

    //     }, options);
    // } catch (e) {
    //     win.close();
    //     throw e;
    // }
};

function getElementDimention(domElement) {
    if (domElement && domElement.getBoundingClientRect) {
        return domElement.getBoundingClientRect();
    } else {
        return {
            width: domElement.offsetWidth,
            height: domElement.offsetHeight
        }
    }
}
export class PDFDocument extends PDFComponent {
    constructor(props) {
        super(props);
        this.isArray = false;
    }
    static printScreen() {
        // we need to use html2Canvas and then use pdfmake to render the image into PDF. 
        const element = document.body;
        html2Canvas(element, {
            scale: 2
        }).then(canvas => {
            const data = canvas.toDataURL("img/jpeg", 2);
            const dim = getElementDimention(element);
            const w = dim.width;
            const h = dim.height;

            // let html  = '<html><head><title></title></head>';
            //     html += '<body style="width: 100%; padding: 0; margin: 0;"';
            //     html += ' onload="window.focus(); window.print(); window.close()">';
            //     html += '<img src="' + data + '" /></body></html>';

            // const printWindow = window.open('', 'to_print', `height=${h},width=${w}`);

            // printWindow.document.open();
            // printWindow.document.write(html);
            // printWindow.document.close();
            // //printWindow.close();

            const definition = {
                pageMargins: [0, 0, 0, 0],
                pageSize: {
                    width: w,
                    height: h
                },
                pageOrientation: w >= h ? PAGE_ORIENTATION.LANDSCAPE : PAGE_ORIENTATION.PORTRAIT,
                content: [{
                    image: data,
                    width: w,
                    height: h,
                    margin: [0, 0, 0, 0]
                }]
            };
            // pdfMake.createPdf(definition).print(); 

            const currentDocument = pdfMake.createPdf(definition);
            currentDocument._openPdf = printScreen;
            currentDocument.open();

        }).catch(err => console.log(err));
    }
    buildDefinition() {
        let documentDefinition = {};
        documentDefinition.pageOrientation = this.props.pageOrientation || PAGE_ORIENTATION.LANDSCAPE;
        if (this.props.pageSize) {
            documentDefinition.pageSize = this.props.pageSize;
        }
        documentDefinition.pageMargins = getMargin(this.props);
        this.definition = {
            ...this.definition,
            ...documentDefinition
        };
    }
    printPdf() {
        // need to read the props and then generate the json based on the childs props. 
        const definition = this.getDefinition();
        const currentDocument = pdfMake.createPdf(definition);
        // currentDocument._openPdf = openPdf;
        // currentDocument.open();
        let base64 = '';
        currentDocument.getBase64((result) => {
            base64 = result;
        });
        return base64
    }
}
