import * as React from 'react';
import * as moment from 'moment';
import {
  PDFDocument,
  PDFContent,
  PDFColumns,
  PDFText,
  PDFTable, 
  PDFTableRow,
  PDFTableBody,
  PAGE_SIZE, 
  PAGE_ORIENTATION,
  TEXT_TYPES
} from '../../lib/printPdf';
import PDFCustomHeader from './customHeader';
import PdfModalBox from '../shared/PdfModalBox';
import pdfMake from 'pdfmake/build/pdfmake.js';
import {storeDetails} from '../../lib/storeDetails';

const STYLES = {
  header: {
    lineHeight:1,
    fontSize:10, 
    marginTop:5
  }
}
export default class StoreOrderErrorPdf extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      msgBoxBody: '',
      selectedDay: props.selectedDay,
    }
  }

  onClick() {
    const definition = this.refs.pdfDocument.getDefinition();
    pdfMake.createPdf(definition).getBase64((result) => {
      let base64pdfContent = 'data:application/pdf;base64,' + result;
      this.setState({
        showModal: true,
        base64pdf: base64pdfContent
      });
    });
  }

  closeModal = (showModal) => {
    this.setState({ showModal: showModal });
  }

  componentDidMount() {
    this.setState({
      base64pdf: '',
      selectedDay: this.props.selectedDay
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ base64pdf: '', selectedDay: newProps.selectedDay });
  }

  render(){
    const { showModal, base64pdf, selectedDay } = this.state;
    const textColor = "#F1EFEE";
    const rejectedOrdersBody = this.props.rejectedOrders ? this.props.rejectedOrders.map((error, key)=> {
      return (
      <PDFTableRow key={key}>
          <PDFText text={error.itemId} fontSize="10"  />
          <PDFText text={error.itemShortName} fontSize="10"  />
          <PDFText text={error.storeOrderTypeCode} fontSize="10"  />
          <PDFText type={TEXT_TYPES.DATE} fontSize="10"  format="MM-DD-YYYY" timeZone={storeDetails().timeZone} text={error.expectedDeliveryDate}/>
          <PDFText text={error.deliveryNumber === 0 ? '0' : error.deliveryNumber} fontSize="10"  />
          <PDFText text={error.adjustedItemOrderQuantity === 0 ? '0' : error.adjustedItemOrderQuantity} fontSize="10"  />
          <PDFText text={error.userFriendlyOrderErrorText} fontSize="10"  />
      </PDFTableRow>); 

    }) : [];

    const modifiedOrdersBody = this.props.modifiedOrders ? this.props.modifiedOrders.map((error, key)=> {
      return (
      <PDFTableRow key={key}>
          <PDFText text={error.itemId} fontSize="10" />
          <PDFText text={error.itemShortName} fontSize="10" />
          <PDFText text={error.storeOrderTypeCode} fontSize="10" />
          <PDFText type={TEXT_TYPES.DATE} fontSize="10"  format="MM-DD-YYYY" timeZone={storeDetails().timeZone} text={error.expectedDeliveryDate}/>
          <PDFText text={error.deliveryNumber === 0 ? '0' : error.deliveryNumber} fontSize="10" />
          <PDFText text={error.adjustedItemOrderQuantity === 0 ? '0' : error.adjustedItemOrderQuantity} fontSize="10"  />
          <PDFText text={error.userFriendlyOrderErrorText} fontSize="10"  />
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
            name: 'Date', 
            value: moment(selectedDay).format('ddd MM-DD-YYYY')}
            ]} 
            title="Store Order Errors" 
            employeeId={this.props.employeeId} 
            storeId={this.props.storeId}>
          </PDFCustomHeader>
          <PDFContent>
            <PDFColumns>
              <PDFText width="*" marginBottom="5" fontSize="12" bold="true">Rejected Orders</PDFText>
            </PDFColumns>
            <PDFTable marginTop="60" >
             <PDFTableBody widths={['14%', '24%', '10%,','14%', '8%', '8%', '*']}>
             <PDFTableRow>
                  <PDFText fillColor={textColor} text="Item Number" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Item Description" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Order Type" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Del. Date" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Del. Num" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Adj Qty" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Error Description" {...STYLES.header}  />
                </PDFTableRow>
                {rejectedOrdersBody}
             </PDFTableBody>
            </PDFTable>
            <PDFText width="*" marginBottom="5" fontSize="12" bold="true">Modified Orders</PDFText>
            <PDFTable>
            <PDFTableBody widths={['14%', '24%', '10%,','14%', '8%', '8%', '*']}>
                <PDFTableRow>
                  <PDFText fillColor={textColor} text="Item Number" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Item Description" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Order Type" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Del. Date" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Del. Num" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Adj Qty" {...STYLES.header} />
                  <PDFText fillColor={textColor} text="Error Description" {...STYLES.header} />
                </PDFTableRow>
                {modifiedOrdersBody}
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
