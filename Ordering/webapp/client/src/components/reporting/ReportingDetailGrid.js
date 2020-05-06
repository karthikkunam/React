import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './Reporting.css';
import './ReportingDetailHeader.css';
import '../dayPicker/CustomDayPicker';
import '../dayPicker/CustomDayPicker.css';
import { SINGLE_DAY, MULTI_DAY, NON_DAILY } from '../../constants/ActionTypes';
import { getPromoCode, getBillCode } from '../utility/promoInfo';
import './ReportingDetailGrid.css'

class ReportingDetailGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportingItemDetails: [],
            reportingCategoryDetails: [],
            reportingDetailsHeader: [],
            reportingCategoryDetails: {},
            isCarried: true,
            isContinueEnabled: false,
            orderByVendor: false,
            reportingVendorDetails: [],
            orderCycles: [SINGLE_DAY, MULTI_DAY, NON_DAILY]
        }
    }

    componentDidMount() {
        const { reportingItemDetails, reportingCategoryDetails, reportingVendorDetails, orderCycles } = this.props;
        this.setState({
            reportingItemDetails: reportingItemDetails,
            reportingCategoryDetails: reportingCategoryDetails,
            reportingVendorDetails: reportingVendorDetails,
            orderCycles: orderCycles
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            OrderingCycleType: newProps.OrderingCycleType,
            reportingItemDetails: newProps.reportingItemDetails,
            orderCycles: newProps.orderCycles,
            reportingCategoryDetails: newProps.reportingCategoryDetails,
            reportingVendorDetails: newProps.reportingVendorDetails,
        });
    }

    getPromoAndBillInfo = (promo, bill) => {
        return getPromoCode(promo) + getBillCode(bill);
    }

    render() {
        const { reportingItemDetails } = this.state;
        const THIS = this;
        return (
            <div className="reportingDetailGrid " >
                <div className="row  grid-header-row ">
                    <table className="table" >
                        <thead>
                            <tr className="row " >
                                <th className="col-md-3 grid-header align-middle ">
                                    <span className="bold">Category, </span>Item Description </th>
                                <th className="col-md-1 grid-header align-middle"></th>
                                <th className="col-md-2 grid-header align-middle">Item Number</th>
                                <th className="col-md-5" >
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
                                <th className="col-md-1 grid-header align-middle" >Order</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="row cat-table-parent-div table-wrapper-scroll-y" >
                        {
                            reportingItemDetails && reportingItemDetails.length > 0 ?
                                reportingItemDetails.map((data) => {
                                    return (
                                        <table key={data.groupCode} className="reporting-cat-item-detail" >
                                            <thead>
                                                <tr className="row " key={data.itemId} >
                                                    <th className="col-md-3 coloring-stripe-singleday cat-item-table-text" data-label="Group,Category">
                                                        {data.name}
                                                    </th>
                                                    <th className="col-md-2 cat-item-table-text-light" >
                                                        <span>Device:{data.device} </span>
                                                    </th>
                                                    <th className="col-md-4 cat-item-table-text-light" >
                                                        Order Writter : {data.orderWriter}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.items && data.items.length > 0 ?
                                                        data.items.map((item) => {
                                                            let promoBillInfo = this.getPromoAndBillInfo(item.promotion, "");
                                                            return (
                                                                <tr className="row tr-cat">
                                                                    <td className="col-md-3 td-cat">{item.itemName}</td>
                                                                    <td className="col-md-1">{promoBillInfo}</td>
                                                                    <td className="col-md-2 ">{item.itemId}</td>
                                                                    <td className="col-md-5" >
                                                                        <div className="row forecast-period-div">
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod4 ? item.forecastPeriod4 : item.forecastHistory ? item.forecastHistory.fp4 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod3 ? item.forecastPeriod3 : item.forecastHistory ? item.forecastHistory.fp3 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod2 ? item.forecastPeriod2 : item.forecastHistory ? item.forecastHistory.fp2 : null}</div>
                                                                            <div className="col cat-forecast-period "> {item.forecastPeriod1 ? item.forecastPeriod1 : item.forecastHistory ? item.forecastHistory.fp1 : null}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td >{item.itemOrderQty}</td>
                                                                </tr>
                                                            );
                                                        }) : ""
                                                }
                                            </tbody>
                                        </table>
                                    );
                                }) : ""
                        }
                    </div>
                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return ({
        reportingItemDetails: state.reporting.reportingData && state.reporting.reportingData.reportingItemDetails
            ? state.reporting.reportingData.reportingItemDetails[0] : {},
        reportingVendorDetails: state.reporting && state.reporting.reportingData && state.reporting.reportingData.reportingVendorDetails && state.reporting.reportingData.reportingVendorDetails[0] ? state.reporting.reportingData.reportingVendorDetails[0] : {},
        reportingCategoryDetails: state.reporting && state.reporting.reportingData && state.reporting.reportingData.reportingDetails && state.reporting.reportingData.reportingDetails[0] ? state.reporting.reportingData.reportingDetails[0] : {},
        isCarried: state.ordering.getOrderingCategoriesInfo && state.ordering.getOrderingCategoriesInfo.payload ? state.ordering.getOrderingCategoriesInfo.payload.isCarried : ''
    });
}

export default connect(
    mapStateToProps
)(withRouter(ReportingDetailGrid))