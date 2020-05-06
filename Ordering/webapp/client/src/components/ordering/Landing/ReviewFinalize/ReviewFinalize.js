import React, { Component } from 'react';
import './ReviewFinalize.css';
import '../../OrderingHome.css';
import '../OrderingDetail/OrderingDetail.css'
import '../OrderingCategories.css'
import LabelInfo from '../ItemDetail/CardDetail/LabelInfo/LabelInfo';
import noImageAvailable from '../../../../assets/images/No_Image_Available.jfif';
import DisplayBar from '../../../shared/DisplayBar';
import MessageBox from '../../../shared/MessageBox';
import DailyTrend from '../../../ordering/Landing/ItemDetail/CardDetail/DailyTrend/DailyTrend';
import WeeklyTrend from '../../../ordering/Landing/ItemDetail/CardDetail/WeeklyTrend/WeeklyTrend';
import { singleDay, multiDay, nonDaily, routeCycleTypes } from '../../../../constants/ActionTypes';
import { storeDetails } from '../../../../lib/storeDetails';
import SpinnerComponent from '../../../shared/SpinnerComponent';
import { filterOrderItems } from '../../../utility/filterOrderItems';
import { itemGroupByCategory, filterItemsOnReviewAndFinalize } from '../../../utility/itemGroupByCategory'
import { Collapse, CardBody, Card } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getItemTrendAtGroupLevel, postOrderDetails, currentOrderCycle, orderingSelectedLink } from '../../../../actions';
import { determineMinLDU, determineMaxLDU } from '../../../utility/ldu';
import { ORDER_QTY_REGEX, VALID_KEYS, ALLOWED_KEY_CODES, DISALLOWED_KEY_CODES, DISALLOWED_KEYS } from '../../../utility/constants';
import * as constants from '../../../../constants/ActionTypes';
import SideNavBar from '../../../shared/SideNavBar';
import { imageAvailabilityCheck } from '../../../utility/checkImageAvailability';
import { validateRolesAndReadOnlyView } from '../../../utility/validateRolesAndReadOnlyView';
class ReviewFinalize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OrderingCycleType: '',
            Items: [],
            totalCount: 0,
            orderSelectedDetails: [],
            entrCount: 0,
            storeId: storeDetails() && storeDetails().storeId,
            selectedTab: 'weekly',
            groupLevelTrendDetails: {},
            showModal: false,
            msgBoxBody: '',
            showLDUModal: false,
            msgLDUBody: '',
            LDUMin: '',
            LDUMax: '',
            itmMsgIndex: '',
            itmMsgChildIndex: '',
            showPendingOrderModal: false,
            msgBoxPendingOrderBody: '',
            showSavedQntyModal: false,
            SavedQntyBody: '',
            displayTrendSpinner: false,
            itemIndex: '',
            isSelected: false,
            readOnly: validateRolesAndReadOnlyView()
        }
        this.etrFunction = this.etrFunction.bind(this);
        this.lduMinOrderQntyChk = this.lduMinOrderQntyChk.bind(this);
        this.lduMaxOrderQntyChk = this.lduMaxOrderQntyChk.bind(this);
        this.previousSelectionChk = this.previousSelectionChk.bind(this);
        this.defaultSelectionChk = this.defaultSelectionChk.bind(this);
    }

    ToggleParent = (index) => {
        let { orderSelectedDetails } = this.state;
        if (!orderSelectedDetails[index].hasOwnProperty("isExpanded")) {
            orderSelectedDetails[index].isExpanded = true;
            this.setState({ orderSelectedDetails: orderSelectedDetails }, () => {
                if (orderSelectedDetails && orderSelectedDetails[index] && orderSelectedDetails[index].isExpanded) {
                    const nextValidItemIndex = this.getNextValidItemIndex(index, -1);
                    if (this.validateGivenValue(nextValidItemIndex)) {
                        document.getElementById(`input${index}-${nextValidItemIndex}`) && document.getElementById(`input${index}-${nextValidItemIndex}`).focus(); // focus on first valid item when a panel is openned
                    }
                }
            })
        } else {
            orderSelectedDetails[index].isExpanded = !orderSelectedDetails[index].isExpanded;
            this.setState({ orderSelectedDetails: orderSelectedDetails }, () => {
                if (orderSelectedDetails && orderSelectedDetails[index] && orderSelectedDetails[index].isExpanded) {
                    const nextValidItemIndex = this.getNextValidItemIndex(index, -1);
                    if (this.validateGivenValue(nextValidItemIndex)) {
                        document.getElementById(`input${index}-${nextValidItemIndex}`) && document.getElementById(`input${index}-${nextValidItemIndex}`).focus(); // focus on first valid item when a panel is openned
                    }
                }
            })
        }
    }

    MinMaxModalAction = (showModal, index) => {
        this.setState({ showModal: showModal });
        this.refs[index].select();
    }

    LduModalAction = (showLDUModal, index, cIndex) => {
        this.setState({ showLDUModal: showLDUModal });
        this.refs[cIndex].focus();
    }

    PendingOrderModalAction = (showPendingOrderModal) => {
        this.setState({ showPendingOrderModal: showPendingOrderModal });
    }

    etrFunction(evt) {
        if (evt.keyCode === 13) {
            if (this.state.entrCount === 0) {
                let stCount = this.state.entrCount + 1;
                this.setState({ entrCount: stCount })
            } else {
                document.getElementById("enter-on-submit").click()
            }
        }
    }

    reviewClick(e) {
        this.etrFunction(e)
    }

    componentWillMount(){
        if( this.props && this.props.match && this.props.match.params && this.props.match.params.OrderingCycleType ){

            this.setState({ 
                OrderingCycleType: routeCycleTypes[this.props.match.params.OrderingCycleType],
                pathParam: this.props.match.params.OrderingCycleType
             })
        } else {
            this.props.history.push('/landing');
        }
    }

    
    componentDidMount() {
        let arr = [];
        const { groupLevelTrendDetails, ItemDetailData, orderRemainingItems, checkCategories } = this.props;
        const { OrderingCycleType } = this.state;
        let Items = this.props.Items[OrderingCycleType]

        this.props.dispatch(orderingSelectedLink({
            selectedLink: 'Review',
        }));

        this.props.dispatch(getItemTrendAtGroupLevel({
            Items: filterOrderItems(Items),
            orderCycleTypeCode: constants[OrderingCycleType],
            timeZone: storeDetails() && storeDetails().timeZone
        }, storeDetails().storeId));

        Items && Items.map(function (item) {
            if (item.hasOwnProperty('untransmittedOrderQty')) {
                arr.push(item);
            }
            return arr;
        });
        if (filterItemsOnReviewAndFinalize(arr).length === 0) {
            this.props.resetSubmit();
        }

        this.setState({
            orderSelectedDetails: itemGroupByCategory(Items, false),
            groupLevelTrendDetails: groupLevelTrendDetails,
            ItemDetailData: ItemDetailData[constants[OrderingCycleType]],
            orderRemainingItems: orderRemainingItems,
            checkCategories: checkCategories
        }, () => {
            if (this.state.orderSelectedDetails && this.state.orderSelectedDetails.length === 1) {
                const { orderSelectedDetails } = this.state;
                if (!orderSelectedDetails[0].hasOwnProperty("isExpanded")) {
                    orderSelectedDetails[0].isExpanded = true;
                    this.setState({ orderSelectedDetails: orderSelectedDetails, displayTrendSpinner: true });
                    setTimeout(() => {
                        const nextValidItemIndex = this.getNextValidItemIndex(0, -1);
                        if (this.validateGivenValue(nextValidItemIndex)) {
                            this.refs[nextValidItemIndex] && this.refs[nextValidItemIndex].focus();
                        }
                    }, 1000);
                } else {
                    orderSelectedDetails[0].isExpanded = !orderSelectedDetails[0].isExpanded;
                    this.setState({ orderSelectedDetails: orderSelectedDetails })
                }
            }
        })

        let d = document.getElementById("enter-on-submit");
        if (d) {
            d.className += ' add-cursor';
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.etrFunction);
    }

    componentWillReceiveProps(newProps) {
        const { OrderingCycleType } = this.state;
        this.setState({
            groupLevelTrendDetails: newProps.groupLevelTrendDetails,
            displayTrendSpinner: false,
            ItemDetailData: newProps.ItemDetailData[constants[OrderingCycleType]],
            orderRemainingItems: newProps.orderRemainingItems,
            checkCategories: newProps.checkCategories
        })
    }

    findTotalOrderQnty(Items) {
        const { readOnly } = this.state;
        let itemCnt = 0;
        if (Items && Items.length) {
            for (let i = 0; i < Items.length; i++) {
                if (Number.isInteger(Items[i].untransmittedOrderQty)) {
                    itemCnt += Items[i].untransmittedOrderQty;
                }
            }
        }
        if(readOnly){
            document.getElementById('enter-on-submit').innerText = "DONE";
        }else{
            if (itemCnt > 0) {
                document.getElementById('enter-on-submit').innerText = "SUBMIT";
            } else if (itemCnt === 0) {
                document.getElementById('enter-on-submit').innerText = "DONE";
            } else {
                document.getElementById('enter-on-submit').innerText = "SUBMIT";
            }
        }
        return itemCnt;
    }

    onKeyPressOrderBox(event, index, childIdx) {
        const nextIndex = this.getNextValidItemIndex(index, childIdx);
        if (nextIndex) {
            if (this.refs[nextIndex]) {
                event.key !== "Tab" && this.refs[nextIndex].focus();
                this.handleorderQuantityValidation(event, index, childIdx, false, true);
            }
            else {
                this.handleorderQuantityValidation(event, index, childIdx, true, true);
            }
        }
    }

    getNextValidItemIndex(pIndex, childIndex) {
        const { orderSelectedDetails } = this.state;
        let childLen = orderSelectedDetails[pIndex].items.length;
        //check for Skipping the storeOrderBlocked Item 
        if (orderSelectedDetails[pIndex].items[childIndex + 1] && orderSelectedDetails[pIndex].items[childIndex + 1].isStoreOrderBlocked) {
            return this.getNextValidItemIndex(pIndex, childIndex + 1);
        } else if (childLen >= childIndex) {
            return childIndex + 1;
        } else {
            console("Last Item in the Category...");
        }
    }

    alignItem(elementId) {
        if (window.innerWidth > 768) {
            setTimeout(function () {
                const element = document.getElementById(elementId);
                element && element.scrollIntoView({
                    block: 'center',
                    inline: 'start',
                    behavior: "smooth"
                });
            }, 100);
        }
    }


    getFocus(index, childIdx, elementId) {
        this.alignItem(elementId);
        this.setState({ itemIndex: childIdx, isSelected: true })
        if (this.refs[index + "reviewLabel" + childIdx])
            this.refs[index + "reviewLabel" + childIdx].style.color = "#008060";
    }

    handleFocus(event) {
        event.target.select();
    }

    looseFocus(e, index, childIdx) {
        this.setState({ itemIndex: childIdx, isSelected: true })
        if (this.refs[index + "reviewLabel" + childIdx])
            this.refs[index + "reviewLabel" + childIdx].style.color = "#9a9a9b";
    }

    displayMessageBox(inputQnty, itmQnty, index) {
        const { showModal } = this.state;
        const msgBoxBody = inputQnty > itmQnty ?
            `Order quantity exceeds the MAX quantity, should not be more than ${itmQnty} units.` :
            `Order quantity is less than the MIN quantity, must be at least ${itmQnty} units.`;
        this.setState({
            msgBoxBody: msgBoxBody,
            showModal: !showModal,
            itmMsgIndex: index
        })
        setTimeout(() => {
            let defaultButton = document.getElementById("orderMin");
            if (defaultButton) {
                defaultButton.focus();
            }
        }, 1);
    }

    lduMinOrderQntyChk(minVal, index, cIndex) {
        let { orderSelectedDetails } = this.state;
        orderSelectedDetails[index].items[cIndex].untransmittedOrderQty = minVal;
        this.setState({ orderSelectedDetails: orderSelectedDetails }, () => {
            this.refs[cIndex].focus();
            this.refs[cIndex].select();
        })
    }

    lduMaxOrderQntyChk(maxVal, index, cIndex) {
        let { orderSelectedDetails } = this.state;
        orderSelectedDetails[index].items[cIndex].untransmittedOrderQty = maxVal;
        this.setState({ orderSelectedDetails: orderSelectedDetails }, () => {
            this.refs[cIndex].focus();
            this.refs[cIndex].select();
        })
    }

    previousSelectionChk(preVal, pIndex, cIndex) {
        let { orderSelectedDetails } = this.state;
        orderSelectedDetails[pIndex].items[cIndex].untransmittedOrderQty = preVal;
        orderSelectedDetails[pIndex].items[cIndex].savedQuantity = orderSelectedDetails[pIndex].items[cIndex].untransmittedOrderQty;
        this.setState({ orderSelectedDetails: orderSelectedDetails }, () => {
            this.refs[cIndex].focus();
            this.refs[cIndex].select();
        })
    }

    defaultSelectionChk(defaultVal, pIndex, cIndex) {
        let { orderSelectedDetails } = this.state;
        orderSelectedDetails[pIndex].items[cIndex].untransmittedOrderQty = defaultVal;
        orderSelectedDetails[pIndex].items[cIndex].savedQuantity = orderSelectedDetails[pIndex].items[cIndex].untransmittedOrderQty;
        this.setState({ orderSelectedDetails: orderSelectedDetails }, () => {
            this.refs[cIndex].focus();
            this.refs[cIndex].select();
        })
    }

    validateGivenValue(value) {
        if (value !== "" && value !== null && Number.isInteger(value) && value >= 0) {
            return true;
        }
        return false
    }

    handleorderQuantityValidation(evt, index, itemIdx, lastItem, submitOrder) {
        const { storeId } = this.state;
        let orderSelectedDetails = this.state.orderSelectedDetails;
        let isPopUp = false;
        let inputQnty = evt.target.value ? parseInt(evt.target.value) : '';
        let SavedQntyBody = `Choose a desired Order Quantity:`;
        let savedQuantity = orderSelectedDetails[index].items[itemIdx]['savedQuantity'];
        if (inputQnty === "" && orderSelectedDetails[index].items[itemIdx].hasOwnProperty('savedQuantity') && orderSelectedDetails[index].items[itemIdx]['savedQuantity'] !== null && orderSelectedDetails[index].items[itemIdx]['savedQuantity']) {
            this.setState({
                SavedQntyBody: SavedQntyBody,
                showSavedQntyModal: true,
                previousSelectionVal: savedQuantity,
                defaultSelectionVal: 0,
                itmMsgIndex: index,
                itmMsgChildIndex: itemIdx
            })
            isPopUp = true;
            setTimeout(() => {
                let defaultButton = document.getElementById("btn-previous");
                if (defaultButton) {
                    defaultButton.focus();
                }
            }, 1);
        }

        if (isNaN(inputQnty)) {
            return;
        } else {
            if (inputQnty !== "") {
                /**Order Min/Max */
                let minQnty = orderSelectedDetails[index].items[itemIdx].minimumAllowableOrderQty;
                let maxQnty = orderSelectedDetails[index].items[itemIdx].maximumAllowableOrderQty;

                /**LDU Check */
                let ldu = orderSelectedDetails[index].items[itemIdx] && orderSelectedDetails[index].items[itemIdx].ldu;
                let maxLDU = determineMaxLDU(ldu, inputQnty);
                let msgLDUBody = `The order quantity is not a multiple of LDU. Choose one of the below:`;
                let findMinLDU = determineMinLDU(ldu, inputQnty);

                if (inputQnty === 0 || inputQnty === null || inputQnty === "") {
                    orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = 0;
                } else {
                    if (inputQnty >= minQnty && inputQnty <= maxQnty) {
                        if (inputQnty % ldu === 0) {
                            orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = inputQnty;
                        } else {
                            this.setState({
                                msgLDUBody: msgLDUBody,
                                showLDUModal: true,
                                LDUMin: findMinLDU,
                                LDUMax: maxLDU,
                                itmMsgIndex: index,
                                itmMsgChildIndex: itemIdx
                            })
                            setTimeout(() => {
                                let defaultButton = document.getElementById("btn-ldu-min"); // for ldu only
                                if (defaultButton) {
                                    defaultButton.focus();
                                }
                            }, 1);
                            //this.refs[itemIdx].focus();
                            isPopUp = true;
                        }
                    } else if (inputQnty < minQnty) {
                        //Display Min Msg box
                        this.displayMessageBox(inputQnty, minQnty, itemIdx);
                        orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = minQnty;
                        this.refs[itemIdx].focus();
                        isPopUp = true;
                    } else if (inputQnty > maxQnty) {
                        //Display Max Msg box
                        this.displayMessageBox(inputQnty, maxQnty, itemIdx);
                        orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = maxQnty;
                        this.refs[itemIdx].focus();
                        isPopUp = true;
                    } else {
                        orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = '';
                    }
                }
            }

            /**Pre-populate with 0 as order quantity if the orderQnty is 0 and removed  */
            if (inputQnty === "" && orderSelectedDetails[index].items[itemIdx]['savedQuantity'] === 0) {
                orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = 0;
            }

            if (this.validateGivenValue(orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty)) {
                orderSelectedDetails[index].items[itemIdx].savedQuantity = orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty;
            }

            this.setState({ orderSelectedDetails: orderSelectedDetails });
            if (lastItem && !isPopUp) {
                setTimeout(() => {
                    document.getElementById("enter-on-submit").focus();
                }, 50);
            }

            if (orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty === '') {
                this.setState({ itemIndex: itemIdx, isSelected: false })
            }

            if (submitOrder && !isPopUp && orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty >= 0 && orderSelectedDetails[index].items[itemIdx].oldValue !== orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty) {
                let itemsArray = [];

                itemsArray.push(orderSelectedDetails[index].items[itemIdx]);
                orderSelectedDetails[index].items[itemIdx].oldValue = orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty
                this.setState({ orderSelectedDetails: orderSelectedDetails },()=>{
                    this.props.dispatch(postOrderDetails({
                        Items: itemsArray,
                        storeId: storeId
                    }));
                })

            }
        }
    }

    updateOrderQnty(evt, index, itemIdx) {
        let orderSelectedDetails = this.state.orderSelectedDetails;
        let inputQnty = parseInt(evt.target.value) >= 0 ? parseInt(evt.target.value) : "";
        let isSelected = true;
        if ( ( ORDER_QTY_REGEX.test(inputQnty)) || inputQnty === "") {
            if (isNaN(inputQnty) || inputQnty === "") {
                orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = '';
                isSelected = false
            } else {
                orderSelectedDetails[index].items[itemIdx].untransmittedOrderQty = inputQnty;
            }
            this.setState({ itemIndex: itemIdx, isSelected: isSelected, orderSelectedDetails: orderSelectedDetails })
        }
    }

    savedQntyModalAction = (showSavedQntyModal, index, cIndex) => {
        this.setState({ showSavedQntyModal: showSavedQntyModal });
        this.refs[cIndex].focus();
    }

    determineCycleType = () => {
        if (this.state.OrderingCycleType === 'SINGLE_DAY') {
            return 'card-body-ordering'
        } else if (this.state.OrderingCycleType === 'MULTI_DAY') {
            return 'card-body-ordering-multi'
        } else {
            return 'card-body-ordering-nondaily'
        }
    }

    determineItemCycleType = () => {
        if (this.state.OrderingCycleType === 'SINGLE_DAY') {
            return 'item-list-ordering'
        } else if (this.state.OrderingCycleType === 'MULTI_DAY') {
            return 'item-list-ordering-multiday'
        } else {
            return 'item-list-ordering-nondaily'
        }
    }

    onTabChange = (selectedTab) => {
        this.setState({ selectedTab: selectedTab });
    };

    onReviewSubmit = () => {
        const { checkCategories } = this.props;
        const { OrderingCycleType } = this.state;
        switch (OrderingCycleType) {
            case singleDay:
                if (checkCategories[1]) {
                    this.props.dispatch(currentOrderCycle({
                        orderCycleType: multiDay
                    }));
                    this.props.history.push('/placeorder/multiday');
                } else if (checkCategories[2]) {
                    this.props.dispatch(currentOrderCycle({
                        orderCycleType: nonDaily
                    }));
                    this.props.history.push('/placeorder/nondaily');
                } else {
                    this.props.history.push('/landing');
                }
                break;

            case multiDay:
                if (checkCategories[2]) {
                    this.props.dispatch(currentOrderCycle({
                        orderCycleType: nonDaily
                    }));
                    this.props.history.push('/placeorder/nondaily');
                } else {
                    this.props.history.push('/landing');
                }
                break;

            case nonDaily:
                this.props.history.push('/landing');
                break;

            default:
                this.props.history.push('/landing');
                break;
        }
    }

    // onClickPrevious = () => {
    //     const { ItemDetailData, orderRemainingItems, checkCategories, OrderingCycleType, pathParam } = this.state;
    //     if (ItemDetailData.itemAggregates === 0 && orderRemainingItems) {
    //         switch (OrderingCycleType) {
    //             case singleDay:
    //                 this.props.history.push('ordering');
    //                 break;
    //             case multiDay:
    //                 if (checkCategories[0]) {
    //                     this.props.dispatch(currentOrderCycle({
    //                         orderCycleType: singleDay
    //                     }));
    //                     this.props.history.push('singleDay/reviewfinalize');
    //                 } else {
    //                     this.props.history.push('/landing');
    //                 }
    //                 break;

    //             case nonDaily:
    //                 if (checkCategories[1]) {
    //                     this.props.dispatch(currentOrderCycle({
    //                         orderCycleType: multiDay
    //                     }));
    //                     this.props.history.push('multiDay/reviewfinalize');
    //                 } else if (checkCategories[0]) {
    //                     this.props.dispatch(currentOrderCycle({
    //                         orderCycleType: singleDay
    //                     }));
    //                     this.props.history.push('singleDay/reviewfinalize');
    //                 } else {
    //                     this.props.history.push('/landing');
    //                 }
    //                 break;

    //             default:
    //                 this.props.history.push('/landing');
    //                 break;
    //         }
    //     } else {
    //         this.props.history.push(`/placeorder/${pathParam}`);
    //     }
    // }

    onClickPrevious = () => {
        const { pathParam } = this.state;
            this.props.history.push(`/placeorder/${pathParam}`);
    }

    addImage =(img)=>{
        if(img && img.target){
            img.target.src = noImageAvailable
        }
    }

    preventdefaultKeys = (e)=>{
        if((DISALLOWED_KEYS.includes(e.key) || DISALLOWED_KEY_CODES.includes(e.keyCode)) && ( !ALLOWED_KEY_CODES.includes(e.keyCode) || !VALID_KEYS.includes(e.key) )) {
            e.preventDefault();
        }
    }

    render() {
        const THIS = this;
        const {
            orderSelectedDetails,
            OrderingCycleType,
            selectedTab,
            groupLevelTrendDetails,
            displayTrendSpinner,
            showModal,
            msgBoxBody,
            showLDUModal,
            msgLDUBody,
            LDUMin,
            LDUMax,
            itmMsgIndex,
            itmMsgChildIndex,
            SavedQntyBody,
            previousSelectionVal,
            defaultSelectionVal,
            showSavedQntyModal,
            itemIndex,
            isSelected,
            storeId,
            readOnly
        } = this.state;
        return (
            <div className="review-finalize" onLoad={(e) => { THIS.reviewClick(e) }}>
                {
                    displayTrendSpinner &&
                    <div className="Home-Overlay">
                        <div className="review-finalize-spinner">
                            <SpinnerComponent displaySpinner={displayTrendSpinner} />
                        </div>
                    </div>
                }
                <SideNavBar id="ordering-home" history={this.props.history} >

                    <div className="heading-desktop">
                        <span className="ordering-heading">
                            <span className="store-Info">STORE {storeId ? storeId : ''}</span>
                            ORDERING
                            </span>
                    </div>
                    <div className="heading-mobile">
                        <div className="store-Info">Store # {storeId ? storeId : ''}</div>
                        <div className="ordering-heading">ORDERING</div>
                    </div>
                    <div className="review-heading">VIEW SUMMARY</div>

                    <div className="ordering-accordion">
                        <div>
                            {
                                orderSelectedDetails && orderSelectedDetails.map(function (item, index) {
                                    return (
                                        <div className="row mob-no-margin" key={index}>
                                            <div className={THIS.determineCycleType().toString()}>
                                                <div id="review-toggler" className="review-heading-styling">
                                                    <span className="review-orderCycle">{item.catName}</span>
                                                    {orderSelectedDetails.length >= 1 && <i className={item && item.isExpanded ? 'fa fa-angle-up review-arrow-up' : 'fa fa-angle-down review-arrow-up'} onClick={() => THIS.ToggleParent(index)}></i>}

                                                    <span className="review-items-count">{THIS.findTotalOrderQnty(item.items)} <span className="mob-review-itemTxt">Total Ordered</span></span>
                                                </div>
                                            </div>
                                            <Collapse key={index} isOpen={item.isExpanded ? true : false} >
                                                <Card className={(OrderingCycleType === singleDay) || (OrderingCycleType === multiDay) ? '' : ''}>
                                                    {window.innerWidth < 768 &&
                                                        <div className="display-bar col-md-none col-lg-none d-md-none d-lg-none"><DisplayBar selectedTab={selectedTab} onTabChange={THIS.onTabChange} Item={groupLevelTrendDetails && groupLevelTrendDetails[`${item.psa}-${item.cat}`]} OrderingCycleType={OrderingCycleType} reviewFinalizePage={true} /></div>
                                                    }
                                                    <CardBody>
                                                        <div key={index} className="d-none d-md-block col-md-12">
                                                            <div className="row">

                                                                <div className="col-md-1 label-info"><LabelInfo reviewFinalizePage={true} /></div>
                                                                <div className={'col-md-8 daily-trend'}><DailyTrend Item={groupLevelTrendDetails && groupLevelTrendDetails[`${item.psa}-${item.cat}`]} OrderingCycleType={OrderingCycleType} reviewFinalizePage={true} /></div>
                                                                <div className={'col-md-3 weekly-trend'}><WeeklyTrend Item={groupLevelTrendDetails && groupLevelTrendDetails[`${item.psa}-${item.cat}`]} OrderingCycleType={OrderingCycleType} reviewFinalizePage={true} /></div>
                                                            </div>
                                                        </div>
                                                        <div key={index + 1} className="d-md-none mob-weather-container">
                                                            <div className="col-2 label-info mob-inline"><LabelInfo reviewFinalizePage={true} /></div>
                                                            {selectedTab === "weekly" &&
                                                                <div className="col-11 weekly-trend mob-inline"><WeeklyTrend Item={groupLevelTrendDetails && groupLevelTrendDetails[`${item.psa}-${item.cat}`]} reviewFinalizePage={true} /></div>
                                                            }
                                                            {selectedTab === "daily" &&
                                                                <div className="col-11 daily-trend mob-inline"><DailyTrend Item={groupLevelTrendDetails && groupLevelTrendDetails[`${item.psa}-${item.cat}`]} reviewFinalizePage={true} /></div>
                                                            }
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Collapse >

                                            <div className="item-review-container">
                                                {
                                                    item.isExpanded && item && item.items.map(function (item, childIdx) {
                                                        return (
                                                            <Collapse isOpen={true} key={childIdx}>
                                                                <Card>
                                                                    <CardBody>
                                                                        <div className={THIS.determineItemCycleType()}>
                                                                            <span className="image-container">
                                                                                <img className="review-item-image" src={imageAvailabilityCheck(item)} alt="Item_Image" onError = {(e)=>THIS.addImage(e)} />
                                                                            </span>
                                                                            <span className="review-item-name">{item && item.isStoreOrderBlocked && window && window.innerWidth < 768 && item.itemName && item.itemName.length > 20 ? `${item.itemName.substring(0,20)}...` : item.itemName }</span>
                                                                            {/* <span className = "review-promo">P+</span> */}
                                                                            {item && item.isStoreOrderBlocked ?
                                                                                <span className="store-blocked store-block-review-finalize">BLOCKED</span> :
                                                                                <span className="review-item-Qnty">
                                                                                    <input
                                                                                        autoComplete="off"
                                                                                        ref={childIdx}
                                                                                        disabled = { readOnly}
                                                                                        name="untransmittedOrderQty"
                                                                                        value={THIS.validateGivenValue(item.untransmittedOrderQty) ? parseInt(item.untransmittedOrderQty) + "" : ''}
                                                                                        id={`input${index}-${childIdx}`}
                                                                                        className="review-box"
                                                                                        placeholder="Order"
                                                                                        maxLength="4"
                                                                                        type="number"
                                                                                        onCopy={(e) => {e.preventDefault();}} 
                                                                                        onPaste={(e) => {e.preventDefault();}}
                                                                                        onFocus={(e) => { THIS.getFocus(index, childIdx, `input${index}-${childIdx}`); THIS.handleFocus(e); }}
                                                                                        onBlur={(e) => { THIS.looseFocus(e, index, childIdx); THIS.handleorderQuantityValidation(e, index, childIdx, false, true) }}
                                                                                        onKeyDown={(e) => { if ((e.key === "Enter") || (e.key === "Tab")) THIS.onKeyPressOrderBox(e, index, childIdx); THIS.preventdefaultKeys(e) }}
                                                                                        onChange={(evt) => { THIS.updateOrderQnty(evt, index, childIdx) }} />
                                                                                </span>
                                                                            }

                                                                            {
                                                                                ((itemIndex === childIdx && isSelected && Number.parseInt(item.untransmittedOrderQty) >= 0) || (item && item.hasOwnProperty("untransmittedOrderQty") && Number.parseInt(item.untransmittedOrderQty) >= 0 && item.untransmittedOrderQty !== '')) && (!item.isStoreOrderBlocked) ?
                                                                                    <span ref={index + "reviewLabel" + childIdx} className="review-box-text" > Ordered </span> : ''
                                                                            }
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            </Collapse>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>
                    </div>
                </SideNavBar>

                <div className="ordering-prev">
                    <button id="btn-prev" type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious}>PREVIOUS</button>
                    <button id="enter-on-submit" onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault() }}} type="button" className="btn btn-next d-none d-md-block d-lg-block" onClick={this.onReviewSubmit}>SUBMIT</button>
                </div>
                <div className="ordering-con-mob">
                    <button id="enter-on-submit" onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault() }}} type="button" className="btn btn-next-mob d-md-none d-lg-none d-sm-block" onClick={this.onReviewSubmit}>SUBMIT</button>
                </div>
                {showModal &&
                    <MessageBox
                        msgTitle=""
                        msgBody={msgBoxBody}
                        className={"message-box"}
                        index={itmMsgIndex}
                        initialModalState={false}
                        reviewFinalizePage={false}
                        savedQntyModal={false}
                        orderMinMax={true}
                        modalAction={this.MinMaxModalAction}
                    />}

                {showLDUModal &&
                    <MessageBox
                        msgTitle=""
                        msgBody={msgLDUBody}
                        className={"message-box-ldu"}
                        initialModalState={false}
                        orderMinMax={false}
                        reviewFinalizePage={false}
                        LDUBox={true}
                        savedQntyModal={false}
                        LDUMin={LDUMin}
                        LDUMax={LDUMax}
                        index={itmMsgIndex}
                        cIndex={itmMsgChildIndex}
                        modalAction={this.LduModalAction}
                        lduMinOrderQntyChk={this.lduMinOrderQntyChk}
                        lduMaxOrderQntyChk={this.lduMaxOrderQntyChk} />}

                {showSavedQntyModal &&
                    <MessageBox
                        msgTitle=""
                        msgBody={SavedQntyBody}
                        className={"message-box-ldu"}
                        initialModalState={false}
                        orderMinMax={false}
                        LDUBox={false}
                        reviewFinalizePage={false}
                        savedQntyModal={true}
                        previousSelectionVal={previousSelectionVal}
                        defaultSelectionVal={defaultSelectionVal}
                        index={itmMsgIndex}
                        cIndex={itmMsgChildIndex}
                        modalAction={this.savedQntyModalAction}
                        previousSelectionChk={this.previousSelectionChk}
                        defaultSelectionChk={this.defaultSelectionChk}
                    />
                }
            </div>
        );
    }
}


const mapStateToProps = state => {
    return ({
        groupLevelTrendDetails: state.ordering.groupLevelTrendDetails.payload ? state.ordering.groupLevelTrendDetails.payload : {},
        Items: state.ordering.getItemDetailsForSelectedCategory ? state.ordering.getItemDetailsForSelectedCategory : [],
        checkCategories: state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.checkCategories ? state.ordering.orderingContiueButton.payload.checkCategories : [],
        ItemDetailData: state.ordering.orderingContiueButton && state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.ItemDetailData ? state.ordering.orderingContiueButton.payload.ItemDetailData : {},
        orderRemainingItems: state.ordering.orderingRemainingItems && state.ordering.orderingRemainingItems.payload ? state.ordering.orderingRemainingItems.payload.orderRemainingItems : true,
    });
}
export default connect(
    mapStateToProps
)(withRouter(ReviewFinalize))