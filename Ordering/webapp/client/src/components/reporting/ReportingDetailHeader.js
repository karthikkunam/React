import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getReportingItemDetails, getReportingItemVendorDetails, getSelectedReportingData } from '../../actions/index';
import './Reporting.css';
import './ReportingDetailHeader.css';
import '../dayPicker/CustomDayPicker';
import '../dayPicker/CustomDayPicker.css';
import '../ordering/OrderingHome.css';
import '../supportFunctions/StoreOrderErrors/StoreOrderErrors.css';
import './ReportingCycleType.css';
import '../reporting/ReportingDetailMutiDayGrid.css';
import '../ordering/Landing/OrderingCategories.css';
import { getOrderDate } from '../utility/getOrderDate';
import SpinnerComponent from '../shared/SpinnerComponent';
import { SINGLE_DAY, MULTI_DAY, NON_DAILY, GR, REPORT_GR, NON_DAILY_VENDOR } from '../../constants/ActionTypes';
import CustomDayPicker from '../dayPicker/CustomDayPicker';
import ReportingDetailPDF from '../printPdf/ReportingDetailsPDF'
import { storeDetails } from '../../lib/storeDetails'
import dateHelper, { convertStringToDate } from '../utility/DateHelper';

class ReportingDetailHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginData: {},
            selectedDay: convertStringToDate(dateHelper().orderBatchDate),
            selectedDateValue: convertStringToDate(dateHelper().orderBatchDate),
            reportingItemDetailsDate: {},
            selectedReportingData: new Map(),
            selectedCycletype: undefined,
            selectedCount: 0,
            selectedReportingItemKey: undefined,
            spinner: false,
            reportingItemDetails: {},
            disableDate:[]
        }
        this.onDayClickComplete = this.onDayClickComplete.bind(this);
    }

    onDayClickComplete(selectedDate) {
        const { selectedReportingItemKey } = this.props;
        let { selectedReportingData } = this.props;
        let params = selectedReportingData.get(selectedReportingItemKey) || selectedReportingData.get(NON_DAILY_VENDOR);
        params.orderDate = getOrderDate(selectedDate);
        params.isFirstPage = false;
        this.setState({ selectedDay: selectedDate, spinner: true });
        this.props.selectedDateValue(selectedDate);
        if (selectedReportingData.get(NON_DAILY_VENDOR)) {
            this.props.dispatch(getReportingItemVendorDetails(params));
        } else {
            this.props.dispatch(getReportingItemDetails(params));
        }      
    }

    componentDidMount() {
        const { loginData, selectedReportingData, selectedReportingItemKey, orderCycles, reportingItemDetails, reportingItemDetailsDate } = this.props;
        this.setState({
            loginData: loginData,
            selectedReportingData: selectedReportingData,
            selectedReportingItemKey: selectedReportingItemKey,
            orderCycles: orderCycles,
            reportingItemDetails: reportingItemDetails,
            reportingItemDetailsDate: reportingItemDetailsDate
            
        }, () => {
            const { selectedReportingData, selectedReportingItemKey } = this.state;
            if (selectedReportingData && selectedReportingItemKey && selectedReportingData instanceof Map ) {
                let params = selectedReportingData.get(selectedReportingItemKey) || selectedReportingData.get(NON_DAILY_VENDOR);
                let selectedValueDate=new Date(params && params.selectedDay);
                this.props.selectedDateValue(selectedValueDate);
                this.setState({ selectedDay:selectedValueDate });
            } else if( selectedReportingData && selectedReportingData instanceof Array && selectedReportingItemKey){
                let selectedReportingDataInstance = this.mapData(selectedReportingData);
                this.props.dispatch(getSelectedReportingData(selectedReportingDataInstance));
                this.setState({ selectedReportingData : selectedReportingDataInstance },()=>{
                    const { selectedReportingData, selectedReportingItemKey } = this.state;
                    let params = selectedReportingData.get(selectedReportingItemKey) || selectedReportingData.get(NON_DAILY_VENDOR);
                    let selectedValueDate=new Date(params && params.selectedDay);
                    this.props.selectedDateValue(selectedValueDate);
                    this.setState({ selectedDay: selectedValueDate });
                })
            }         
        });

    }

    mapData(dataToMap){
        let dataInstance = new Map();
        dataToMap.forEach((data)=>{
            if(data.length > 1){
                dataInstance.set(data[0],data[1]);
            }
        });
        return dataInstance;
    }

    componentWillReceiveProps(newProps){
        this.setState({
            spinner: false,
            reportingItemDetails: newProps.reportingItemDetails,
            reportingItemDetailsDate: newProps.reportingItemDetailsDate
        });
        this.loadDate();
    }

    loadDate = () => {
        const { reportingItemDetailsDate, orderCycles } = this.state;
        if (Object.keys(reportingItemDetailsDate).length !== 0) {
            let unavailableDates = [];
            let convertedDate = [];

            reportingItemDetailsDate[orderCycles[0] === REPORT_GR ? GR : orderCycles].unavailableDates.forEach(function (element, index) {
                convertedDate.push(convertStringToDate(element));
            });
            let availableDate = reportingItemDetailsDate[orderCycles[0] === REPORT_GR ? GR : orderCycles].availableDates;
            let afterDate = convertStringToDate(`${availableDate[0]}`);
            var currentDate = convertStringToDate(afterDate);
            currentDate.setDate(currentDate.getDate() - 60);
            
            let beforeDate =  currentDate;       
            let otherDate = {               
                before: beforeDate,
                after: afterDate,
                disabledate: convertedDate
            }
            unavailableDates.push(otherDate);
            this.setState({
                disabledDays: unavailableDates
            });
        }
    }

    render() {
        const { selectedReportingItemKey, loginData, spinner, reportingItemDetails, disabledDays } = this.state;
        const storeDetailsId = loginData && loginData.token && storeDetails() && storeDetails().storeId;
        const storeDetailsUser = loginData && loginData.token && storeDetails() && storeDetails().userId;
        return (
            <div className="reportingDetailHeader " >
                <div className="row header-row header-first-row " >
                    <div className="col-md-8">
                        <ReportingDetailPDF className="print-button print-button-state"
                            storeId={storeDetailsId ? storeDetails().storeId : ''}
                            employeeId={storeDetailsUser ? storeDetails().userId : ''}
                            reportDetails={ reportingItemDetails }
                            reportType={selectedReportingItemKey}
                            selectedDay={this.state.selectedDay}
                            id="btn-print"
                            type="button"> PRINT REPORT
                        </ReportingDetailPDF>
                    </div>
                    <div className="col-md-4">
                        {selectedReportingItemKey === SINGLE_DAY &&
                            <div className='cycle-type coloring-stripe-daily' >
                                <label className="daily"> <span>Daily</span></label>
                            </div>
                        }
                        {selectedReportingItemKey === MULTI_DAY &&
                            <div className='cycle-type coloring-stripe-multiday' >
                                <label className="daily"> <span>MultiDay</span></label>
                            </div>
                        }
                        {selectedReportingItemKey === NON_DAILY &&
                            <div className='cycle-type coloring-stripe-nonDaily' >
                                <label className="daily"> <span>NonDaily</span></label>
                            </div>
                        }
                        {selectedReportingItemKey === GR &&
                            <div className='cycle-type coloring-stripe-nonDaily' >
                                <label className="daily"> <span>Guided Replenishment</span></label>
                            </div>
                        }
                    </div>
                </div>
                <div className="row header-second-row ">
                    <div className="col-md-4">
                        <CustomDayPicker
                            onDayClickComplete={this.onDayClickComplete}
                            selectedDay={this.state.selectedDay}
                            disabledDays={disabledDays}
                        >
                        </CustomDayPicker>
                    </div>
                    <div className="col-md-5 promo-padding-reporting">
                        <div className="float-md-left">
                            <span className="promo-start">P+: Promo Start</span>
                            <span className="promo-on">P: Promo on</span>
                            <span className="promo-ends">P-: Promo Ends</span>
                        </div>
                    </div>
                    <div className="col-md-3 itemStatus-padding-reporting">
                        <div className="float-md-left">
                            <span className="bill-back" >$: Bill Back</span>
                            <span className="bill-back" >N: New</span>
                            <span className="bill-back" >D: Delete</span>
                        </div>
                    </div>
                </div>
                {spinner &&
                    <div className="item-detail-spinner-component">
                        <div className="item-detail-spinner">
                            <SpinnerComponent displaySpinner={spinner} />
                        </div>
                    </div>
                }
            </div >
        );
    }
}
const mapStateToProps = state => {
    return ({
        loginData: state.login.loginData.payload,
        orderCycles: state.reporting.reportingData.orderCycles ? state.reporting.reportingData.orderCycles : [],
        selectedReportingData: state.reporting.reportingData.selectedReportingData ? state.reporting.reportingData.selectedReportingData : undefined,
        reportingItemDetails: state.reporting.reportingItemDetails ? state.reporting.reportingItemDetails : {},
        reportingItemDetailsDate: state.reporting.reportingItemDetailsDate ? state.reporting.reportingItemDetailsDate : {}
    });
}

export default connect(mapStateToProps
)(withRouter(ReportingDetailHeader))
