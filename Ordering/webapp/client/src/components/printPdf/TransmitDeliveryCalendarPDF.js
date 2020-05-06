import * as React from 'react';
import * as moment from 'moment';
import {
  PDFDocument,
  PDFContent,
  PDFColumns,
  PDFText,
  PDFStack,
  PDFTable, 
  PDFTableRow,
  PDFTableBody,
  PAGE_SIZE, 
  PAGE_ORIENTATION,
} from '../../lib/printPdf';
import PDFCustomHeader from './customHeader';
import PdfModalBox from '../shared/PdfModalBox';
import pdfMake from 'pdfmake/build/pdfmake.js';

export default class TransmitDeliveryCalendar extends React.Component { 
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
      base64pdf: ''
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ base64pdf: '' });
  }

  renderHeader(dateList = []){
    return (
      <PDFTableRow>
        <PDFText text="Delivery Agent Name" marginTop="10" fontSize="14"></PDFText>
        <PDFStack>
            <PDFText text="Order Transmit Date" alignment="center" fontSize="14" colSpan="7" marginBottom="5"></PDFText> 
            <PDFColumns marginTop="5" marginBottom="2"> 
            {(dateList.map((date, key) => {return <PDFText key={key} fontSize="8"  text={[{text:date.name.slice(0,3) + " ", bold:true}, date.day]}></PDFText>}))}
            </PDFColumns>
        </PDFStack>
      </PDFTableRow>
    )
  }

  renderBody(calendarRecords = []){
    //TODO: what if agent name is null. 
    return calendarRecords.map((record, key) => { 
        return (
        <PDFTableRow key={key}>
            <PDFStack>
                <PDFText fontSize="9" text={record.agentName || ""}></PDFText>
                <PDFText fontSize="9" text={record.cycleCode || ""}></PDFText>
            </PDFStack>
            <PDFColumns>
            {(record.calendarData.map((date, key) => {return <PDFStack key={key}><PDFText marginTop="7" alignment="center" fontSize="8" text={`${date.slice(0,3)}`}></PDFText> </PDFStack>}))}
            </PDFColumns>
        </PDFTableRow>)
    })
  }

  render(){
    const { showModal, base64pdf } = this.state;
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
            name: 'Calendar Updated', 
            value: moment(this.props.updatedDate).format('ddd MM-DD-YYYY')}
            ]} 
            title="Transmit Delivery Calendar" 
            employeeId={this.props.employeeId} 
            storeId={this.props.storeId}>
          </PDFCustomHeader>
          <PDFContent>
            <PDFTable marginTop="80">
             <PDFTableBody widths={['40%', '60%']}>
               {this.renderHeader(this.props.dateList)} 
               {this.renderBody(this.props.calendarRecords)}
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