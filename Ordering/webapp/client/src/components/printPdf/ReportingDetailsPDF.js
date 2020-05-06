import * as React from 'react';
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
import * as moment from 'moment';
import { SINGLE_DAY, MULTI_DAY, NON_DAILY, GR } from '../../constants/ActionTypes';
import { getItemStatus, getPromotion, getBillback } from '../utility/promoInfo';
import PdfModalBox from '../shared/PdfModalBox';
import pdfMake from 'pdfmake/build/pdfmake.js';

const PDF_STYLES = {
  forecast: {
    alignment: "center",
    fontSize: "8"
  },
  headerText: {
    bold: "true",
    fontSize: "8"
  }
}

export default class ReportingDetailPDF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDetails: {},
      reportType: "",
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
    this.setState({ showModal: showModal});
  }

componentDidMount() {
  const { reportDetails, reportType } = this.props;
  this.setState({
    reportDetails: reportDetails,
    reportType: reportType,
    base64pdf: ''
  });
}

componentWillReceiveProps(newProps) {
  this.setState({
    reportDetails: {},
    reportType: newProps.reportType
  }, () => this.setState({
    reportDetails: newProps.reportDetails,
    base64pdf: ''
  }));
}

  renderSingleDayBody(reportDetails = {}) {
    return (<PDFTableBody widths={['30%', '10%', "8%", '*', '6%']}>
      <PDFTableRow>
        <PDFText lineHeight="1" text={[{ text: "Category, ", bold: true, fontSize: 12 }, "Item Description"]} marginTop="10" fontSize="9" />
        <PDFText text=""></PDFText>
        <PDFText lineHeight="1" text="Item Number" fontSize="9" />
        <PDFTable lineHeight="1" alignment='left' fontSize="9" width="100%">
          <PDFTableBody widths={["25%", "25%", "25%", "25%"]}>
            <PDFTableRow>
              <PDFText text="Item Sales Trend" alignment='center' colSpan="4" fontSize="9"></PDFText>
            </PDFTableRow>
            <PDFTableRow>
              <PDFText text="FP4" fontSize="8" alignment="center"></PDFText>
              <PDFText text="FP3" fontSize="8" alignment="center"></PDFText>
              <PDFText text="FP2" fontSize="8" alignment="center"></PDFText>
              <PDFText text="FP1" fontSize="8" alignment="center"></PDFText>
            </PDFTableRow>
          </PDFTableBody>
        </PDFTable>
        <PDFText text="Order" fontSize="9" marginTop="10"></PDFText>
      </PDFTableRow>
      {this.renderDaily(reportDetails)}
    </PDFTableBody>)
  }

  renderMultiDayBody(reportDetails) {
    return (<PDFTableBody widths={['30%', '10%', "8%", '*', '9%', '9%', '6%']}>
      <PDFTableRow>
        <PDFText colSpan="2" lineHeight="1" text={[{ text: "Category, ", bold: true, fontSize: 12 }, "Item Description"]} marginTop="10" fontSize="9" />
        <PDFText lineHeight="1" text="Item Number" fontSize="9" />
        <PDFTable lineHeight="1" alignment='left' fontSize="9" width="100%">
          <PDFTableBody widths={["25%", "25%", "25%", "25%"]}>
            <PDFTableRow>
              <PDFText text="Item Sales Trend" alignment='center' colSpan="4" fontSize="9"></PDFText>
            </PDFTableRow>
            <PDFTableRow>
              <PDFText text="FP4" fontSize="8"></PDFText>
              <PDFText text="FP3" fontSize="8"></PDFText>
              <PDFText text="FP2" fontSize="8"></PDFText>
              <PDFText text="FP1" fontSize="8"></PDFText>
            </PDFTableRow>
          </PDFTableBody>
        </PDFTable>
        <PDFStack>
          <PDFText marginTop="5" text="F -" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Forecast" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
        <PDFStack>
          <PDFText marginTop="5" text="I =" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Inventory" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
        <PDFStack>
          <PDFText marginTop="5" text="O" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Order" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
      </PDFTableRow>
      {this.renderMultiDay(reportDetails)}
    </PDFTableBody>)
  }

  renderNonDailyBody(reportDetails) {
    return (<PDFTableBody widths={['30%', '7%', "8%", '*', '14%', '4%', '4%', '6%']}>
      <PDFTableRow>
        <PDFText colSpan="2" lineHeight="1" text={[{ text: "Category, ", bold: true, fontSize: 12 }, "Item Description"]} marginTop="10" fontSize="9" />
        <PDFText lineHeight="1" text="Item Number" fontSize="9" />
        <PDFTable lineHeight="1" alignment='left' fontSize="9" width="100%">
          <PDFTableBody widths={["25%", "25%", "25%", "25%"]}>
            <PDFTableRow>
              <PDFText text="Item Sales Trend" alignment='center' colSpan="4" fontSize="9"></PDFText>
            </PDFTableRow>
            <PDFTableRow>
              <PDFText text="FP4" fontSize="8"></PDFText>
              <PDFText text="FP3" fontSize="8"></PDFText>
              <PDFText text="FP2" fontSize="8"></PDFText>
              <PDFText text="FP1" fontSize="8"></PDFText>
            </PDFTableRow>
          </PDFTableBody>
        </PDFTable>
        <PDFStack>
          <PDFText marginTop="5" text="F +" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Forecast" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
        <PDFStack>
          <PDFText marginTop="5" text="M -" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Min" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
        <PDFStack>
          <PDFText marginTop="5" text="I =" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Inv." fontSize="9" alignment="center"></PDFText>
        </PDFStack>
        <PDFStack>
          <PDFText marginTop="5" text="O" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Order" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
      </PDFTableRow>
      {this.renderNonDaily(reportDetails)}
    </PDFTableBody>)
  }

  renderGrBody(reportDetails) {
    return (<PDFTableBody widths={['30%', '7%', "8%", '*', '14%', '4%', '4%', '6%']}>
      <PDFTableRow>
        <PDFText colSpan="2" lineHeight="1" text={[{ text: "Category, ", bold: true, fontSize: 12 }, "Item Description"]} marginTop="10" fontSize="9" />
        <PDFText lineHeight="1" text="Item Number" fontSize="9" />
        <PDFTable lineHeight="1" alignment='left' fontSize="9" width="100%">
          <PDFTableBody widths={["25%", "25%", "25%", "25%"]}>
            <PDFTableRow>
              <PDFText text="Item Sales Trend" alignment='center' colSpan="4" fontSize="9"></PDFText>
            </PDFTableRow>
            <PDFTableRow>
              <PDFText text="FP4" fontSize="8"></PDFText>
              <PDFText text="FP3" fontSize="8"></PDFText>
              <PDFText text="FP2" fontSize="8"></PDFText>
              <PDFText text="FP1" fontSize="8"></PDFText>
            </PDFTableRow>
          </PDFTableBody>
        </PDFTable>
        <PDFStack>
          <PDFText marginTop="5" text="Prj F +" fontSize="8" alignment="center" bold="true"></PDFText>
          <PDFText text="Proj. Forecast" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
        <PDFStack>
          <PDFText marginTop="5" text="M -" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Min" fontSize="9" alignment="center"></PDFText>
        </PDFStack>
        <PDFStack>
          <PDFText marginTop="5" text="I =" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Inv." fontSize="9" alignment="center"></PDFText>
        </PDFStack>

        <PDFStack>
          <PDFText marginTop="5" text="O" fontSize="9" alignment="center" bold="true"></PDFText>
          <PDFText text="Order" fontSize="9" alignment="center"></PDFText>
        </PDFStack>

      </PDFTableRow>
      {this.renderGr(reportDetails)}
    </PDFTableBody>)
  }

  renderBody(reportDetails = {}, reportType) {
    if (reportType === SINGLE_DAY) {
      return this.renderSingleDayBody(reportDetails);
    } else if (reportType === MULTI_DAY) {
      return this.renderMultiDayBody(reportDetails);
    } else if (reportType === NON_DAILY) {
      return this.renderNonDailyBody(reportDetails);
    } else if (reportType === GR) {
      return this.renderGrBody(reportDetails);
    }
  }

  render() {
    const { reportDetails, reportType, showModal, base64pdf } = this.state;
    let reportvalue = {};
    if (reportType && reportType === NON_DAILY) {
      if (reportDetails.nonDailyVendor) {
        if (reportDetails.nonDailyVendor.CDC) {
          reportvalue = reportDetails.nonDailyVendor["CDC"];
        } else if (reportDetails.nonDailyVendor.DSD) {
          reportvalue = reportDetails.nonDailyVendor["DSD"];
        }
      } else {
        reportvalue = reportDetails[reportType];
      }
    } else {
      reportvalue = reportDetails[reportType];
    }
    const currentReportDetails = reportvalue;
    const reportTypeTitle = {
      [SINGLE_DAY]: 'Daily',
      [MULTI_DAY]: 'Multi Day',
      [NON_DAILY]: 'Non Daily',
      [GR]: 'GR'
    }
    return (
      <button className={this.props.className} onClick={(...params) => this.onClick(...params)}>
        {this.props.children}
        <PDFDocument ref="pdfDocument"
          pageSize={PAGE_SIZE.A4}
          pageOrientation={PAGE_ORIENTATION.PORTRAIT}
          marginTop='100'
          marginLeft="40"
          marginRight="40"
        >
          <PDFCustomHeader queries={[{
            name: 'Date',
            value: moment(this.props.selectedDay).format('ddd MM-DD-YYYY')
          }
          ]}
            title={`Ordering History (${reportTypeTitle[reportType]})`}
            employeeId={this.props.employeeId}
            storeId={this.props.storeId}>
          </PDFCustomHeader>
          <PDFContent>
            <PDFColumns>

              <PDFColumns>
                <PDFText width="*" marginBottom="5" fontSize="8" bold="true" color="#008060" text="P+: Promo Start"></PDFText>
                <PDFText width="*" marginBottom="5" fontSize="8" bold="true" color="#287cba" text="P: Promo On"></PDFText>
                <PDFText width="*" marginBottom="5" fontSize="8" bold="true" color="#f58220" text="P-: Promo End"></PDFText>
              </PDFColumns>

              <PDFText width="*" marginBottom="5" fontSize="8" bold="true" text="$: Bill Back  N: New D: Delete"></PDFText>
            </PDFColumns>
            <PDFTable marginTop="110" >
              {
                this.renderBody(currentReportDetails, reportType)
              }
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

  /**  */
  renderDaily(categories = []) {
    let result = [];
    if (Array.isArray(categories)) {
      categories.forEach((category, index) => {
        const { categoryName, orderWriter, device, items = [] } = category;
        result.push((
          <PDFTableRow key = {index}>
            <PDFColumns><PDFText text={categoryName} bold="true" fontSize="12"></PDFText></PDFColumns>
            <PDFColumns colSpan="2">
              <PDFText fontSize="9" alignment="center" text={device ? `Device: ${device}` : 'Device:'}></PDFText>
            </PDFColumns>
            <PDFColumns colSpan="2">
              <PDFText alignment="center" fontSize="9" text={orderWriter ? `Order Writer: ${orderWriter}` : 'Order Writer:'}></PDFText>
            </PDFColumns>
          </PDFTableRow>
        ));
        const itemRows = items.map((item, key) => {
          // console.log(`PDF item details--->`, item)
          return (
            <PDFTableRow key={key}>
              <PDFText text={item.itemName} fontSize="8"></PDFText>
              <PDFColumns>
                <PDFText fontSize="8" bold="true" text={`${getPromotion(item.promotion)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getBillback(item.isBillBackAvailable)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getItemStatus(item.itemStatus)}`}></PDFText>
              </PDFColumns>
              <PDFText text={item.itemId} fontSize="8" ></PDFText>
              <PDFColumns>
                <PDFText text={item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null} {...PDF_STYLES.forecast}></PDFText>
              </PDFColumns>

              <PDFText text={item.itemOrderQty === 0 ? '0' : item.itemOrderQty} fontSize="8" alignment="center"></PDFText>
            </PDFTableRow>)
        }
        )
        result.push(itemRows)
      })
    }
    return result;
  }

  renderMultiDay(categories = []) {
    let result = [];
    if (Array.isArray(categories)) {
      categories.forEach((category, index )=> {
        const { categoryName, orderWriter, device, items = [] } = category;
        result.push((
          <PDFTableRow key = {index}>
            <PDFColumns><PDFText text={categoryName} bold="true" fontSize="12"></PDFText></PDFColumns>
            <PDFColumns colSpan="2">
              <PDFText fontSize="9" alignment="center" text={device ? `Device: ${device}` : 'Device'}></PDFText>
            </PDFColumns>
            <PDFColumns colSpan="4">
              <PDFText alignment="center" fontSize="9" text={orderWriter ? `Order Writer: ${orderWriter}` : 'Order Writer:'}></PDFText>
            </PDFColumns>
          </PDFTableRow>
        ));
        const itemRows = items.map((item, key) => {
          return (
            <PDFTableRow key={key}>
              <PDFText text={item.itemName} fontSize="8"></PDFText>
              <PDFColumns>
                <PDFText fontSize="8" bold="true" text={`${getPromotion(item.promotion)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getBillback(item.isBillBackAvailable)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getItemStatus(item.itemStatus)}`}></PDFText>
              </PDFColumns>
              <PDFText text={item.itemId} fontSize="8" ></PDFText>
              <PDFColumns>
                <PDFText text={item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null} {...PDF_STYLES.forecast}></PDFText>
              </PDFColumns>
              <PDFText fontSize="9" {...PDF_STYLES.forecast} text={item.tomorrowSalesForecastQty === 0 ? '0' : item.tomorrowSalesForecastQty}></PDFText>
              <PDFText fontSize="9" {...PDF_STYLES.forecast} text={item.carryOverInventoryQty === 0 ? '0' : item.carryOverInventoryQty}></PDFText>
              <PDFText fontSize="9" text={item.itemOrderQty === 0 ? '0' : item.itemOrderQty} alignment="center"></PDFText>
            </PDFTableRow>)
        }
        );
        result.push(itemRows)
      });
    }
    return result;
  }

  renderNonDaily(categories = []) {
    let result = [];
    if (Array.isArray(categories)) {
      categories.forEach((category, index) => {
        const { categoryName, orderWriter, device, items = [] } = category;
        result.push((
          <PDFTableRow key = {index}>
            <PDFColumns><PDFText text={categoryName} bold="true" fontSize="12"></PDFText></PDFColumns>
            <PDFColumns colSpan="3">
              <PDFText fontSize="9" alignment="center" text={device ? `Device: ${device}` : 'Device'}></PDFText>
            </PDFColumns>
            <PDFColumns colSpan="4">
              <PDFText alignment="center" fontSize="9" text={orderWriter ? `Order Writer: ${orderWriter}` : 'Order Writer:'}></PDFText>
            </PDFColumns>
          </PDFTableRow>
        ));
        const itemRows = items.map((item, key) => {
          return (
            <PDFTableRow key={key}>
              <PDFText text={item.itemName} fontSize="8"></PDFText>
              <PDFColumns>
                <PDFText fontSize="8" bold="true" text={`${getPromotion(item.promotion)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getBillback(item.isBillBackAvailable)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getItemStatus(item.itemStatus)}`}></PDFText>
              </PDFColumns>
              <PDFText text={item.itemId} fontSize="8" ></PDFText>
              <PDFColumns>
                <PDFText text={item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null} {...PDF_STYLES.forecast}></PDFText>
              </PDFColumns>
              <PDFText fontSize="9" {...PDF_STYLES.forecast} text={item.tomorrowSalesForecastQty === 0 ? '0' : item.tomorrowSalesForecastQty}></PDFText>
              <PDFText fontSize="9" {...PDF_STYLES.forecast} text={item.minimumOnHandQty === 0 ? '0' : item.minimumOnHandQty}></PDFText>
              <PDFText fontSize="9" {...PDF_STYLES.forecast} text={item.carryOverInventoryQty === 0 ? '0' : item.carryOverInventoryQty}></PDFText>
              <PDFText fontSize="9" text={item.itemOrderQty === 0 ? '0' : item.itemOrderQty} alignment="center"></PDFText>
            </PDFTableRow>)
        }
        );
        result.push(itemRows)
      });
    }
    return result;
  }

  renderGr(categories = []) {
    let result = [];
    if (Array.isArray(categories)) {
      categories.forEach((category, index) => {
        const { categoryName, orderWriter, device, items = [] } = category;
        result.push((
          <PDFTableRow key = {index}>
            <PDFColumns><PDFText text={categoryName} bold="true" fontSize="12"></PDFText></PDFColumns>
            <PDFColumns colSpan="2">
              <PDFText fontSize="9" alignment="center" text={device ? `Device: ${device}` : 'Device'}></PDFText>
            </PDFColumns>
            <PDFColumns colSpan="5">
              <PDFText alignment="center" fontSize="9" text={orderWriter ? `Order Approved By: ${orderWriter}` : 'Order Approved By:'}></PDFText>
            </PDFColumns>
          </PDFTableRow>
        ));
        const itemRows = items.map((item, key) => {
          // console.log(`--- items ---`, item, item.forecastHistory, item.forecastHistory ? item.forecastHistory.fp4 : null)
          return (
            <PDFTableRow key={key}>
              <PDFText text={item.itemName} fontSize="8"></PDFText>
              <PDFColumns>
                <PDFText fontSize="8" bold="true" text={`${getPromotion(item.promotion)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getBillback(item.isBillBackAvailable)}`}></PDFText>
                <PDFText fontSize="8" bold="true" text={`${getItemStatus(item.itemStatus)}`}></PDFText>
              </PDFColumns>
              <PDFText text={item.itemId} fontSize="8" ></PDFText>
              <PDFColumns>
                <PDFText text={item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null} {...PDF_STYLES.forecast}></PDFText>
                <PDFText text={item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null} {...PDF_STYLES.forecast}></PDFText>
              </PDFColumns>
              <PDFText {...PDF_STYLES.forecast} text={item.tomorrowSalesForecastQty === 0 ? '0' : item.tomorrowSalesForecastQty}></PDFText>
              <PDFText {...PDF_STYLES.forecast} text={item.minimumOnHandQty === 0 ? '0' : item.minimumOnHandQty}></PDFText>
              <PDFText {...PDF_STYLES.forecast} text={item.carryOverInventoryQty === 0 ? '0' : item.carryOverInventoryQty}></PDFText>
              <PDFText {...PDF_STYLES.forecast} text={item.itemOrderQty === 0 ? '0' : item.itemOrderQty} alignment="center"></PDFText>
            </PDFTableRow>)
        }
        );
        result.push(itemRows)
      })
    }
    return result;
  }
}
