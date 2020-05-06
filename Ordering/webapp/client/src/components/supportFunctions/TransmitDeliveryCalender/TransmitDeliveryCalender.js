import React from 'react'
import * as moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SideNavBar from '../../shared/SideNavBar';
import SpinnerComponent from '../../shared/SpinnerComponent';
import '../../ordering/OrderingHome.css';
import '../common/supportFunctions.css';
import './TransmitDeliveryCalendar.css';
import { getDayNameAndDateMMDD } from '../../utility/DateFormatter';
import { getTransmitDeliverySchedule } from '../../../actions';
import { getCalendarFormattedData, getCalendarUpdatedDate } from '../../utility/formatCalendarRecords';
import TransmitDeliveryCalendarPDF from '../../printPdf/TransmitDeliveryCalendarPDF';
import { storeDetails } from '../../../lib/storeDetails'

export class TransmitDeliveryCalender extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginData: [],
      transmitDeliverySpinner: false,
      transmitDeliveryStatus: ''
    }

    /* Added to reset the default image on login page*/
    document.querySelector("body").style.backgroundImage = 'none';
  }


  componentDidMount() {
    this.setState({
      loginData: this.props.loginData,
      TransmitDeliveryCalender: this.props.TransmitDeliveryCalender,
    }, () => {
      const { loginData } = this.state;
      this.props.dispatch(getTransmitDeliverySchedule(loginData.storeId));
      this.setState({ transmitDeliverySpinner: true });
    })

  }

  componentWillReceiveProps(newProps) {
    this.setState({
      loginData: newProps.loginData,
      TransmitDeliveryCalender: newProps.TransmitDeliveryCalender,
      transmitDeliveryStatus: newProps && newProps.transmitDeliveryStatus
    },()=>{
      const { transmitDeliveryStatus } = this.state;
      if(((newProps && newProps.TransmitDeliveryCalender) || (newProps && newProps.transmitDeliverySchedule.length === 0)) && (transmitDeliveryStatus === "NETWORK_ERROR" || transmitDeliveryStatus === "COMPLETE")){
        this.setState({ transmitDeliverySpinner: false });
      }
    })
  }

  onClickPrevious = () => {
    this.props.history.push('/home');
  }

  renderTop(data, dateList) {
    const { TransmitDeliveryCalender, loginData } = this.state;
    const storeDetailsId = loginData && loginData.token && storeDetails() && storeDetails().storeId;
    const storeDetilasUser = loginData && loginData.token && storeDetails() && storeDetails().userId;
    // const storeDetilasUser = loginData && loginData.token && storeDetails() && storeDetails().fullName;
    let updatedDate, formattedDate;
    if (TransmitDeliveryCalender && TransmitDeliveryCalender.data && TransmitDeliveryCalender.data.body) {
      updatedDate = getCalendarUpdatedDate(TransmitDeliveryCalender.data.body);
      formattedDate = moment(updatedDate).format('ddd MM-DD-YYYY');
    }

    return (
      <div className="SupportFunctions row no-side-padding">
        <div className="col-md-3">
          <TransmitDeliveryCalendarPDF
            storeId={storeDetailsId ? storeDetails().storeId : ''}
            // employeeId={storeDetilasUser ? storeDetails().fullName : ''}
            employeeId={storeDetilasUser ? storeDetails().userId : ''}
            className="print-pdf"
            updatedDate={updatedDate}
            dateList={dateList}
            calendarRecords={data}
          >
            PRINT REPORT
        </TransmitDeliveryCalendarPDF>
        </div>
        <div className="col-md-9 updated-date">
          Calendar Updated: {formattedDate ? formattedDate : ''}
        </div>
      </div>
    )
  }

  renderDataHeaders(dateList = []) {
    return (
      <div className="deliveryComponent-main">
        <div className="row text-left headerTransmit">
          <div className="col-md-5 Delivery-Agent"> Delivery Agent </div>
          <div className="col-md-7 headerTransmit">
            <div className="order-transmit-dates padding-top-only">  Order Transmit Dates </div>
            <div className="row no-margin order-transmit-dates remove-margin-right-left">
              {
                dateList.map((data, index) => {
                  return (
                    <div key={index}>
                      <div className="col-md-1 custom-seven-column-grid">
                        <span className="curren-dates curren-dates-text">
                        {String(data.name).slice(0, 3)}
                        </span>
                        <span className="curren-dates">
                        {data.day}
                        </span>
                      </div>
                      {/* <div className="col-md-1 custom-seven-column-grid">
                        <span className="curren-dates">
                        {data.day}
                        </span>
                      </div> */}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderDataBody(data = []) {
    const { transmitDeliverySpinner } = this.state;
    return (
      <div className="deliveryComponent data-grid">
        {/**No data available watermark */}
        {
          !transmitDeliverySpinner && (data && data.length) === 0 && (this.props.transmitDeliveryStatus === "COMPLETE" || this.props.transmitDeliveryStatus === "NETWORK_ERROR") && 
             <span className="DT-no-data-indicator no-data-indicator">No Data Available</span>
        }
        {data && data.length > 0 ?
          (data.map((item, index) => {
            return (
              <div className="row no-margin border-bottom" key={index}>
                <div className="col-md-5  agent-name">
                  {item && item.agentName ? item.agentName : "No Name Found"}
                  <span> &#8212; </span>
                  {item.cycleCode}</div>
                {
                  item && item.calendarData && item.calendarData.length > 0 ?
                    (

                      (item.calendarData).map((datesVal, childIndex) => {
                        return (
                          <div key={childIndex} className="col-md-1 delivery-transmit-dates">
                            {
                              datesVal.split('-')[0]
                            }
                            {/* <div className="w-100"></div> */}
                            {/* {
                              datesVal.split('-')[1]
                            } */}
                          </div>
                        )
                      })
                    ) : "No Dates present"
                }
              </div>
            )
          })
          )
          :transmitDeliverySpinner &&
            <div className="ordering-home-spinner" >
              <SpinnerComponent displaySpinner={transmitDeliverySpinner} />
            </div>
        }
      </div>
    )
  }

  render() {

    const { TransmitDeliveryCalender } = this.state
    let data;
    let dateList;
    if (TransmitDeliveryCalender && TransmitDeliveryCalender.data && TransmitDeliveryCalender.data.body) {
      data = getCalendarFormattedData(TransmitDeliveryCalender.data.body);
      let calenderUpdateDate = getCalendarUpdatedDate(TransmitDeliveryCalender.data.body);
      dateList = getDayNameAndDateMMDD(calenderUpdateDate);
    } else {
      data = [];
    }

    return (
      <div className="full-height">
        <div className="full-height" style={{ margin: "0" }}>
          <SideNavBar id="transmit-delivery-schedule" val={this.state.selectedStoreFunction}>
            <div className="heading-desktop">
              <span className="ordering-heading">
                <span className="store-Info">STORE {this.state.loginData.storeId}</span>
                TRANSMIT DELIVERY CALENDAR
            </span>
            </div>
            {this.renderTop(data, dateList)}
            {this.renderDataHeaders(dateList)}
            <div className="row text-left deliveryComponent">
              <div className="col-md-5 deliverycustomwidth"></div>
              <div className="col-md-7 delivery-dates border-bottom align-middle d-table-cell card-body"> Delivery Dates</div>
            </div>
            {this.renderDataBody(data)}
            <div className="ordering-prev">
              <button id="btn-next" type="button" className="btn btn-next d-none d-md-block d-lg-block" onClick={this.onClickPrevious} >DONE</button>
            </div>
          </SideNavBar>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return ({
    loginData: state.login.loginData.payload,
    transmitDeliveryStatus: state.ordering && state.ordering.getOrderingStatus && state.ordering.getOrderingStatus.payload,
    TransmitDeliveryCalender: state.storeFunctions && state.storeFunctions.transmitDeliverySchedule && state.storeFunctions.transmitDeliverySchedule.payload ? state.storeFunctions.transmitDeliverySchedule.payload : {}
  });
}

export default connect(
  mapStateToProps
)(withRouter(TransmitDeliveryCalender))