import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './Reporting.css';
import './ReportingDetailHeader.css';
import '../dayPicker/CustomDayPicker';
import '../dayPicker/CustomDayPicker.css';
import { getItemStatus, getPromotionDetails, getBillback } from '../utility/promoInfo';
import GRMockData from '../../assets/mocks/GR.json';
import SpinnerComponent from '../shared/SpinnerComponent';
import { GR } from '../../constants/ActionTypes';
import './ReportingDetailGRGrid.css'

class ReportingDetailGRGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grData: [],
            reportingItemDetails: [],
            grSpinner: false
        }
    }

    componentDidMount() {
        const { reportingItemDetails } = this.props;
        this.setState({
            grData: GRMockData,
            reportingItemDetails: reportingItemDetails ? reportingItemDetails : [],
            grSpinner: this.props.reportingItemDetails && this.props.reportingItemDetails.length > 0 ? false : true });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            grData: GRMockData,
            reportingItemDetails: newProps.reportingItemDetails ? newProps.reportingItemDetails : []
        }, () => {
            if (this.state.reportingItemDetails && this.state.reportingItemDetails.length > 0) {
                this.setState({ grSpinner: this.state.reportingItemDetails && this.state.reportingItemDetails.length > 0 ? false : true })
            }
        });
    }

    render() {
        const { reportingItemDetails, grSpinner } = this.state;
        return (
            <div>
                <div className="reportingDetailGRGrid">
                    <div className="row grid-header-row">
                        <table className="table" >
                            <thead>
                                <tr className="row">
                                    <th className="col-md-2 grid-header align-middle">
                                        <span className="bold">Category, </span>Item Description </th>
                                    <th className="col-md-1 grid-header align-middle"></th>
                                    <th className="col-md-1 grid-header align-middle">Item Number</th>
                                    <th className="col-md-4" >
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
                                        <div className="font-bold-header">Prj F+</div>
                                        <div>Prj. Fore.</div>
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
                                reportingItemDetails && reportingItemDetails.length > 0 ? reportingItemDetails.map((data, index) => {
                                    return (
                                        <table key={index} className="container reporting-cat-item-detail" >
                                            <thead>
                                                <tr className="row">
                                                    <th className="col-md-3 coloring-stripe-gr cat-item-table-text" data-label="Group,Category">
                                                        {data.categoryName}
                                                    </th>
                                                    <th className="col-md-2 cat-item-table-text-light" >
                                                        Device: {data.device}
                                                    </th>
                                                    <th className="col-md-4 cat-item-table-text-light" >
                                                        Order Approved By: {data.orderWriter}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.items && data.items.map((item, childIndex) => {
                                                        return (
                                                            <tr key={childIndex} className="row tr-cat deatailsTd-first">
                                                                <td className="col-md-2 deatailsTd-other leftAlign">{item.itemName}</td>
                                                                <td className="col-md-1">
                                                                    {getPromotionDetails(item.promotion)}
                                                                    <span className="gr-span-spacing">{getBillback(item.isBillBackAvailable)}</span>
                                                                    <span className="gr-span-spacing">{getItemStatus(item.itemStatus)}</span>
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
                                }) : ((!grSpinner) && <span className="reporting-no-data-indicator  no-data-indicator">No Data Available</span>)
                            }
                        </div>
                    </div>        
                </div>
                {grSpinner &&
                    <div className="gr-spinner-component">
                        <div className="gr-spinner">
                            <SpinnerComponent displaySpinner={grSpinner} />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return ({
        reportingItemDetails: state.reporting.reportingItemDetails && state.reporting.reportingItemDetails[GR] ? state.reporting.reportingItemDetails[GR] : []
    });
}

export default connect(
    mapStateToProps
)(withRouter(ReportingDetailGRGrid))