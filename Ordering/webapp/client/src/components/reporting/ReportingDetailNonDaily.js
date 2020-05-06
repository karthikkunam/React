import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SideNavBar from '../shared/SideNavBar';
import 'react-day-picker/lib/style.css';
import { getReportingItemDetails } from '../../actions/index'
import { SINGLE_DAY, MULTI_DAY, NON_DAILY, GR } from '../../constants/ActionTypes';
import ReportingDetailHeader from './ReportingDetailHeader'
import ReportingDetailNonDailyGrid from './ReportingDetailNonDailyGrid'
import dateHelper, { convertStringToDate } from '../utility/DateHelper';

import "./ReportingDetail.css"

export class ReportingDetailNonDaily extends Component {

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
      orderByGroupVendor: false,
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
    if (orderCycles.includes(MULTI_DAY)) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(MULTI_DAY)));
      this.props.history.push(`/report/multiday`);
    } else if (orderCycles.includes(SINGLE_DAY)) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(SINGLE_DAY)));
      this.props.history.push(`/report/singleday`);
    } else {
      this.props.history.push(`/report`);
    }
  }

  onClickNext = () => {
    const { orderCycles, selectedReportingData } = this.state;

    if (orderCycles.includes("gr")) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(GR)));
      this.props.history.push(`/report/gr`);
    }
  }

  selectedDateInfo = (selectedDay) => {
    this.setState({selectedValue:selectedDay});
  }

  hasNext() {
    const { orderCycles } = this.state;
    if (orderCycles && orderCycles.includes("gr")) {
      return true
    } else {
      return false
    }
  }

  // onButtonClick = () => {
  //   this.setState({
  //     orderByGroupVendor: !this.state.orderByGroupVendor
  //   })
  // }

  render() {
    const {
      selectedReportingData,
      isNextDisabled,
      currentDisplayItemKey,
      orderByGroupVendor,
    } = this.state;
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
                //onButtonClick = {this.onButtonClick}
                orderByGroupVendor={orderByGroupVendor}
                selectedReportingItemKey={NON_DAILY}
              />
            </div>
            <div>
              <ReportingDetailNonDailyGrid
                onDayClickComplete={this.onDayClickComplete}
                onDayClicked={this.onDayClicked}
                orderByGroupVendor={orderByGroupVendor}
                selectedReportingItemKey={currentDisplayItemKey}
              />
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
)(withRouter(ReportingDetailNonDaily))
