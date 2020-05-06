import React, { Component } from 'react'
import ToggleButton from '../../../shared/Toggle';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DateHelper from '../../../utility/DateHelper';
import './OrderingDetail.css';
import '../../OrderingHome.css';
import '../OrderingCategories.css';
import moment from 'moment';
import { storeDetails } from '../../../../lib/storeDetails'
import ItemDetail from '../ItemDetail/ItemDetail';
import SpinnerComponent from '../../../shared/SpinnerComponent';
import Notification from './notification/notification';
import { orderingSelectedLink, action, currentOrderCycle, getItemDetailsByOrderCycle } from '../../../../actions/index';
import { PANNEL_OPENNER, singleDay, multiDay, nonDaily, routeCycleTypes } from '../../../../constants/ActionTypes';
import SideNavBar from '../../../shared/SideNavBar';
import MessageBox from '../../../shared/MessageBox';
import { UNSAVED_MSG_TITLE, UNSAVED_MSG_BODY } from '../../../utility/constants';
import * as constants from '../../../../constants/ActionTypes';
import '../OrderingCycleType.css';

export class OrderingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NotificationDate: DateHelper(storeDetails() && storeDetails().timeZone),
            dropdownOpen: false,
            storeId: storeDetails() && storeDetails().storeId,
            Items: [],
            OrderingCycleType: singleDay,
            panelDeliveryDate: moment(),
            panelSubmitDate: moment(),
            panelForecastDate: moment(),
            selectedItem: this.props && this.props.Items ? this.props.Items[0] : {},
            itemdetailSpinner: false,
            isCarried: false,
            orderByVendor: false,
            ItemDetailData: {},
            orderRemainingItems: false,
            panelOpener: 0,
            previousPanelOpenner: -1,
            previousButtonClicked: false,
            reviewFinalizeClicked: false,
            showPendingOrderModal: false,
            msgBoxPendingOrderBody: '',
            userSelectedItems: '',
            totalItemCount: '',
            msgTitle: '',
            msgBody: '',
            msgBoxBody: '',
            showModal: false,
            showNoDataModal: false, 
            toggleSideNavActions: false,
            lastCall: (new Date()).getTime(),
            delay: 1000,
            toggleCompletedStatus: false
        }
        // this.handleScroll = this.handleScroll.bind(this);
        // this.recursive = this.recursive.bind(this);
        this.onPreviousButtonResponse = this.onPreviousButtonResponse.bind(this);
        this.onReviewFinalizeButtonResponse = this.onReviewFinalizeButtonResponse.bind(this);

        /**Adding for Modal Actions - Check if all items are ordered and remaining count */
        this.PendingOrderModalAction = this.PendingOrderModalAction.bind(this);
        this.stayItemPg = this.stayItemPg.bind(this);
        this.extItemPg = this.extItemPg.bind(this);

    }

    componentWillMount(){
        if( this.props && this.props.match && this.props.match.params && this.props.match.params.OrderingCycleType && routeCycleTypes[this.props.match.params.OrderingCycleType]){

            this.setState({ 
                OrderingCycleType: routeCycleTypes[this.props.match.params.OrderingCycleType],
                pathParam: this.props.match.params.OrderingCycleType
             });
             this.props.dispatch(currentOrderCycle({
                orderCycleType: routeCycleTypes[this.props.match.params.OrderingCycleType]
              }));
        } else {
            this.props.history.push('/landing');
        }
    }


    componentDidMount() {
        /**Check every 10minutes */
        setInterval(() => {
            this.setState({ NotificationDate: DateHelper(storeDetails() && storeDetails().timeZone) })
        }, 600000)
        const { Items, ItemDetailData } = this.props;
        const { OrderingCycleType } = this.state;


        this.setState({
            Items: Items && Items[OrderingCycleType] ? Items[OrderingCycleType] : [],
            originalList: Items[OrderingCycleType],
            ItemDetailData: ItemDetailData[constants[OrderingCycleType]],
            orderRemainingItems: true,
            previousButtonClicked: this.props.previousButtonClicked,
            isCarried: this.props.isCarried,
            orderByVendor: this.props.orderByVendor,
            toggleCompletedStatus: ItemDetailData[constants[OrderingCycleType]].itemAggregates === 0 ? true : false
        }, () => {
            // const { ItemDetailData, orderRemainingItems } = this.props;
            const { Items, toggleCompletedStatus } = this.state;

            if(toggleCompletedStatus) {
                this.setState({orderRemainingItems: false});
            }
            this.props.dispatch(orderingSelectedLink({
                selectedLink: 'ItemDetail'
            }));
            this.props.dispatch(action({ type: constants.ORDER_REMAINING_ITEMS, data: { orderRemainingItems: true } }));
            this.props.dispatch(action({
                type: PANNEL_OPENNER,
                data: {
                    panelOpener: 0,
                    previousPanelOpenner: -1
                }
            })); 
            this.setState({
                itemdetailSpinner: Items && Items.length > 0 ? false : true
            });
 
        });
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    onPreviousButtonResponse = (onPreviousButtonOrderHome) => {
        if(onPreviousButtonOrderHome){
          this.setState({ 
            showModal: true,
            ...this.getBodyTitle()
          });
        }
        this.setState({ previousButtonClicked: false});
    }
    
      onReviewFinalizeButtonResponse = (onPreviousButtonOrderHome) => {
          const { OrderingCycleType } = this.state;
        if(onPreviousButtonOrderHome){
          this.buildItemSelection(this.props.itemsByOrderCycle, OrderingCycleType)
        }
        this.setState({ reviewFinalizeClicked: false});
      }

    getBodyTitle() {
        let userSelectedItems = [];
        let emptyList = [];
        const { itemsByOrderCycle } = this.props;
        const { OrderingCycleType } = this.state;

        if (OrderingCycleType === singleDay) {
          itemsByOrderCycle[singleDay].forEach(function (data) {
            if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
              emptyList.push(data);
            } else {
                if(!data.isStoreOrderBlocked){
                    userSelectedItems.push(data);
                }
            }
          });
        } else if (OrderingCycleType === multiDay) {
          itemsByOrderCycle[multiDay].forEach(function (data) {
            if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
              emptyList.push(data);
            } else {
                if(!data.isStoreOrderBlocked){
                    userSelectedItems.push(data);
                }
            }
          });
        } else if (OrderingCycleType === nonDaily) {
           itemsByOrderCycle[nonDaily].forEach(function (data) {
            if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
              emptyList.push(data);
            } else {
                if(!data.isStoreOrderBlocked){
                    userSelectedItems.push(data);
                }
            }
          });
        } else {
          return []
        }
        const total = userSelectedItems.length + emptyList.length;
        if (emptyList.length > 0) {
          return {
            msgTitle: 'ORDER INCOMPLETE',
            msgBody: `Are you sure you want to exit? ${emptyList.length} out of the total ${total} have not been ordered.`,
            toggleSideNavActions: false,
          }
        }else{
            return {
              msgTitle: UNSAVED_MSG_TITLE,
              msgBody: UNSAVED_MSG_BODY,
              toggleSideNavActions: true,
            }
        }
       
      }

    PendingOrderModalAction=(showPendingOrderModal)=>{
        this.setState({showPendingOrderModal: showPendingOrderModal},()=>{
            setTimeout(() => {
                let defaultButton = document.getElementById("btn-stay-on-orderingDetail");
                if (defaultButton) {
                    defaultButton.focus();
                }
            }, 100);
        });
      }
    
      stayItemPg=(val)=>{
        if(val){
        }
      }

      orderingPage=(val)=>{
        if(val === false){
           this.props.history.push('/landing');
        }
      }
    
      extItemPg=(val)=>{
          const { pathParam } = this.state;
        if(val === false){
           this.props.history.push(`${pathParam}/reviewfinalize`);
        }
      }

      modalAction = (showModal) => {
        this.setState({
            showModal: showModal
            })
      }

      buildItemSelection(ItemDetailsForSelectedCategory, orderCycle){
          const { pathParam } = this.state;
        let userSelectedItems= [];
        let emptyList = [];
        if(orderCycle === singleDay ){
            ItemDetailsForSelectedCategory[singleDay].forEach(function(data){
                if((data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked){
                    emptyList.push(data);
                }else{
                    if(!data.isStoreOrderBlocked){
                        userSelectedItems.push(data);
                    }
                }
            });
        }else if(orderCycle === multiDay ){
            ItemDetailsForSelectedCategory[multiDay].forEach(function(data){
                if((data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked){
                    emptyList.push(data);
                }else{
                    if(!data.isStoreOrderBlocked){
                        userSelectedItems.push(data);
                    }
                }
            });
        }else if(orderCycle === nonDaily ){
            ItemDetailsForSelectedCategory[nonDaily].forEach(function(data){
                if((data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked){
                    emptyList.push(data);
                }else{
                    if(!data.isStoreOrderBlocked){
                        userSelectedItems.push(data);
                    }
                }
            });
        }else{
          
        }
    
        if(emptyList.length === 0){
          this.props.history.push(`${pathParam}/reviewfinalize`);
        }
    
        this.showMessageBox(ItemDetailsForSelectedCategory, userSelectedItems, emptyList);
     }

     showMessageBox(ItemDetailsForSelectedCategory, userSelectedItems, emptyList){
        const THIS = this;
        const { showPendingOrderModal } = this.state;
        let msgTitle = `ORDER INCOMPLETE`
        let msgBoxPendingOrderBody='';
        let totalItemCount = userSelectedItems.length + emptyList.length;
      
        /**Daily Check */
        if(userSelectedItems && userSelectedItems.length === 0 && ItemDetailsForSelectedCategory[singleDay]){
            msgBoxPendingOrderBody = `Are you sure you want to proceed? ${emptyList.length} out of the total ${totalItemCount} have not been ordered.`
        }else{
            msgBoxPendingOrderBody = `Are you sure you want to proceed? ${emptyList.length} out of the total ${totalItemCount} have not been ordered.`
        }
      
        /**Multiday Check */
        if(userSelectedItems && userSelectedItems.length === 0 && ItemDetailsForSelectedCategory[multiDay]){
            msgBoxPendingOrderBody = `Are you sure you want to proceed? ${emptyList.length} out of the total ${totalItemCount} have not been ordered.`
        }else{
            msgBoxPendingOrderBody = `Are you sure you want to proceed? ${emptyList.length} out of the total ${totalItemCount} have not been ordered.`
        }
      
        /**Non-daily Check */
        if(userSelectedItems && userSelectedItems.length === 0 && ItemDetailsForSelectedCategory[nonDaily]){
            msgBoxPendingOrderBody = `Are you sure you want to proceed? ${emptyList.length} out of the total ${totalItemCount} have not been ordered.`
        }else{
            msgBoxPendingOrderBody = `Are you sure you want to proceed? ${emptyList.length} out of the total ${totalItemCount} have not been ordered.`
        }
      
        if(emptyList.length !== 0){
            setTimeout(function(){ 
                THIS.setState({msgBoxPendingOrderBody: msgBoxPendingOrderBody, showPendingOrderModal: !showPendingOrderModal, msgTitle: msgTitle })
            }, 100);
        }
      }

    resetPanelOpener = (index, event) => {
        const { lastCall, delay, panelOpener, Items } = this.state;
        const now = (new Date()).getTime();
        if (now - lastCall > delay) {
            this.setState({ lastCall :now },()=>{
                this.setState({
                    panelOpener: panelOpener === index ? -1 : index,
                    previousPanelOpenner: panelOpener,
                    selectedItem: Items[index]
                });
                this.props.dispatch(action({
                    type: PANNEL_OPENNER,
                    data: {
                        panelOpener: panelOpener === index ? -1 : index,
                        previousPanelOpenner: panelOpener
                    }
                }));
            });
        } else if( event && event.key === "Tab" ) { // Tab issue when key press happens outside delay
                // updated index to panelOpener(focus issue on multiple enters) 
            setTimeout(function(){
                document.getElementById(`input-${panelOpener}`) && document.getElementById(`input-${panelOpener}`).focus();
            },1)
        } else {
            console.log("keypress ignored due to delay");
        }
    }

    resetSpinner = (itemdetailSpinner) => {
        this.setState({
            itemdetailSpinner: itemdetailSpinner
        })
    }

    componentWillReceiveProps(newProps) {
        const { OrderingCycleType } = this.state;
        this.setState({
            Items: newProps.Items && newProps.Items[OrderingCycleType] ? newProps.Items[OrderingCycleType] : [],
            originalList: newProps.Items[OrderingCycleType],
            panelDeliveryDate: newProps.NotificationDatePerCycleType && newProps.NotificationDatePerCycleType.computeDateDelivery,
            panelSubmitDate: newProps.NotificationDatePerCycleType && newProps.NotificationDatePerCycleType.computeDateSubmit,
            panelForecastDate: newProps.NotificationDatePerCycleType && newProps.NotificationDatePerCycleType.foreCastDate,
            checkCategories: newProps.checkCategories,
            ItemDetailData: newProps.ItemDetailData[constants[OrderingCycleType]],
            isCarried: newProps.isCarried,
            orderByVendor: newProps.orderByVendor
        }, () => {
            this.setState({Items: newProps.Items && newProps.Items[OrderingCycleType] ? newProps.Items[OrderingCycleType] : []});
            const { Items, panelOpener, delay } = this.state;
            if (Items && Items.length > 0) {
                // const { ItemDetailData, orderRemainingItems } = this.state;
                // if (ItemDetailData && ItemDetailData.itemAggregates === 0 && orderRemainingItems) {
                //     this.props.history.push(`${pathParam}/reviewfinalize`);
                // }
                this.setState({ itemdetailSpinner: Items && Items.length > 0 ? false : true });
            }

            if(newProps.Items[OrderingCycleType] && 
                newProps.Items[OrderingCycleType].length === 0 && 
                (newProps.itemDetailStatus[OrderingCycleType] === "COMPLETE" || newProps.itemDetailStatus[OrderingCycleType] === "NETWORK_ERROR")){
                this.setState({
                    showNoDataModal: true,
                    itemdetailSpinner: false,
                    msgBoxBody: `No Items Available to list.`,
                });
            }

            if (newProps.previousButtonClicked) {
                if (panelOpener > -1) {
                    this.setState({ previousButtonClicked: newProps.previousButtonClicked })
                } else {
                    this.props.onPreviousButtonOrderHome(true);
                }
            }
            if (newProps.reviewFinalizeClicked) {
                if (panelOpener > -1) {
                    this.setState({ reviewFinalizeClicked: newProps.reviewFinalizeClicked })
                } else {
                    this.props.onReviewFinalizeButtonResponse(true);
                }
            }

            if(Items.length > 50 && delay !== 1000){
                this.setState({ delay: 1000 })
            }
        });
    }

    onReviewAndFinalize =()=>{
        const { panelOpener } = this.state;
        if(parseInt(panelOpener) >= 0){
            this.setState({ reviewFinalizeClicked: false },()=>{
                this.setState({ reviewFinalizeClicked: true });
            });
        } else {
            this.onReviewFinalizeButtonResponse(true);
        }
    }

    onClickPrevious = ()=>{
        const { panelOpener } = this.state;
        if(parseInt(panelOpener) >= 0){
            this.setState({ previousButtonClicked: false },()=>{
                this.setState({ previousButtonClicked: true });
            });
        } else {
            this.onPreviousButtonResponse(true);
        }    
    }

    modalActionRedirect = (showModal) => {
        if (!showModal) {
            this.props.history.push('/landing');
        }
    }

    toggler = (isSelected) => {
        const { ItemDetailData, storeId, orderByVendor, OrderingCycleType, isCarried } = this.state;
        this.setState({ orderRemainingItems: isSelected, itemdetailSpinner: true },()=>{
        this.props.dispatch(action({ type: constants.ORDER_REMAINING_ITEMS, data: { orderRemainingItems: isSelected } }));
        this.props.dispatch(getItemDetailsByOrderCycle(storeId, ItemDetailData, isCarried, storeDetails().timeZone, OrderingCycleType, isSelected, orderByVendor))
        });
    }

    render() {
        const { itemdetailSpinner,
             OrderingCycleType, 
             selectedItem, 
             Items, 
             originalList, 
             previousButtonClicked, 
             reviewFinalizeClicked, 
             storeId, 
             toggleSideNavActions, 
             showModal, 
             msgTitle, 
             msgBody, 
             msgBoxPendingOrderBody, 
             showPendingOrderModal,
             showNoDataModal,
             toggleCompletedStatus,
             msgBoxBody } = this.state;
        let checkIfItemExist = selectedItem ? selectedItem : this.state.Items[0];
        return (
                <div className="full-height">
                    {itemdetailSpinner &&
                        <div className="item-detail-spinner-component">
                            <div className="item-detail-spinner">
                                <SpinnerComponent displaySpinner={itemdetailSpinner} />
                            </div>
                        </div>
                    }
                                <SideNavBar id="ordering-home" history= {this.props.history} >

                    <div className="heading-desktop">
                        <span className="ordering-heading">
                            <span className="store-Info">STORE {storeId? storeId: ''}</span>
                                ORDERING
                        </span>      
                    </div>
                    <div className="heading-mobile">
                        <div className="store-Info">Store # {storeId ? storeId: ''}</div>
                        <div className="ordering-heading">ORDERING</div>
                    </div>

                    <div className="rowXX hide-for-mobileX toggle-content">
                       <div className="col-md-4XX mt-3 rmv-order-padding">
                       <div className="toggle-wrapper">
                       <div className="Order-remaining-item">Order remaining items only?</div>
                       <div className="toggle-align"><ToggleButton toggler={this.toggler}
                        isSelected={this.state.orderRemainingItems} disabled ={toggleCompletedStatus}/></div>
                       </div>
                       </div>
                    </div>

                { /*Promotions and Search Container*/}
                <div className="rowXX promo-margin promo-content">
                    <div className="col-md-6XX d-none d-sm-block d-sm-none d-md-block">
                        <div className="float-md-left">
                            <span className="Promo-Start">P+: Promo Start</span>
                            <span className="Promo-On">P: Promo on</span>
                            <span className="Promo-Ends">P-: Promo Ends</span>
                        </div>
                    </div>
                </div>

                { /*Notifications Container*/}
                {Items.length > 0 &&
                    <Notification OrderingCycleType={this.state.OrderingCycleType} Item={checkIfItemExist} />
                }

                { /* 2 hr analysis and weather Container*/}

                { /*Item Details Container*/}

                { showModal &&
                    <MessageBox 
                        itemDetailPrevious={true} 
                        className={"message-box"} 
                        initialModalState={false} 
                        msgTitle={msgTitle} 
                        msgBody={msgBody}  
                        modalAction = {this.modalAction}
                        stayItemPg = {this.stayItemPg}
                        orderingPage = {this.orderingPage}
                        toggleSideNavActions={toggleSideNavActions}
                        executePreviousAction={this.executePreviousAction}                       
                    />
                }

                {
                    showNoDataModal && 
                        <MessageBox
                            msgTitle=""
                            msgBody={msgBoxBody}
                            className={"message-box-ordering-unavailable"}
                            initialModalState={false}
                            modalAction={this.modalActionRedirect}
                            NoDataModal={true}
                        />
                }

                {showPendingOrderModal && 
                    <MessageBox 
                        msgTitle={msgTitle} 
                        msgBody={msgBoxPendingOrderBody}
                        className={"message-box"} 
                        initialModalState={false}
                        reviewFinalizePage={true}
                        savedQntyModal={false}
                        orderMinMax={false}
                        stayItemPg = {this.stayItemPg}
                        extItemPg = {this.extItemPg}
                        modalAction = {this.PendingOrderModalAction}
                    />
                }
                <div className="ordering-accordion">
                    {Items && Array.isArray(Items) && Items.map((Item, index) => {
                        return (
                            <ItemDetail
                                Item={Item}
                                index={index}
                                Items={originalList}
                                key={index}
                                resetPanelOpener={this.resetPanelOpener}
                                OrderingCycleType={OrderingCycleType}
                                dispatch={this.props.dispatch}
                                resetSpinner={this.resetSpinner}
                                previousButtonClicked={previousButtonClicked}
                                reviewFinalizeClicked={reviewFinalizeClicked}
                                onPreviousButtonOrderDetail={this.onPreviousButtonResponse}
                                onReviewFinalizeButtonResponse={this.onReviewFinalizeButtonResponse}
                            />
                        )
                    })
                    }
                </div>
                </SideNavBar>

                <div className="ordering-prev">
                    <button id="btn-prev" type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious}>PREVIOUS</button>
                    <button 
                        id="enter-on-review" 
                        ref="review-finalize" 
                        type="button"
                        onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault() }}} 
                        className="btn btn-review d-none d-md-block d-lg-block" 
                        onClick={this.onReviewAndFinalize}>REVIEW</button>
                    
                </div>
                <div className="ordering-con-mob">
                    <button id="btn-next" onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault() }}} 
                    type="button" className="btn btn-next-mob d-md-none d-lg-none d-sm-block" onClick={this.onReviewAndFinalize}>REVIEW</button>
                </div>    
            </div>
        )
    }
}


