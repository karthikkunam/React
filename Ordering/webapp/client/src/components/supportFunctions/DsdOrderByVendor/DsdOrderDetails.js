import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SideNavBar from '../../shared/SideNavBar';
import BootstrapTable from 'react-bootstrap-table-next';
import SpinnerComponent from '../../shared/SpinnerComponent';
import '../../ordering/OrderingHome.css';
import '../common/supportFunctions.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './DsdOrderDetails.css'
import ReactTooltip from 'react-tooltip';
import { dsdLoadOrderDetails, getOrderHistory } from '../../../actions/index';
import DSDOrderByVendorPDF from '../../printPdf/DsdOrderByVendorPDF';
import moment from 'moment';
import { storeDetails } from '../../../lib/storeDetails'

const sortCaret = (order, column) => {
  if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
  else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
  else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
  return null;
}

export class DsdOrderDetails extends React.Component {

  constructor(props) {
    super(props);
    this.onSortChange = this.onSortChange.bind(this); 
    this.dataTableRef = React.createRef()

    this.state = {
      loginData: [],
      isNextEnabled: props.selectedOrders && props.selectedOrders.length > 0,
      currentOrderIndex: 0,
      sortName:[], 
      sortOrder:[], 

      columns: [{
        dataField: 'itemId',
        text: 'Item Number',
        sort: true,
        headerTitle: true,
        sortCaret: sortCaret,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '15%'        
        },
        headerClasses: 'error-table-column-header bold',
        classes: 'error-table-column-data',
        onSort:this.onSortChange
      },
      {
        dataField: 'itemName',
        text: 'Item Description',
        sort: true,
        title: true,
        sortCaret: sortCaret,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '25%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
      }, {
        dataField: 'itemClassShort',
        text: 'Product Class',
        sort: true,
        sortCaret: sortCaret,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
      }, {
        dataField: 'itemOrderQty',
        text: 'Vendor Order Quantity',
        sort: true,
        sortCaret: sortCaret,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data'
      },
      {
        dataField: 'ldu',
        text: 'LDU',
        sort: true,
        sortCaret: sortCaret,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '8%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
      },
      {
        dataField: 'itemUPC',
        text: 'UPC',
        sort: true,
        sortCaret: sortCaret,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
      }]
    }

  }

  onSortChange(name, order) {
    console.log('sort has been called!', arguments);
    const sortName = [];
    const sortOrder = [];

    for (let i = 0; i < this.state.sortName.length; i++) {
      if (this.state.sortName[i] !== name) {
        sortName.push(this.state.sortName[i]);
        sortOrder.push(this.state.sortOrder[i]);
      }
    }

    sortName.push(name);
    sortOrder.push(order);
    this.setState({
      sortName,
      sortOrder
    });
  }

  cleanSort() {
    this.setState({
      sortName: [],
      sortOrder: []
    });
  }

  loadOrderDetails(index) {
    const currentOrderIndex = index || this.state.currentOrderIndex;
    const currentSelectedOrder = this.props.selectedOrders[currentOrderIndex];
    if (currentSelectedOrder) {
      const { vendorCode, orderWindowEndDate } = currentSelectedOrder;
      const storeId = this.props.loginData ? this.props.loginData.storeId : '';
      this.props.dispatch(dsdLoadOrderDetails(storeId, vendorCode, orderWindowEndDate));
    }
  }

  componentDidMount() {
    this.loadOrderDetails();
  }

  onClickPrevious() {
    const { currentOrderIndex } = this.state;
    if (currentOrderIndex === 0) {
      this.props.history.goBack();
      this.props.dispatch(getOrderHistory(this.props.loginData.storeId));
    } else {
      this.setState({ currentOrderIndex: currentOrderIndex - 1 })
      this.loadOrderDetails();
    }
  }
  onClickNext() {
    const { selectedOrders } = this.props;
    const { currentOrderIndex } = this.state;
    if (currentOrderIndex < selectedOrders.length - 1) {
      this.loadOrderDetails(currentOrderIndex + 1);
      this.setState({ currentOrderIndex: currentOrderIndex + 1 });
    }
    else {
      this.props.history.push('/supportfunctions/dsd-order-by-vendor');
      this.props.dispatch(getOrderHistory(this.props.loginData.storeId));
    }
  }

  renderFooter() {
    return (
      <div className="ordering-prev">
        {
          <button id="btn-prev" type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious.bind(this)}>PREVIOUS</button>
        }
        {
          <button id="btn-next" type="button" className="btn btn-next d-none d-md-block d-lg-block" onClick={this.onClickNext.bind(this)}>{this.state.currentOrderIndex === this.props.selectedOrders.length - 1 ? 'DONE' : 'NEXT'}</button>
        }
      </div>
    )
  }
  printPDF(){
    console.log("printpdf has been called!", this.dataTableRef.current.table.getData())
  }

  checkIfVendorNameExists(vendorName){
    if(vendorName === 'N/A' || vendorName === null || typeof(vendorName) === 'undefined'){
      return 'No Name'
    }
    return vendorName
  }

  checkIfVendorAddressExists(vendorAddress){
    if(vendorAddress === 'N/A' || vendorAddress === null || typeof(vendorAddress) === 'undefined'){
      return (
        <div className="address-container">
          <div>No Address Available</div>
        </div>
      )
    }else{
      return (
        <div className="address-container">
          <div>{`${vendorAddress.streetAddress1} ${vendorAddress.streetAddress2}`}</div>
          <div>{`${vendorAddress.city} ${vendorAddress.state} ${vendorAddress.zip}`}</div>
          <div>{`${vendorAddress.phone}`}</div>
        </div>
      )
    }
  }

  render() {
    const { currentOrderIndex } = this.state;
    const { columns } = this.state;
    const { orders = {}, loginData } = this.props;
    const rowClasses = "error-table-row";
    const currentSelectedOrder = this.props.selectedOrders[currentOrderIndex];
    let itemDetails = [], vendorAddress, vendorName, vendorCode, orderWindowEndDate, deliveryDate;
    const storeDetailsId = loginData && loginData.token && storeDetails() && storeDetails().storeId;
    const storeDetilasUser = loginData && loginData.token && storeDetails() && storeDetails().userId;
    // const storeDetilasUser = loginData && loginData.token && storeDetails() && storeDetails().fullName;
    if (currentSelectedOrder) {
      orderWindowEndDate = currentSelectedOrder.orderWindowEndDate;
      deliveryDate = currentSelectedOrder.deliveryDate;
      vendorCode = currentSelectedOrder.vendorCode;
      const storeId = this.props.loginData ? this.props.loginData.storeId : '';
      const indexKey = `${storeId}-${vendorCode}-${orderWindowEndDate}`;
      const currentOrder = orders ? orders[indexKey] : null;
      if (currentOrder) {
        vendorAddress = currentOrder.vendorAddress;
        vendorName = currentOrder.vendorName;
        itemDetails = currentOrder.orderDetails && currentOrder.orderDetails.length ? currentOrder.orderDetails[0].itemDetails : []
      }
    }

    const options = {
      // reassign the multi sort list by an Array
      // if you dont want to control al the sort list, you can only assign the String to sortName and sort Order
      sortName: this.state.sortName,
      sortOrder: this.state.sortOrder,
      onSort: this.onSortChange
    };
     

    return (
      <div className="StoreOrderErrors dsd-vendor-history full-height">
        <div className="full-height" style={{ margin: "0" }}>
          <SideNavBar id="ordering-home" val={this.state.selectedStoreFunction}>
            <div className="heading-desktop">
              <span className=" ordering-heading">
              <span className="store-Info">STORE {this.props.loginData.storeId}</span>
                DSD ELECTRONIC ORDER BY VENDOR
              </span>
            </div>
              {
                this.props.isLoading  ? (
                  <div className="ordering-home-spinner">
                    <SpinnerComponent displaySpinner={this.props.isLoading} /> 
                    </div>
                ) :  
                <div className="vendor-container">
                  <div className="flex-container SupportFunctions row no-side-padding">
                   
                  <DSDOrderByVendorPDF
                    className="print-pdf"
                    // employeeId={storeDetilasUser ? storeDetails().fullName : ''}
                    employeeId={storeDetilasUser ? storeDetails().userId : ''} 
                    storeId={storeDetailsId ? storeDetails().storeId : ''} 
                    orders={itemDetails} 
                    vendorName={vendorName} 
                    vendorId={vendorCode} 
                    orderDate={orderWindowEndDate}  
                    deliveryDate={deliveryDate} 
                  >
                    PRINT REPORT
                  </DSDOrderByVendorPDF>    
                    <div className="item-name-active" href="#" data-tip='' data-for="vendorPopup">{this.checkIfVendorNameExists(vendorName)} </div>
                    <label className="items-list">Vendor #: <span className="items-value">{vendorCode}</span></label>
                    <label className="items-list"> Order Date <span className="items-value">{moment(orderWindowEndDate).format("MM/DD/YYYY")}</span></label>
                    <label className="items-list">Delivery Date: <span className="items-value">{moment(deliveryDate).format("MM/DD/YYYY")}</span></label>
                  </div>
                  <ReactTooltip className="item-detail-info" place="bottom" id='vendorPopup' type='light' disabled={true} effect="solid" globalEventOff='' event=''>
                    {
                      this.checkIfVendorAddressExists(vendorAddress)
                    }
                  </ReactTooltip>
                  <BootstrapTable 
                    ref={this.dataTableRef}
                    options={ options }
                    rowClasses={rowClasses}
                    keyField='itemId'
                    data={itemDetails}
                    columns={columns}
                    noDataIndication="No Data Available"
                    loading={this.props.isLoading}
                    bootstrap4={true}
                    id = "vendor_table"
                  />
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
    selectedOrders: state.storeFunctions && state.storeFunctions.orderHistoryVendor && state.storeFunctions.orderHistoryVendor.selectedOrders ? state.storeFunctions.orderHistoryVendor.selectedOrders : [],
    currentOrderIndex: state.storeFunctions && state.storeFunctions.orderHistoryVendor ? state.storeFunctions.orderHistoryVendor.currentIndex : null,
    isLoading: state.storeFunctions && state.storeFunctions.orderHistoryVendor ? state.storeFunctions.orderHistoryVendor.isLoading : false,
    orders: state.storeFunctions.orderHistoryVendor ? state.storeFunctions.orderHistoryVendor.orders : {}
  })
}

export default connect(
  mapStateToProps
)(withRouter(DsdOrderDetails))