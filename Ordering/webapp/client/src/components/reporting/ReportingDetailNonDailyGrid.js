import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './Reporting.css';
import './ReportingDetailHeader.css';
import '../dayPicker/CustomDayPicker';
import '../dayPicker/CustomDayPicker.css';
// import MessageBox from '../shared/MessageBox';
import SpinnerComponent from '../shared/SpinnerComponent';
import { NON_DAILY_VENDOR, NON_DAILY, CDC, DSD } from '../../constants/ActionTypes';
import { getItemStatus, getPromotionDetails, getBillback } from '../utility/promoInfo';
import './ReportingDetailNonDailyGrid.css'

class ReportingDetailNonDailyGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportingItemDetails: [],
            reportingItemDetailsVendor: [],
            reportingCategoryDetails: [],
            isCarried: true,
            isContinueEnabled: false,
            reportingVendorDetails: [],
            orderCycles: [],
            showModal: false,
            msgBoxBody: '',
            nonDailySpinner: false,
            nonDailyVendorSpinner: false
        }
    }

    componentDidMount() {
        const { reportingItemDetails, reportingItemDetailsVendor } = this.props;
        this.setState({
            reportingItemDetails: reportingItemDetails,
            reportingItemDetailsVendor: reportingItemDetailsVendor,
            nonDailySpinner: this.props.reportingItemDetails && this.props.reportingItemDetails.length > 0 ? false : true,
            nonDailyVendorSpinner: this.props.reportingItemDetailsVendor && this.props.reportingItemDetailsVendor.length > 0 ? false : true
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            reportingItemDetails: newProps.reportingItemDetails,
            reportingItemDetailsVendor: newProps.reportingItemDetailsVendor,
        }, () => {
            if (newProps && ((newProps.reportingItemDetails && newProps.reportingItemDetails.length > 0) || (newProps.reportingItemDetailsVendor && newProps.reportingItemDetailsVendor.CDC && newProps.reportingItemDetailsVendor.CDC.length > 0) || (newProps.reportingItemDetailsVendor && newProps.reportingItemDetailsVendor.DSD && newProps.reportingItemDetailsVendor.DSD.length > 0))) {
                this.setState({ nonDailySpinner: false, nonDailyVendorSpinner: false })
            }
        });
    }

    render() {
        const {
            reportingItemDetails,
            reportingItemDetailsVendor,
            // showModal,
            // msgBoxBody,
            nonDailySpinner,
            nonDailyVendorSpinner
        } = this.state;
        return (
            <div>
                <div>
                    <div className="reportingDetailGrid nondaily">
                        <div className="row grid-header-row">
                            <table className="table">
                                <thead>
                                    <tr className="row">
                                        <th className="col-md-2 grid-header align-middle">
                                            {
                                                reportingItemDetailsVendor && (reportingItemDetailsVendor.CDC || reportingItemDetailsVendor.DSD) ?
                                                    <div> <span className="bold">Category/Vendor, </span>Item Description</div>
                                                    :
                                                    <div><span className="bold">Category, </span>Item Description</div>
                                            }
                                        </th>
                                        <th className="col-md-1 grid-header align-middle"></th>
                                        <th className="col-md-1 grid-header align-middle">Item Number</th>
                                        <th className="col-md-4">
                                            <div className="row item-sales-trend-first-row-div">
                                                <div className="col">Item Sales Trend</div>
                                            </div>
                                            <div className="row item-sales-trend-second-row-div">
                                                <div className="col">FP 4</div>
                                                <div className="col">FP 3</div>
                                                <div className="col">FP 2</div>
                                                <div className="col">FP 1</div>
                                            </div>
                                        </th>
                                        <th className="col-md-1 grid-header align-middle">
                                            <div className="font-bold-header">F+</div>
                                            <div>Fore.</div>
                                        </th>
                                        <th className="col-md-1 grid-header align-middle">
                                            <div className="font-bold-header">M-</div>
                                            <div>Min</div>
                                        </th>
                                        <th className="col-md-1 grid-header align-middle">
                                            <div className="font-bold-header">I=</div>
                                            <div>Inven.</div>
                                        </th>
                                        <th className="col-md-1 grid-header align-middle" >
                                            <div className="font-bold-header">O</div>
                                            <div>Order</div>
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="row cat-table-parent-div table-wrapper-scroll-y" >
                                {
                                    reportingItemDetailsVendor && reportingItemDetailsVendor.CDC && reportingItemDetailsVendor.CDC.length > 0 &&
                                    reportingItemDetailsVendor.CDC.map((data, index) => {
                                        console.log(`selected data-->`, data)
                                        return (
                                            <table key={index} className="container reporting-cat-item-detail" >
                                                <thead>
                                                    <tr className="row " key={data.itemId} >
                                                        <th className="col-md-3 coloring-stripe-nondaily cat-item-table-text" data-label="Group,Category">
                                                            {CDC + '-' + data.categoryName}
                                                        </th>
                                                        <th className="col-md-2 cat-item-table-text-light" >
                                                            <span>Device: {data.device} </span>
                                                        </th>
                                                        <th className="col-md-4 cat-item-table-text-light" >
                                                            Order Writer: {data.orderWriter}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data.items && data.items.length > 0 &&
                                                        data.items.map((item, index) => {
                                                            return (
                                                                <tr key={index} className="row tr-cat deatailsTd-first">
                                                                    <td className="col-md-2 deatailsTd-other leftAlign">{item.itemName}</td>
                                                                    <td className="col-md-1">
                                                                        {getPromotionDetails(item.promotion)}
                                                                        <span className="nonDaily-span-spacing">{getBillback(item.isBillBackAvailable)}</span>
                                                                        <span className="nonDaily-span-spacing">{getItemStatus(item.itemStatus)}</span>
                                                                    </td>
                                                                    <td className="col-md-1 ">{item.itemId}</td>
                                                                    <td className="col-md-4" >
                                                                        <div className="row forecast-period-div">
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-md-1" >{item.tomorrowSalesForecastQty}</td>
                                                                    <td className="col-md-1" >{item.minimumOnHandQty}</td>
                                                                    <td className="col-md-1" >{item.carryOverInventoryQty}</td>
                                                                    <td className="orderQuantity" >{item.itemOrderQty}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        );
                                    })
                                }

                                {
                                    reportingItemDetailsVendor && reportingItemDetailsVendor.DSD && reportingItemDetailsVendor.DSD.length > 0 &&
                                    reportingItemDetailsVendor.DSD.map((data, index) => {
                                        console.log(`selected data-->`, data)
                                        return (
                                            <table key={index} className="container reporting-cat-item-detail" >
                                                <thead>
                                                    <tr className="row " key={data.itemId} >
                                                        <th className="col-md-3 coloring-stripe-nondaily cat-item-table-text" data-label="Group,Category">
                                                            {DSD + '-' + data.vendorName}
                                                        </th>
                                                        <th className="col-md-2 cat-item-table-text-light" >
                                                            <span>Device: {data.device} </span>
                                                        </th>
                                                        <th className="col-md-4 cat-item-table-text-light" >
                                                            Order Writer: {data.orderWriter}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data.items && data.items.length > 0 &&
                                                        data.items.map((item, index) => {
                                                            return (
                                                                <tr key={index} className="row tr-cat deatailsTd-first">
                                                                    <td className="col-md-2 deatailsTd-other leftAlign">{item.itemName}</td>
                                                                    <td className="col-md-1">
                                                                        {getPromotionDetails(item.promotion)}
                                                                        <span className="nonDaily-span-spacing">{getBillback(item.isBillBackAvailable)}</span>
                                                                        <span className="nonDaily-span-spacing">{getItemStatus(item.itemStatus)}</span>
                                                                    </td>
                                                                    <td className="col-md-1 ">{item.itemId}</td>
                                                                    <td className="col-md-4" >
                                                                        <div className="row forecast-period-div">
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-md-1" >{item.tomorrowSalesForecastQty}</td>
                                                                    <td className="col-md-1" >{item.minimumOnHandQty}</td>
                                                                    <td className="col-md-1" >{item.carryOverInventoryQty}</td>
                                                                    <td className="orderQuantity" >{item.itemOrderQty}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        );
                                    })
                                }

                                {
                                    (reportingItemDetails && reportingItemDetails.length) > 0 &&
                                    (reportingItemDetails.map((data, index) => {
                                        console.log(`selected data-->`, data)
                                        return (
                                            <table key={index} className="container reporting-cat-item-detail" >
                                                <thead>
                                                    <tr className="row " key={data.itemId} >
                                                        <th className="col-md-3 coloring-stripe-nondaily cat-item-table-text" data-label="Group,Category">
                                                            {data.categoryName}
                                                        </th>
                                                        <th className="col-md-2 cat-item-table-text-light" >
                                                            <span>Device: {data.device} </span>
                                                        </th>
                                                        <th className="col-md-4 cat-item-table-text-light" >
                                                            Order Writer: {data.orderWriter}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        (data.items && data.items.length > 0) &&
                                                        data.items.map((item, index) => {
                                                            return (
                                                                <tr key={index} className="row tr-cat deatailsTd-first">
                                                                    <td className="col-md-2 deatailsTd-other leftAlign">{item.itemName}</td>
                                                                    <td className="col-md-1">
                                                                        {getPromotionDetails(item.promotion)}
                                                                        <span className="nonDaily-span-spacing">{getBillback(item.isBillBackAvailable)}</span>
                                                                        <span className="nonDaily-span-spacing">{getItemStatus(item.itemStatus)}</span>
                                                                    </td>
                                                                    <td className="col-md-1 ">{item.itemId}</td>
                                                                    <td className="col-md-4" >
                                                                        <div className="row forecast-period-div">
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-md-1" >{item.tomorrowSalesForecastQty}</td>
                                                                    <td className="col-md-1" >{item.minimumOnHandQty}</td>
                                                                    <td className="col-md-1" >{item.carryOverInventoryQty}</td>
                                                                    <td className="orderQuantity" >{item.itemOrderQty}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        );
                                    }))
                                }
                                {
                                    ((!nonDailySpinner && !nonDailyVendorSpinner && !reportingItemDetails && !reportingItemDetailsVendor) && <span className="reporting-no-data-indicator  no-data-indicator">No Data Available</span>)
                                }

                            </div>
                        </div>
                        {nonDailySpinner &&
                            <div className="nonDaily-spinner-component">
                                <div className="nonDaily-spinner">
                                    <SpinnerComponent displaySpinner={nonDailySpinner} />
                                </div>
                            </div>
                        }

                        {nonDailyVendorSpinner &&
                            <div className="nonDaily-spinner-component">
                                <div className="nonDaily-spinner">
                                    <SpinnerComponent displaySpinner={nonDailyVendorSpinner} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div>
                    {/* {showModal &&
                        <MessageBox
                            msgTitle=""
                            msgBody={msgBoxBody}
                            className={"message-box-reporting"}
                            initialModalState={false}
                            reporting={true}
                        />
                    } */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return ({
        reportingItemDetails: state.reporting.reportingItemDetails && state.reporting.reportingItemDetails[NON_DAILY] ? state.reporting.reportingItemDetails[NON_DAILY] : [],
        reportingItemDetailsVendor: state.reporting.reportingItemDetails && state.reporting.reportingItemDetails[NON_DAILY_VENDOR] ? state.reporting.reportingItemDetails[NON_DAILY_VENDOR] : []
    });
}

export default connect(
    mapStateToProps
)(withRouter(ReportingDetailNonDailyGrid))