const mapStateToProps = state => {
    return ({
        itemsByOrderCycle: state.ordering.getItemDetailsForSelectedCategory && state.ordering.getItemDetailsForSelectedCategory ? state.ordering.getItemDetailsForSelectedCategory : {},
        selectedLink: state.ordering.orderingSelectedLink && state.ordering.orderingSelectedLink.payload && state.ordering.orderingSelectedLink.payload.selectedLink ? state.ordering.orderingSelectedLink.payload.selectedLink : 'Ordering',
        NotificationDatePerCycleType: state && state.ordering && state.ordering.notificationDate && state.ordering.notificationDate.payload,
        Items: state.ordering.getItemDetailsForSelectedCategory ? state.ordering.getItemDetailsForSelectedCategory : [],
        checkCategories : state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.checkCategories ? state.ordering.orderingContiueButton.payload.checkCategories: [],
        ItemDetailData : state.ordering.orderingContiueButton && state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.ItemDetailData ? state.ordering.orderingContiueButton.payload.ItemDetailData: {},
        orderRemainingItems : state.ordering.orderingRemainingItems && state.ordering.orderingRemainingItems.payload ? state.ordering.orderingRemainingItems.payload.orderRemainingItems : true,
        itemDetailStatus: state.ordering && state.ordering.getItemDetailStatus && state.ordering.getItemDetailStatus,
        isCarried: state.ordering && state.ordering.orderingContiueButton && state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.isCarried,
        orderByVendor: state.ordering && state.ordering.orderingContiueButton && state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.orderByVendor
    });
}
export default connect(
    mapStateToProps
)(withRouter(OrderingDetail))
