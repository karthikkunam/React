import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SideNavBar from '../shared/SideNavBar';
import 'react-day-picker/lib/style.css';
import { getReportingItemDetails } from '../../actions/index'
import { SINGLE_DAY, MULTI_DAY, NON_DAILY, GR } from '../../constants/ActionTypes';
import ReportingDetailHeader from './ReportingDetailHeader'
import ReportingDetailMutiDayGrid from './ReportingDetailMutiDayGrid'
import dateHelper, { convertStringToDate } from '../utility/DateHelper';
import "./ReportingDetail.css"
export class ReportingDetailMultiDay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginData: {},
      error: false,
      errorMsg: null,
      orderByVendor: false,
      isNextDisabled: false,
      orderCycles: [],
      disPlayedItemKeys: [],
      currentDisplayItemKey: undefined,
      selectedDate: convertStringToDate(dateHelper().orderBatchDate),
      selectedReportingData: new Map(),
      onNext: false,
      dummy: 0,
      onDayClicked: false,
      selectedValue: null
    }
    this.hasNext = this.hasNext.bind(this)
  }

  componentDidMount() {
    const { loginData, selectedReportingData, orderCycles } = this.props;
    this.setState({
      loginData: loginData,
      selectedReportingData: selectedReportingData,
      orderCycles: orderCycles ? orderCycles : [],
    })
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      loginData: newProps.loginData,
      selectedReportingData: newProps.selectedReportingData,
      orderCycles: newProps.orderCycles,
    })
  }


  onClickDone = () => {
    this.props.history.push(`/report`,{selectedDay: this.state.selectedValue});
  }

  onClickPrevious = () => {
    const { orderCycles, selectedReportingData } = this.state;
    if (orderCycles.includes(SINGLE_DAY)) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(SINGLE_DAY)));
      this.props.history.push(`/report/singleday`);
    } else {
      this.props.history.push(`/report`);
    }
  }

  onClickNext = () => {
    const { orderCycles, selectedReportingData } = this.state;
    if (orderCycles.includes(NON_DAILY)) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(NON_DAILY)));
      //this.props.dispatch(getReportingItemVendorDetails(selectedReportingData.get(NON_DAILY_VENDOR)));  
      this.props.history.push(`/report/nondaily`);
    } else if (orderCycles.includes("gr")) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(GR)));
      this.props.history.push(`/report/gr`);
    }
  }
  
  selectedDateInfo = (selectedDay) => {
    this.setState({selectedValue:selectedDay});
  }

  hasNext() {
    const { orderCycles } = this.state;
    if (orderCycles && (orderCycles.includes(NON_DAILY) || orderCycles.includes("gr"))) {
      return true
    } else {
      return false
    }

  }
  render() {
    const { selectedReportingData, isNextDisabled, currentDisplayItemKey } = this.state;
    return (
      <div className="reportingdetail full-height">
        <div className="full-height" style={{ margin: "0" }}>
          <SideNavBar id="ordering-home">
            <div className="heading-desktop">
              <span className="ordering-heading">
                <span className="store-Info">STORE {this.props.loginData.storeId} </span>
                REPORTING
                </span>
            </div>
            <div >
              <ReportingDetailHeader
                selectedDateValue={this.selectedDateInfo}
                onDayClickComplete={this.onDayClickComplete}
                selectedReportingData={selectedReportingData}
                selectedReportingItemKey={MULTI_DAY}  >
              </ReportingDetailHeader>
            </div>
            <div  >
              <ReportingDetailMutiDayGrid
                onDayClickComplete={this.onDayClickComplete}
                onDayClicked={this.onDayClicked}
                selectedReportingItemKey={currentDisplayItemKey}>
              </ReportingDetailMutiDayGrid>
            </div>
          </SideNavBar>
        </div>
        <div className="ordering-prev">
          {/* {
            <button id="btn-prev"
              type="button"
              className="btn btn-previous d-none d-sm-block"
              onClick={() => this.onClickPrevious()}>  PREVIOUS
              </button>
          } */}
          {<button
            id="btn-next"
            type="button"
            className="btn btn-next d-none d-md-block d-lg-block"
            disabled={isNextDisabled}
            onClick={() => this.hasNext() ? this.onClickNext()
              : this.onClickDone()}
          >{this.hasNext() ? 'NEXT' : 'DONE'}
          </button>
          }
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return ({
    orderCycles: state.reporting.reportingData.orderCycles ? state.reporting.reportingData.orderCycles : [],
    selectedReportingData: state.reporting.reportingData.selectedReportingData ? state.reporting.reportingData.selectedReportingData : undefined,
    loginData: state.login.loginData && state.login.loginData.payload ? state.login.loginData.payload : undefined,
  });
}

export default connect(
  mapStateToProps
)(withRouter(ReportingDetailMultiDay))
