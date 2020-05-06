import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SideNavBar from '../shared/SideNavBar';
import 'react-day-picker/lib/style.css';
import { getReportingItemDetails } from '../../actions/index'
import { SINGLE_DAY, MULTI_DAY, NON_DAILY, GR } from '../../constants/ActionTypes';
import ReportingDetailHeader from './ReportingDetailHeader'
import ReportingDetailGRGrid from './ReportingDetailGRGrid'
import dateHelper, { convertStringToDate } from '../utility/DateHelper';
import "./ReportingDetail.css"

export class ReportingDetailGR extends Component {

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

  selectedDateInfo = (selectedDay) => {
    this.setState({selectedValue:selectedDay});
  }

  onClickPrevious = () => {
    const { orderCycles, selectedReportingData } = this.state;
    if (orderCycles.includes(NON_DAILY)) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(NON_DAILY)));
      this.props.history.push(`/report/nondaily`);
    } else if (orderCycles.includes(MULTI_DAY)) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(MULTI_DAY)));
      this.props.history.push(`/report/multiday`);
    } else if (orderCycles.includes(SINGLE_DAY)) {
      this.props.dispatch(getReportingItemDetails(selectedReportingData.get(SINGLE_DAY)));
      this.props.history.push(`/report/singleday`);
    } else {
      this.props.history.push(`/report`);
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
                selectedReportingItemKey={GR}>
              </ReportingDetailHeader>
            </div>
            <div>
              <ReportingDetailGRGrid
                onDayClickComplete={this.onDayClickComplete}
                onDayClicked={this.onDayClicked}
                selectedReportingItemKey={currentDisplayItemKey}>
              </ReportingDetailGRGrid>
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
            onClick={() => this.onClickDone()}
          >{'DONE'}
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
)(withRouter(ReportingDetailGR))
