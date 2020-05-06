import React from 'react';
import SideNavBar from '../../components/shared/SideNavBar';
import OrderingCycleType from './Landing/OrderingCycleType';
import OrderingCategories from './Landing/OrderingCategories'
import './OrderingHome.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as constants from '../../constants/ActionTypes';
import { storeDetails } from '../../lib/storeDetails'
import SpinnerComponent from '../../components/shared/SpinnerComponent';

import {
  orderingSelectedLink,
  getItemDetailsByOrderCycle,
  itemSelectedQty,
  action,
  getWeatherData,
} from '../../actions';
export class OrderingHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeSelectedFunction: null,
      storeId: storeDetails() && storeDetails().storeId,
      selectedLink: 'Ordering',
      previous: false,
      isContinueEnabled: false,
      isCarried: true,
      orderRemainingItems: true,
      orderingStatus: '',
      orderByVendor: false,
      selectedOrderCycle: ["singleDay", "multiDay", "nonDaily"],
      count: 0,
      displayHomeSpinner: false,
      previousButtonClicked: false,
      reviewFinalizeClicked: false
    }

    /* Added to reset the default image on login page*/
    document.querySelector("body").style.backgroundImage = 'none';

    this.toggler = this.toggler.bind(this);
    this.isCarriedFunction = this.isCarriedFunction.bind(this);
    this.orderByVendorFunction = this.orderByVendorFunction.bind(this);
    this.selectedOrderCycleFunction = this.selectedOrderCycleFunction.bind(this);
    this.resetSubmit = this.resetSubmit.bind(this);
  }

  componentDidMount() {
    const { storeSelectedFunction, isContinueEnabled, itemsByOrderCycle, storeSelectedLink, checkCategories, storeSelectedData, orderingCategoryDetails, orderedItems, ItemDetailData } = this.props;
    this.setState({
      storeSelectedFunction: storeSelectedFunction,
      isContinueEnabled: isContinueEnabled,
      itemsByOrderCycle: itemsByOrderCycle,
      selectedLink: storeSelectedLink || 'Ordering',
      checkCategories: checkCategories,
      storeSelectedData: storeSelectedData,
      orderingCategoryDetails: orderingCategoryDetails,
      orderedItems: orderedItems,
      ItemDetailData: ItemDetailData,
    });
    /**dispatch weather data if there is no weather */
    this.props.dispatch(getWeatherData(storeDetails() && storeDetails().storeId));
    this.props.dispatch(action({ type: constants.ORDER_REMAINING_ITEMS, data: { orderRemainingItems: true } }));
    this.props.dispatch(orderingSelectedLink({
      selectedLink: 'Ordering'
    }));
  }

  toggler(isSelected) {
    this.setState({ orderRemainingItems: isSelected });
    this.props.dispatch(action({ type: constants.ORDER_REMAINING_ITEMS, data: { orderRemainingItems: isSelected } }));
  }

  isCarriedFunction(isCarried) {
    this.setState({ isCarried: isCarried });
  }

  orderByVendorFunction(orderByVendor) {
    this.setState({ orderByVendor: orderByVendor });
  }

  selectedOrderCycleFunction(selectedOrderCycle) {
    this.setState({ selectedOrderCycle: selectedOrderCycle, count: this.state.count + 1 }, () => {
    });
  }

  resetSubmit() {
    this.onResetSubmit()
  }

  renderSideNav = () => {
    const { selectedLink, orderRemainingItems, isCarried, orderByVendor, selectedOrderCycle, count } = this.state;
    switch (selectedLink) {
      case "Ordering": {
        return (
          <div>
            <OrderingCycleType toggler={this.toggler}
              isCarriedFunction={this.isCarriedFunction}
              isCarried={isCarried}
              orderByVendor={orderByVendor}
              orderByVendorFunction={this.orderByVendorFunction}
              selectedOrderCycleFunction={this.selectedOrderCycleFunction}
              selectedOrderCycle={selectedOrderCycle}
            />
            <OrderingCategories
              orderRemainingItems={orderRemainingItems}
              isCarried={isCarried}
              orderByVendor={orderByVendor}
              selectedOrderCycle={selectedOrderCycle}
              count={count}
            />
          </div>
        )
      }
      default:
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      selectedLink: newProps.storeSelectedLink,
      isContinueEnabled: newProps.isContinueEnabled,
      itemsByOrderCycle: newProps.itemsByOrderCycle,
      orderingCategoryDetails: newProps.orderingCategoryDetails,
      checkCategories: newProps.checkCategories,
      ItemDetailData: newProps.ItemDetailData,
      orderingStatus: newProps.orderingStatus,
    }, () => {
      const { orderingStatus } = this.state;
      const self = this;

      if ((orderingStatus === "NETWORK_ERROR") || (orderingStatus === "COMPLETE")) {
        setTimeout(function () {
          self.setState({ displayHomeSpinner: false });
        }, 2000);
      }
    });
  }


  onClickPrevious = () => {
    this.props.history.push('/home');
  }

  onSelectContinue = () => {

    // DISPATCH ITEMS 
    const { isCarried, checkCategories, orderRemainingItems, ItemDetailData, storeId, orderByVendor } = this.state;

    if (checkCategories && checkCategories[2]) {
      this.props.dispatch(itemSelectedQty({
        selectedItems: [],
        OrderingCycleType: constants.nonDaily
      }));

      this.props.history.push('/placeorder/nondaily');

      this.props.dispatch(getItemDetailsByOrderCycle(storeId, ItemDetailData.nonDaily, isCarried, storeDetails().timeZone, constants.nonDaily, orderRemainingItems, orderByVendor))
    }

    if (checkCategories && checkCategories[1]) {
      this.props.dispatch(itemSelectedQty({
        selectedItems: [],
        OrderingCycleType: constants.multiDay
      }));

      this.props.history.push('/placeorder/multiday');

      this.props.dispatch(getItemDetailsByOrderCycle(storeId, ItemDetailData.multiDay, isCarried, storeDetails().timeZone, constants.multiDay, orderRemainingItems, orderByVendor))
    }

    if (checkCategories && checkCategories[0]) {
      this.props.dispatch(itemSelectedQty({
        selectedItems: [],
        OrderingCycleType: constants.singleDay
      }));

      this.props.history.push('/placeorder/singleday');

      this.props.dispatch(getItemDetailsByOrderCycle(storeId, ItemDetailData.singleDay, isCarried, storeDetails().timeZone, constants.singleDay, orderRemainingItems, orderByVendor))
    }
    this.props.dispatch(orderingSelectedLink({
      selectedLink: 'ItemDetail'
    }))
  }

  render() {
    const { displayHomeSpinner, storeId } = this.state;
    return (
      <div className="full-height">
        <div className="full-height" style={{ margin: "0" }}>
          <SideNavBar id="ordering-home" history={this.props.history} val={this.state.storeSelectedFunction}>
            <div className="heading-desktop">
              <span className="ordering-heading">
                <span className="store-Info">STORE {storeId ? storeId : ''}</span>
                {/* <HeaderBar parentCallback = {this.handleParentCallback} value={this.state.selectedLink} previous={this.state.previous} /> */}
                ORDERING
                        </span>

            </div>

            <div className="heading-mobile">
              <div className="store-Info">Store # {storeId ? storeId : ''}</div>
              <div className="ordering-heading">ORDERING</div>
            </div>

            {this.renderSideNav()}
          </SideNavBar>
          <div className="ordering-prev">
            <button id="btn-prev" type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious}>PREVIOUS</button>
            <button id="btn-next" type="button" className="btn btn-next d-none d-md-block d-lg-block" disabled={!this.state.isContinueEnabled} onClick={this.onSelectContinue}>CONTINUE</button>
          </div>
          <div className="ordering-con-mob">
            <button id="btn-next-mob" type="button" className="btn btn-next-mob d-md-none d-lg-none d-sm-block" onClick={this.onSelectContinue} disabled={!this.state.isContinueEnabled}>CONTINUE</button>
          </div>
          {
            displayHomeSpinner &&
            <div className="Home-Overlay">
              <div className="Home-Spinner">
                <SpinnerComponent displaySpinner={displayHomeSpinner} />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

OrderingHome.propTypes = {

}

OrderingHome.defaultProps = {

}

const mapStateToProps = state => {
  return ({
    itemsByOrderCycle: state.ordering.getItemDetailsForSelectedCategory && state.ordering.getItemDetailsForSelectedCategory ? state.ordering.getItemDetailsForSelectedCategory : {},
    selectedItems: state.ordering && state.ordering.submitOrderByGroup && state.ordering.submitOrderByGroup.payload,
    storeSelectedLink: state.ordering.orderingSelectedLink && state.ordering.orderingSelectedLink.payload && state.ordering.orderingSelectedLink.payload.selectedLink ? state.ordering.orderingSelectedLink.payload.selectedLink : 'Ordering',
    storeSelectedData: state.stores.storeSelected && state.stores.storeSelected.payload ? state.stores.storeSelected.payload.data : [],
    storeSelectedFunction: state.stores.storeFunction && state.stores.storeFunction.payload ? state.stores.storeFunction.payload.selectedFunction : '',
    isContinueEnabled: state.ordering.orderingContiueButton && state.ordering.orderingContiueButton.payload ? state.ordering.orderingContiueButton.payload.isContinueEnabled : false,
    checkCategories: state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.checkCategories ? state.ordering.orderingContiueButton.payload.checkCategories : [],
    orderingCategoryDetails: state.ordering.getOrderingCategoryDetails && state.ordering.getOrderingCategoryDetails.payload ? state.ordering.getOrderingCategoryDetails.payload : {},
    ItemDetailData: state.ordering.orderingContiueButton && state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.ItemDetailData ? state.ordering.orderingContiueButton.payload.ItemDetailData : {},
    Items: state.ordering.getItemDetailsForSelectedCategory && state.ordering.getItemDetailsForSelectedCategory[constants.singleDay] ? state.ordering.getItemDetailsForSelectedCategory[constants.singleDay] : [],
    orderingStatus: state.ordering && state.ordering.getOrderingStatus && state.ordering.getOrderingStatus.payload,
    selectedLink: state.ordering.orderingSelectedLink && state.ordering.orderingSelectedLink.payload && state.ordering.orderingSelectedLink.payload.selectedLink ? state.ordering.orderingSelectedLink.payload.selectedLink : 'Ordering',
    currentOrderCycleType: state.ordering && state.ordering.currentOrderCycleType && state.ordering.currentOrderCycleType.payload && state.ordering.currentOrderCycleType.payload.orderCycleType ? state.ordering.currentOrderCycleType.payload.orderCycleType : {},
  });
}
export default connect(
  mapStateToProps
)(withRouter(OrderingHome))