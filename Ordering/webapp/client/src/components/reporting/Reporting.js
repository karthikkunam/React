import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './Reporting.css';
import '../ordering/Landing/OrderingCycleType.css';
import '../ordering/Landing/OrderingCategories.css';
import '../ordering/OrderingHome.css';
import SideNavBar from '../../components/shared/SideNavBar';
import SpinnerComponent from '../../components/shared/SpinnerComponent';
import ReportingCycleType from './ReportingCycleType';
import ReportingCategories from './ReportingCategories';
import 'react-day-picker/lib/style.css';
import { SINGLE_DAY, MULTI_DAY, NON_DAILY } from '../../constants/ActionTypes';
import dateHelper, { convertStringToDate } from '../utility/DateHelper';
import { storeDetails } from '../../lib/storeDetails';

export class Reporting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMsg: null,
      selectedDay:(this.props.location.state && this.props.location.state.selectedDay) ? this.props.location.state.selectedDay : convertStringToDate(dateHelper().orderBatchDate),
      orderCycles: [SINGLE_DAY, MULTI_DAY, NON_DAILY],
      orderByVendor: false,
      isNextDisabled: true,
      onNext: false,
      dummy: 0,
      spinner: false,
      isReportingSpinner: false,
      storeId: storeDetails() && storeDetails().storeId
    }
    // console.log(`---------- state is ------------`, this.state, dateHelper().orderBatchDate)
    this.selectedDay = this.selectedDay.bind(this);
    this.orderCycles = this.orderCycles.bind(this);
    this.orderByVendor = this.orderByVendor.bind(this);
    this.isNextDisabled = this.isNextDisabled.bind(this);
    this.onNextComplete = this.onNextComplete.bind(this);
    this.isReportingSpinner = this.isReportingSpinner.bind(this);

    /* Added to reset the default image on login page*/
    document.querySelector("body").style.backgroundImage = 'none';
  }

  onClickPrevious = () => {
    this.props.history.push(`/home`)
  }

  onClickNext = () => {
    this.setState({ onNext: true })
  }

  componentDidMount() {
    this.setState({
      spinner: true,
      isReportingSpinner: true
    })
  }

  selectedDay(selectedDay) {
    // console.log(` ***** selected day *****`, selectedDay)
    this.setState({ selectedDay: selectedDay, spinner: true });
  }

  orderCycles(orderCycles) {
    this.setState({ orderCycles: orderCycles, dummy: this.state.dummy + 1 });
  }

  isNextDisabled(isNextDisabled) {
    this.setState({ isNextDisabled: isNextDisabled });
  }

  isReportingSpinner(isReportSpinner) {
    this.setState({ isReportingSpinner: isReportSpinner });
  }

  orderByVendor(orderByVendor) {
    this.setState({ orderByVendor: orderByVendor });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ spinner: false });
  }
  onNextComplete(nextPage) {
    this.props.history.push(nextPage);

    this.setState({ onNext: false })
  }
  render() {
    const { orderCycles, selectedDay, orderByVendor, dummy, isNextDisabled, spinner, storeId, isReportingSpinner } = this.state;
    return (
      <div className="reporting full-height" >
        <div className="full-height" style={{ margin: "0" }}>
          <SideNavBar id="ordering-home">
            <div className="heading-desktop">
              <span className="ordering-heading">
                <span className="store-Info">STORE {storeId}</span>
                REPORTING
              </span>
            </div>
            <ReportingCycleType
              selectedDay={this.selectedDay}
              orderCycles={this.orderCycles}
              orderByVendor={this.orderByVendor}
            />
            <ReportingCategories
              selectedDay={selectedDay}
              orderCycles={orderCycles}
              orderByVendor={orderByVendor}
              dummy={dummy}
              isReportingSpinner={this.isReportingSpinner}
              isNextDisabled={this.isNextDisabled}
              onNext={this.state.onNext}
              onNextComplete={this.onNextComplete}
            />
          </SideNavBar>
        </div>
        <div className="ordering-prev">{
          <button id="btn-prev"
            type="button"
            className="btn btn-previous d-none d-sm-block"
            onClick={() => this.onClickPrevious()}>PREVIOUS
          </button>
        }
          {<button
            id="btn-next"
            type="button"
            className="btn btn-next d-none d-md-block d-lg-block"
            onClick={() => this.onClickNext()}
            disabled={isNextDisabled} > NEXT
          </button>
          }
        </div>
        {spinner &&
          <div className="item-detail-spinner-component">
              <div className="item-detail-spinner">
                  <SpinnerComponent displaySpinner={spinner} />
              </div>
          </div>
        }
        {isReportingSpinner &&
          <div className="item-detail-spinner-component">
              <div className="item-detail-spinner">
                  <SpinnerComponent displaySpinner={isReportingSpinner} />
              </div>
          </div>
        }
      </div>
    )
  }
}
const mapStateToProps = state => {
  return ({
    reportingVendorDetails: state.reporting && state.reporting.reportingData && state.reporting.reportingData.reportingVendorDetails && state.reporting.reportingData.reportingVendorDetails ? state.reporting.reportingData.reportingVendorDetails : {},
    reportingCategoryDetails: state.reporting && state.reporting.reportingData && state.reporting.reportingData.reportingDetails ? state.reporting.reportingData.reportingDetails : {},
  });
}

Reporting.defaultProps = {

}

export default connect(
  mapStateToProps
)(withRouter(Reporting))
