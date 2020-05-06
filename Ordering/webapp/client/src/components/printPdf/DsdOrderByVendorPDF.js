import * as React from 'react';
import * as moment from 'moment';
import {
  PDFDocument,
  PDFContent,
  PDFText,
  PDFTable, 
  PDFTableRow,
  PDFTableBody,
  PAGE_SIZE, 
  PAGE_ORIENTATION,
} from '../../lib/printPdf';
import PDFCustomHeader from './customHeader';
import PdfModalBox from '../shared/PdfModalBox';
import pdfMake from 'pdfmake/build/pdfmake.js';

const STYLES = {
  header: {
    lineHeight:1,
    fontSize:10, 
    marginTop:10
  }
}
export default class DSDOrderByVendorPdf extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      msgBoxBody: ''
    }
  }

  onClick() {
    const definition = this.refs.pdfDocument.getDefinition();
    pdfMake.createPdf(definition).getBase64((result) => {
      let base64pdfContent = 'data:application/pdf;base64,' + result;
      this.setState({ base64pdf: base64pdfContent }, () => {
        this.setState({ showModal: true })
      });
    });
  }

  closeModal = (showModal) => {
    this.setState({ showModal: showModal });
  }

  componentDidMount() {
    this.setState({
      base64pdf: ''
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ base64pdf: '' });
  }

  checkIfVendorNameExists(vendorName){
    if(vendorName === 'N/A' || vendorName === null || typeof(vendorName) === 'undefined'){
      return 'No Name'
    } 
    return vendorName
  }
  
  render(){
    const { showModal, base64pdf } = this.state;
    const textColor = "#F1EFEE";;
    //console.log('####### Sorting:', this.props.sortName, this.props.sortOrder); 
    const dsdOrdersBody = this.props.orders ? this.props.orders.map((order, key)=> {
      return (<PDFTableRow key={key}>
          <PDFText  text={order.itemId} fontSize="10"  />
          <PDFText text={order.itemName} fontSize="10"  />
          <PDFText text={order.itemClassShort} fontSize="10"  />
          <PDFText text={order.itemOrderQty === 0 ? '0' : order.itemOrderQty} fontSize="10"  />
          <PDFText text={order.ldu === 0 ? '0' : order.ldu} fontSize="10"  />
          <PDFText text={order.itemUPC} fontSize="10"  />
      </PDFTableRow>); 

    }) : [];

    return (
    <button className ={this.props.className } onClick={(...params)=> this.onClick(...params)}> 
      {this.props.children}
      <PDFDocument ref="pdfDocument" 
        pageSize={PAGE_SIZE.A4} 
        pageOrientation={PAGE_ORIENTATION.PORTRAIT}
        marginTop='90' 
        marginLeft="40"
        marginRight="40"
        >
          <PDFCustomHeader queries={[ {
            name: 'Vendor',
            value: this.checkIfVendorNameExists(this.props.vendorName)
            }, { 
                name: 'Vendor#', 
                value: this.props.vendorId
            }, 
            { name: 'Order Date', value:moment(this.props.orderDate).format('MM-DD-YYYY')},
            { name: 'Delivery Date', value:moment(this.props.deliveryDate).format('MM-DD-YYYY')}
            ]} 
            title="DSD Order By Vendor" 
            employeeId={this.props.employeeId} 
            storeId={this.props.storeId}>
          </PDFCustomHeader>
          <PDFContent>
            <PDFTable marginTop="60" >
             <PDFTableBody widths={['10%', '*', '20%,','10%', '5%', '20%']}>
             <PDFTableRow>
                  <PDFText fillColor={textColor} text="Item Number" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Item Description" {...STYLES.header} marginTop="15" />
                  <PDFText fillColor={textColor} text="Product Class" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Vendor Order Quantity" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="LDU" {...STYLES.header} marginTop="15"  alignment="center"/>
                  <PDFText fillColor={textColor} text="UPC" {...STYLES.header} marginTop="15" alignment="center" />
                </PDFTableRow>
                {dsdOrdersBody}
             </PDFTableBody>
            </PDFTable>
          </PDFContent>
      </PDFDocument>

      <div> { showModal &&
          <PdfModalBox
            msgTitle = ""
            base64pdf = {base64pdf}
            initialModalState = {false}
            modalAction = {this.closeModal} 
          /> } 
      </div>
      
    </button>);
  }
}
