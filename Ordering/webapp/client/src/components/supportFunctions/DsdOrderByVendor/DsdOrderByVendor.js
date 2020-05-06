import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as moment from 'moment-timezone';
import '../../ordering/OrderingHome.css';
import '../common/supportFunctions.css';
import '../../ordering/Landing/OrderingCategories.css';
import './DsdOrderByVendor.css';
import SideNavBar from '../../shared/SideNavBar';
import { getOrderHistory, dsdSetSelectedOrders } from '../../../actions/index';
import SpinnerComponent from '../../shared/SpinnerComponent';
import { storeDetails } from '../../../lib/storeDetails';
import { getTimeZone } from '../../utility/DateHelper';

export class DsdOrderByVendor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginData: [],
      parentCollapse: false,
      isPreviousEnabled: true,
      DsdOrderByVendorSpinner: false,
      timeZone: storeDetails() && storeDetails().timeZone ? getTimeZone(storeDetails().timeZone) : "UTC"
    }

    /* Added to reset the default image on login page*/
    document.querySelector("body").style.backgroundImage = 'none';
  }

  componentDidMount() {
    this.setState({ DsdOrderByVendorSpinner: true });
    this.setState({
      loginData: this.props.loginData,
      OrderHistoryByVendor: this.props.OrderHistoryByVendor,
    }, () => {
      const { loginData } = this.state;
      // if (!this.props.OrderHistoryByVendor.length) {
        this.props.dispatch(getOrderHistory(loginData.storeId));     
      // }
    })
  }

  parentCollapse() {
    this.setState({ parentCollapse: !this.state.parentCollapse })
  }

  parentSelectionUpdated(parentIndex, OrderHistoryByVendor) {
    OrderHistoryByVendor[parentIndex] && OrderHistoryByVendor[parentIndex].orderDetails.forEach(function (value) {
      value.isSelectedByUser = OrderHistoryByVendor[parentIndex].isSelectedByUser
    });
    this.setState({ OrderHistoryByVendor: OrderHistoryByVendor });
  }

  onChangeParentChkBox(index) {
    let { OrderHistoryByVendor } = this.state
    if (!OrderHistoryByVendor[index].hasOwnProperty("isSelectedByUser")) {
      OrderHistoryByVendor[index].isSelectedByUser = true;
    } else {
      OrderHistoryByVendor[index].isSelectedByUser = !OrderHistoryByVendor[index].isSelectedByUser;
    }
    this.setState({ OrderHistoryByVendor: OrderHistoryByVendor }, () => {
      this.parentSelectionUpdated(index, OrderHistoryByVendor)
    })

  }

  checkAllChildsSelected(parentIndex, childIndex, data) {
    let count = 0;

    if (data[parentIndex] && data[parentIndex].orderDetails) {
      data[parentIndex] && data[parentIndex].orderDetails.forEach(function (value) {
        if (value && value.isSelectedByUser) {
          count++;
        }
      })
    }

    if (data[parentIndex].orderDetails.length === count) {
      data[parentIndex].isSelectedByUser = true;
    } else {
      data[parentIndex].isSelectedByUser = false;
    }
    this.setState({ OrderHistoryByVendor: data });
  }

  onChangeChildChkBox(childIndex, index) {
    let { OrderHistoryByVendor } = this.state

    if (!OrderHistoryByVendor[index].orderDetails[childIndex].hasOwnProperty("isSelectedByUser")) {
      OrderHistoryByVendor[index].orderDetails[childIndex].isSelectedByUser = true;
    } else {
      OrderHistoryByVendor[index].orderDetails[childIndex].isSelectedByUser = !OrderHistoryByVendor[index].orderDetails[childIndex].isSelectedByUser;
    }
    this.setState({ OrderHistoryByVendor: OrderHistoryByVendor }, () => {
      this.checkAllChildsSelected(index, childIndex, OrderHistoryByVendor);
    });
  }

  childCollapse(index) {
    let { OrderHistoryByVendor } = this.state

    if (!OrderHistoryByVendor[index].hasOwnProperty("isExpanded")) {
      OrderHistoryByVendor[index].isExpanded = false;
      this.setState({ OrderHistoryByVendor: OrderHistoryByVendor })
    } else {
      OrderHistoryByVendor[index].isExpanded = !OrderHistoryByVendor[index].isExpanded;
      this.setState({ OrderHistoryByVendor: OrderHistoryByVendor })
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      loginData: newProps.loginData,
      OrderHistoryByVendor: newProps.OrderHistoryByVendor
    }, () => {
      // if ((newProps && newProps.OrderHistoryByVendor) || (newProps && newProps.OrderHistoryByVendor.length === 0)) {
        // this.setState({ DsdOrderByVendorSpinner: false });
      // }
      this.setState({ DsdOrderByVendorSpinner: false });
    })
  }

  checkIfVendorNameExists(vendorName) {
    if (vendorName === 'N/A' || vendorName === null || typeof (vendorName) === 'undefined') {
      return 'No Name'
    }
    return vendorName
  }

  renderHistoryTable = () => {
    const { OrderHistoryByVendor, parentCollapse, DsdOrderByVendorSpinner, timeZone } = this.state;
    return (
      <div className="history-table">
        <table className="history-header">
          <thead>
            <tr>
              <th className="col-8 col-md-8 history-header-label"><span className="bold">Vendor,</span> Order date</th>
              <th className="col-1 col-md-1 history-header-label">Number of Items Ordered</th>
              <th className="col-2 col-md-2 history-header-label">Delivery Date</th>
              <th className="col-1 col-md-1">
                <i onClick={() => this.parentCollapse()} className={this.state.parentCollapse === true ? 'fa fa-angle-down cat-arrow-landing mg-right-history' : 'fa fa-angle-up cat-arrow-landing mg-right-history'}></i>
              </th>
            </tr>
          </thead>
        </table>
        <div className="history-body">
          {!DsdOrderByVendorSpinner && (OrderHistoryByVendor && OrderHistoryByVendor.length === 0) &&
            <span className="DSD-no-data-indicator no-data-indicator">No Data Available</span>
          }
          {
            OrderHistoryByVendor && OrderHistoryByVendor.length > 0 &&
            (OrderHistoryByVendor.map((vendor, index) => {
              return (
                <table className="vendor-detail-view" key={index}>
                  <thead className="order-border-bottom">
                    <tr className="vendor-name">
                      <td className="col-8 col-md-8 history-vendor-name coloring-stripe-Nondaily">
                        <label id={`vendor-${index}`} className="group-checkbox"> {this.checkIfVendorNameExists(vendor.vendorName)}
                          <input type="checkbox" onClick={() => this.onChangeParentChkBox(index)} name={`vendor-${index}`} value={`vendor-${index}`} checked={vendor.isSelectedByUser ? vendor.isSelectedByUser : false} onChange={() => this.render()} />
                          <span className="group-checkmark"></span>
                        </label>
                      </td>
                      <td className="col-2 col-md-2"></td>
                      <td className="col-1 col-md-1"></td>
                      <td className="col-1 col-md-1">
                        <i onClick={() => this.childCollapse(index)}
                          className={(vendor.hasOwnProperty("isExpanded") &&
                            vendor.isExpanded === false) ? 'fa fa-angle-down cat-arrow2 mg-left' : 'fa fa-angle-up cat-arrow2 mg-left rmv-left'}>
                        </i>
                      </td>
                    </tr>
                  </thead>

                  {
                    vendor && !parentCollapse && (vendor.hasOwnProperty("isExpanded") ? vendor.isExpanded : true) && vendor.orderDetails.map((orderDetails, childIndex) => {
                      return (
                        <tbody key={childIndex}>
                          <tr className="order-border-bottom">

                            <td className="col-8 col-md-8 history-order-detail">{moment(orderDetails.orderWindowEndDate).format("MM/DD/YYYY")}
                              <label id={`order-detail-${childIndex}`} className="group-checkbox order-group-checkbox">
                                <input type="checkbox" onClick={() => this.onChangeChildChkBox(childIndex, index)} checked={orderDetails.isSelectedByUser ? orderDetails.isSelectedByUser : false} name={`order-detail-${childIndex}`} value={`order-detail-${childIndex}`} onChange={() => this.render()} />
                                <span className="group-checkmark group-checkmark-span"></span>
                              </label>
                            </td>
                            <td className="col-2 col-md-2 history-order-detail">{orderDetails.itemsOrdered}</td>
                            <td className="col-1 col-md-1 history-order-detail">{moment.tz(orderDetails.deliveryDate, timeZone).format("MM/DD/YYYY")}</td>
                            <td className="col-1 col-md-1"></td>
                          </tr>
                        </tbody>
                      )

                    })
                  }
                </table>
              )
            })
            )
          }
        </div>
      </div>
    )
  }
  onClickPrevious = () => {
    this.props.history.push('/home');
  }

  hasAnySelected(OrderHistoryByVendor = []) {
    let selectedOrders = OrderHistoryByVendor.map((vendor = { orderDetails: [] }) => vendor.orderDetails.filter(order => order.isSelectedByUser).map(filterdOrder => { return { ...filterdOrder, vendorCode: vendor.merchandiseVendorCode } })).filter(list => list.length);
    return selectedOrders.length;
  }

  onClickNext() {
    // get selected categories and items
    const { OrderHistoryByVendor = [] } = this.state;
    let selectedOrders = OrderHistoryByVendor.map((vendor = { orderDetails: [] }) => vendor.orderDetails.filter(order => order.isSelectedByUser).map(filterdOrder => { return { ...filterdOrder, vendorCode: vendor.merchandiseVendorCode } })).filter(list => list.length)
    const flattenedOrders = _.flatten(selectedOrders);
    this.props.dispatch(dsdSetSelectedOrders(this.props.loginData.storeId, flattenedOrders));
    this.props.history.push('./dsdOrderDetails');
  }

  renderFooter = () => {
    return (
      <div className="ordering-prev">
        {
          this.state.isPreviousEnabled ?
            <button id="btn-prev" type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious}>PREVIOUS</button> : ''
        }

        <button id="btn-next" disabled={!this.hasAnySelected(this.props.OrderHistoryByVendor)} type="button" className="btn btn-next d-none d-md-block d-lg-block" onClick={this.onClickNext.bind(this)}>NEXT</button>

      </div>
    )
  }

  render() {
    const { DsdOrderByVendorSpinner } = this.state;
    return (
      <div className="vendor-history full-height">
        <div className="full-height" style={{ margin: "0" }}>
          <SideNavBar id="ordering-home" val={this.state.selectedStoreFunction}>
            <div className="heading-desktop">
              <span className="ordering-heading">
                <span className="store-Info">STORE {this.state.loginData.storeId}</span>
                DSD ELECTRONIC ORDER BY VENDOR
            </span>
            </div>
            {this.renderHistoryTable()}

            {DsdOrderByVendorSpinner &&
              <div className="ordering-home-spinner">
                <SpinnerComponent displaySpinner={DsdOrderByVendorSpinner} />
              </div>
            }
          </SideNavBar>
        </div>
        {this.renderFooter()}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return ({
    loginData: state.login.loginData.payload,
    OrderHistoryByVendor: state.storeFunctions && state.storeFunctions.orderHistoryVendor && state.storeFunctions.orderHistoryVendor.payload && state.storeFunctions.orderHistoryVendor.payload.data && state.storeFunctions.orderHistoryVendor.payload.data.body ? state.storeFunctions.orderHistoryVendor.payload.data.body : []
  });
}

export default connect(
  mapStateToProps,
)(withRouter(DsdOrderByVendor))