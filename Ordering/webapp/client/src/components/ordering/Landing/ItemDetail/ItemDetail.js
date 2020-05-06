import React, { Component } from 'react';
import { Collapse, CardBody, Card } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { storeDetails } from '../../../../lib/storeDetails';
import left_chev from '../../../../assets/images/left-chevron-dark.png';
import right_chev from '../../../../assets/images/right-chevron-dark.png';
import noImageAvailable from '../../../../assets/images/No_Image_Available.jfif';
import './ItemDetail.css';
import LabelInfo from '../ItemDetail/CardDetail/LabelInfo/LabelInfo';
import DisplayBar from '../../../shared/DisplayBar';
import MessageBox from '../../../shared/MessageBox';
import DailyTrend from '../../../ordering/Landing/ItemDetail/CardDetail/DailyTrend/DailyTrend';
import WeeklyTrend from '../../../ordering/Landing/ItemDetail/CardDetail/WeeklyTrend/WeeklyTrend';
import { itemSelectedQty, orderingSelectedLink, postOrderDetails } from '../../../../actions'
import ReactTooltip from 'react-tooltip';
import * as constants from '../../../../constants/ActionTypes';
import QuestionAnswer from './CardDetail/QuestionAnswer/QuestionAnswer';
import FORMULA from './CardDetail/formula/formula';
import getFormulaDates from '../../../utility/questions';
import { ORDER_QTY_REGEX, VALID_KEYS, ALLOWED_KEY_CODES, DISALLOWED_KEYS, DISALLOWED_KEY_CODES } from '../../../utility/constants';
import { determineMinLDU, determineMaxLDU } from '../../../utility/ldu';
import { formatCurrency } from '../../../utility/formatCurrency';
import { imageAvailabilityCheck } from '../../../utility/checkImageAvailability';
import { getItemStatus, getBillbackOrderingFlow } from '../../../utility/promoInfo';
import { singleDay, multiDay, nonDaily, START_PROMOTION, ON_PROMOTION, END_PROMOTION } from '../../../../constants/ActionTypes';
import { validateRolesAndReadOnlyView } from '../../../utility/validateRolesAndReadOnlyView';

class ItemDetail extends Component {
    state = {
        panelOpener: 0,
        Item: {},
        Items: [],
        selectedTab: 'weekly',
        selectedItems: [],
        selectedLink: '',
        QuestionDays: getFormulaDates(),
        isDisplayCardEnabled: true,
        currentQuestionIndex: [0],
        isFormulaEnabled: [false],
        isPrevClicked: false,
        showModal: false,
        msgBoxBody: '',
        showLDUModal: false,
        msgLDUBody: '',
        LDUMin: '',
        LDUMax: '',
        itmMsgIndex: '',
        prevLength: 0,
        showSavedQntyModal: false,
        SavedQntyBody: '',
        counter: 0,
        storeId: storeDetails() && storeDetails().storeId,
        savedQnty: '',
        multiDayInputValues: {
            totalUnits: '',
            totalExpire: '',
            totalOrderSell: '',
            totalForeCastSell: ''
        },
        nonDailyInputValues: {
            totalBalanceOnHandQty: '',
            minimumOnHandQty: '',
            forecastSellQnty: ''
        },
        isSelected: false,
        lastCall: (new Date()).getTime(),
        delay: 350,
        readOnly: validateRolesAndReadOnlyView()
    }

    constructor(props) {
        super(props);
        this.lduMinOrderQntyChk = this.lduMinOrderQntyChk.bind(this);
        this.lduMaxOrderQntyChk = this.lduMaxOrderQntyChk.bind(this);
        this.previousSelectionChk = this.previousSelectionChk.bind(this);
        this.defaultSelectionChk = this.defaultSelectionChk.bind(this);
        this.alignItem = this.alignItem.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
    }

    onUnload() { // the method that will be used for both add and remove event
        const { panelOpener, index, Items, OrderingCycleType } = this.state;
        if (panelOpener === index) {
            this.props.dispatch(itemSelectedQty({
                selectedItems: Items,
                OrderingCycleType: constants[OrderingCycleType]
            }));
        }
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload)
        this.setState({
            Item: Object.keys(this.state.Item).length !== 0 ? this.state.Item : this.props.Item,
            Items: this.state.Items.length !== 0 ? this.state.Items : this.props.Items,
            savedQnty: Object.keys(this.state.Item).length !== 0 ? this.state.Item.untransmittedOrderQty : this.props.Item.untransmittedOrderQty,
            index: this.props.index,
            selectedLink: this.props.selectedLink,
            OrderingCycleType: this.props.OrderingCycleType,
            QuestionDays: (this.props.index === this.props.panelOpener) ? getFormulaDates(this.props.Items, this.props.OrderingCycleType) : ''
        }, () => {
            const { index, panelOpener, OrderingCycleType, Item } = this.props;
            this.setState({
                selectedTab: this.props.OrderingCycleType === multiDay ? "daily" : "weekly",
                currentQuestionIndex: new Array(this.props.Items && this.props.Items.length ? this.props.Items.length : 1).fill(0),
                isFormulaEnabled: new Array(this.props.Items && this.props.Items.length ? this.props.Items.length : 1).fill(false)
            });

            if (index === panelOpener && Item.isStoreOrderBlocked) { // check if current item is valid (non storeBlocked)
                const nextValidItemIndex = this.getNextValidItemIndex(index);
                if (this.validateGivenValue(nextValidItemIndex)) {
                    this.props.resetPanelOpener(nextValidItemIndex, false);
                }
            }

            if (OrderingCycleType !== singleDay) {
                this.multiDayNonDailyQuestionValues(Object.keys(this.state.Item).length !== 0 ? this.state.Item : this.props.Item);
            }
        })
    }

    multiDayNonDailyQuestionValues(Item) {
        this.setState({
            multiDayInputValues: {
                totalUnits: Item.totalBalanceOnHandQty,
                totalExpire: Item.todayBalanceOnHandQty,
                totalOrderSell: Item.todaySalesForecastQty,
                totalForeCastSell: Item.tomorrowSalesForecastQty
            },
            nonDailyInputValues: {
                totalBalanceOnHandQty: Item.totalBalanceOnHandQty,
                minimumOnHandQty: Item.minimumOnHandQty,
                forecastSellQnty: Item.tomorrowSalesForecastQty
            }
        })
    }

    componentWillReceiveProps(newProps) {
        if (newProps.panelOpener === newProps.index || newProps.previousPanelOpenner === newProps.index) {
            this.setState({
                selectedLink: newProps.selectedLink,
                OrderingCycleType: newProps.OrderingCycleType,
                estOrder: (newProps.inputItmQnty && newProps.inputItmQnty.estOrder) || 0,
                itmIdx: (newProps.inputItmQnty && newProps.inputItmQnty.itmIdx) || 0,
                QuestionDays: getFormulaDates(newProps.Items, newProps.OrderingCycleType),
                index: newProps.index,
                panelOpener: newProps.panelOpener,
                counter: this.state.counter + 1
            }, () => {
                const { Items, OrderingCycleType, index, panelOpener, Item } = this.state
                setTimeout(() => {
                    if (this.refs[newProps.panelOpener]) {
                        this.refs[newProps.panelOpener].focus();
                    }
                }, 10);

                if (newProps.previousButtonClicked === true && index === panelOpener && this.validateGivenValue(Item.untransmittedOrderQty) && (OrderingCycleType === multiDay || OrderingCycleType === nonDaily)) {
                    this.handleorderQuantityValidation(false, index, false, true, false, false, true, false);
                } else if (newProps.previousButtonClicked === true && index === panelOpener && this.validateGivenValue(Item.untransmittedOrderQty) && OrderingCycleType === singleDay) {
                    this.props.onPreviousButtonOrderDetail(true);
                } else if (newProps.previousButtonClicked === true && index === panelOpener) {
                    this.props.onPreviousButtonOrderDetail(true);
                }


                if (newProps.reviewFinalizeClicked === true && index === panelOpener && this.validateGivenValue(Item.untransmittedOrderQty) && (OrderingCycleType === multiDay || OrderingCycleType === nonDaily)) {
                    this.handleorderQuantityValidation(false, index, false, true, false, false, false, true);
                } else if (newProps.reviewFinalizeClicked === true && index === panelOpener && this.validateGivenValue(Item.untransmittedOrderQty) && OrderingCycleType === singleDay) {
                    this.props.onReviewFinalizeButtonResponse(true);
                } else if (newProps.reviewFinalizeClicked === true && index === panelOpener) {
                    this.props.onReviewFinalizeButtonResponse(true);
                }

                if (this.state.selectedLink === "Review-Submitted") {
                    this.props.dispatch(itemSelectedQty({
                        selectedItems: Items,
                        OrderingCycleType: constants[OrderingCycleType]
                    }))
                    this.props.dispatch(orderingSelectedLink({
                        selectedLink: 'Review',
                    }))
                }

                if (index === panelOpener) {
                    this.alignItem(index, panelOpener);
                }

                if (newProps.previousPanelOpenner === newProps.index && this.validateGivenValue(Item.untransmittedOrderQty)) {
                    const { savedQnty, multiDayInputValues, OrderingCycleType, nonDailyInputValues } = this.state;

                    if (Item.untransmittedOrderQty >= 0 && savedQnty !== Item.untransmittedOrderQty && OrderingCycleType === singleDay) {
                        this.handleorderQuantityValidation(false, index, false, true, false, true, false, false);
                    } else if (Item.untransmittedOrderQty >= 0 && OrderingCycleType === multiDay) {
                        if ((savedQnty !== Item.untransmittedOrderQty) || ((multiDayInputValues.totalUnits !== Item.totalUnits) || (multiDayInputValues.totalExpire !== Item.totalExpire) || (multiDayInputValues.totalForeCastSell !== Item.totalForeCastSell) || (multiDayInputValues.totalOrderSell !== Item.totalOrderSell))) {
                            this.handleorderQuantityValidation(false, index, false, true, false, true, false, false);
                        }
                    } else if (Item.untransmittedOrderQty >= 0 && OrderingCycleType === nonDaily) {
                        if ((savedQnty !== Item.untransmittedOrderQty) || ((nonDailyInputValues.totalBalanceOnHandQty !== Item.totalBalanceOnHandQty) || (nonDailyInputValues.minimumOnHandQty !== Item.minimumOnHandQty) || (nonDailyInputValues.forecastSellQnty !== Item.forecastSellQnty))) {
                            this.handleorderQuantityValidation(false, index, false, true, false, true, false, false);
                        }
                    }
                }
            });
        }
    }

    checkItemAndSubmit() {
        const { savedQnty, multiDayInputValues, OrderingCycleType, Item, storeId, nonDailyInputValues } = this.state;
        let itemsArray = [];

        if (parseInt(Item.untransmittedOrderQty) >= 0 && savedQnty !== Item.untransmittedOrderQty && OrderingCycleType === singleDay) {
            itemsArray.push(Item);
            this.setState({ savedQnty: Item.untransmittedOrderQty })
            this.props.dispatch(postOrderDetails({
                Items: itemsArray,
                storeId: storeId
            }));
        } else if (Item.untransmittedOrderQty >= 0 && OrderingCycleType === multiDay && ((savedQnty !== Item.untransmittedOrderQty) || (multiDayInputValues.totalUnits !== Item.totalUnits) || (multiDayInputValues.totalExpire !== Item.totalExpire) || (multiDayInputValues.totalForeCastSell !== Item.tomorrowSalesForecastQty) || (multiDayInputValues.totalOrderSell !== Item.todaySalesForecastQty))) {
            itemsArray.push(Item);
            this.setState({
                savedQnty: Item.untransmittedOrderQty,
                multiDayInputValues: {
                    totalUnits: Item.totalUnits,
                    totalExpire: Item.totalExpire,
                    totalOrderSell: Item.todaySalesForecastQty,
                    totalForeCastSell: Item.tomorrowSalesForecastQty
                }
            })
            this.props.dispatch(postOrderDetails({
                Items: itemsArray,
                storeId: storeId
            }));
        } else if (parseInt(Item.untransmittedOrderQty) >= 0 && OrderingCycleType === nonDaily && ((savedQnty !== Item.untransmittedOrderQty) || ((nonDailyInputValues.totalBalanceOnHandQty !== Item.totalBalanceOnHandQty) || (nonDailyInputValues.minimumOnHandQty !== Item.minimumOnHandQty) || (nonDailyInputValues.forecastSellQnty !== Item.tomorrowSalesForecastQty)))) {
            itemsArray.push(Item);
            this.setState({
                savedQnty: Item.untransmittedOrderQty,
                nonDailyInputValues: {
                    totalBalanceOnHandQty: Item.totalBalanceOnHandQty,
                    minimumOnHandQty: Item.minimumOnHandQty,
                    forecastSellQnty: Item.tomorrowSalesForecastQty
                }
            })
            this.props.dispatch(postOrderDetails({
                Items: itemsArray,
                storeId: storeId
            }));
        }
    }

    onArrow = (index) => {
        this.props.resetPanelOpener(index, false);
    }

    onKeyPressOrderBox(event, index) {
        const nextIndex = this.getNextValidItemIndex(index);
        const { Items } = this.state;
        if (nextIndex) {
            if (Items.length === nextIndex) {
                this.handleorderQuantityValidation(event, index, true, true, false, false, false, false);
            } else {
                this.handleorderQuantityValidation(event, index, false, true, nextIndex, false, false, false);
            }
        }
    }

    getNextValidItemIndex(currentIndex) {
        const { Items } = this.state;
        if (Items[currentIndex + 1] && Items[currentIndex + 1].isStoreOrderBlocked) {
            return this.getNextValidItemIndex(currentIndex + 1);
        } else if (Items.length >= currentIndex) {
            return currentIndex + 1;
        }
        if (Items.length <= currentIndex + 1) {
            let d = document.getElementById("enter-on-review");
            if (d.classList.contains('add-cursor')) {
                this.props.dispatch(itemSelectedQty({
                    selectedItems: this.state.Item,
                    OrderingCycleType: constants[this.state.OrderingCycleType]
                }))
                this.props.dispatch(orderingSelectedLink({
                    selectedLink: 'Review',
                }))
            } else {
                d.className += ' add-cursor';
            }
        } else {
            return currentIndex + 1;
        }
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
        });
        setTimeout(() => {
            document.getElementById("orderMin").focus();
        }, 1);
    }

    lduMinOrderQntyChk(minVal, index) {
        let { Item, Items } = this.state;
        Item.untransmittedOrderQty = minVal;
        Items[index] = Item
        this.setState({ Item: Item, Items: Items });
        this.refs[index].focus();
        this.refs[index].select();
    }

    lduMaxOrderQntyChk(maxVal, index) {
        let { Item, Items } = this.state;
        Item.untransmittedOrderQty = maxVal;
        Items[index] = Item
        this.setState({ Item: Item, Items: Items });
        this.refs[index].focus();
        this.refs[index].select();
    }

    previousSelectionChk(preVal, index) {
        let { Items, Item } = this.state;
        Item.untransmittedOrderQty = preVal;
        Item.savedQuantity = preVal;
        Items[index] = Item
        this.setState({ Item: Item, Items: Items });
        this.refs[index].focus();
        this.refs[index].select();
    }

    defaultSelectionChk(defaultVal, index) {
        let { Items, Item } = this.state;
        Item.untransmittedOrderQty = defaultVal;
        Item.savedQuantity = defaultVal;
        Items[index] = Item
        this.setState({ Item: Item, Items: Items });
        this.refs[index].focus();
        this.refs[index].select();
    }

    alignItem(index, panelOpener) {
        if (index === panelOpener) {
            setTimeout(function () {
                const itemAccoudian = document.getElementById(`div-${index}`);
                itemAccoudian && itemAccoudian.scrollIntoView({
                    block: window.innerWidth > 768 ? 'start' : 'start',
                    // inline: window.innerWidth > 768 ? 'nearest': 'center',
                    behavior: "smooth"
                });
            }, 500);
        }
    }

    handleorderQuantityValidation(event, index, lastItem, submitOrder, nextIndex, onPannelOpenner, onPreviousClick, onReviewClick) {
        let isPopUp = false;
        let { Item, Items, lastCall, delay } = this.state;
        const now = (new Date()).getTime();
        let inputQnty = event && !onPannelOpenner ? event.target.value ? parseInt(event.target.value) : '' : Item.untransmittedOrderQty;
        /**Show Modal- Previous and default selection */
        let SavedQntyBody = `Choose a desired Order Quantity:`;
        let savedQuantity = Item['savedQuantity'];
        if (inputQnty === "" && Item.hasOwnProperty('savedQuantity') && Item['savedQuantity'] !== null && Item['savedQuantity'] > 0) {
            this.setState({
                SavedQntyBody: SavedQntyBody,
                showSavedQntyModal: true,
                previousSelectionVal: savedQuantity,
                defaultSelectionVal: 0,
                itmMsgIndex: index
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
            /**Order Min/Max */
            let minQnty = Item.minimumAllowableOrderQty;
            let maxQnty = Item.maximumAllowableOrderQty;
            /**LDU Check */
            let ldu = Item && Item.ldu;
            let maxLDU = determineMaxLDU(ldu, inputQnty);
            let msgLDUBody = `The order quantity is not a multiple of LDU. Choose one of the below:`;
            let findMinLDU = determineMinLDU(ldu, inputQnty);
            //SavedQuantity Message
            if (Item['savedQuantity'] === 0 && (inputQnty === 0 || inputQnty === "")) {
                Item.untransmittedOrderQty = 0;
            } else if (inputQnty === "") {
                Item.untransmittedOrderQty = null;
            } else if (inputQnty === 0) {
                Item.untransmittedOrderQty = 0;
            } else {
                if (inputQnty >= minQnty && inputQnty <= maxQnty) {
                    if (inputQnty % ldu === 0) {
                        Item.untransmittedOrderQty = inputQnty;
                    } else {
                        this.setState({
                            msgLDUBody: msgLDUBody,
                            showLDUModal: true,
                            LDUMin: findMinLDU,
                            LDUMax: maxLDU,
                            itmMsgIndex: index
                        })
                        setTimeout(() => {
                            let defaultButton = document.getElementById("btn-ldu-min"); // only for ldu
                            if (defaultButton) {
                                defaultButton.focus();
                            }
                        }, 1);
                        isPopUp = true;
                    }
                } else if (inputQnty < minQnty) {
                    //Display Min Message
                    this.displayMessageBox(inputQnty, minQnty, index);
                    Item.untransmittedOrderQty = minQnty;
                    this.setState({
                        panelOpener: index
                    });
                    this.refs[index].focus();
                    isPopUp = true;
                } else if (inputQnty > maxQnty) {
                    //Display Max Message
                    this.displayMessageBox(inputQnty, maxQnty, index);
                    Item.untransmittedOrderQty = maxQnty;
                    this.setState({
                        panelOpener: index
                    });
                    this.refs[index].focus();
                    isPopUp = true;
                } else {
                    Item.untransmittedOrderQty = '';
                }
            }
            if (this.validateGivenValue(Item.untransmittedOrderQty)) {
                Item.savedQuantity = Item.untransmittedOrderQty;
            }
            Items[index] = Item;
            this.setState({
                Item: Item,
                Items: Items,
            }, () => {
                if (isPopUp && onPannelOpenner && now - lastCall > delay) {
                    this.setState({ lastCall: now }, () => {
                        this.props.resetPanelOpener(index, event);
                    });
                }

                if (!isPopUp && submitOrder) {
                    this.checkItemAndSubmit();
                }

                if (onPreviousClick) {
                    this.props.onPreviousButtonOrderDetail(!isPopUp);
                }

                if (onReviewClick) {
                    this.props.onReviewFinalizeButtonResponse(!isPopUp);
                }

                if (!isPopUp && nextIndex && now - lastCall > delay) {
                    this.setState({ lastCall: now }, () => {
                        this.props.resetPanelOpener(nextIndex, event);
                    });
                }

                if (lastItem && !isPopUp && submitOrder) {
                    setTimeout(() => {
                        document.getElementById("enter-on-review").focus();
                    }, 50);
                }
            });
        }
    }

    handleorderQuantity(event, index) {
        let { Item, Items } = this.state;
        let inputQnty = event.target.value;
        if (ORDER_QTY_REGEX.test(inputQnty)) {
            Item.untransmittedOrderQty = inputQnty;
            Items[index] = Item
            this.setState({
                Item: Item,
                Items: Items,
            });
        }
    }

    getFocus(index, panelOpener) {
        const { lastCall, delay } = this.state;
        const now = (new Date()).getTime();
        if (now - lastCall > delay && index !== panelOpener) {
            this.setState({ lastCall: now }, () => {
                this.props.resetPanelOpener(index, true);
            });
        }
    }

    handleFocus(event) {
        event.target.select();
    }

    onTabChange = (selectedTab) => {
        this.setState({ selectedTab: selectedTab });
    };

    determineCycleType = () => {
        if (this.state.OrderingCycleType === singleDay) {
            return 'item-color-singleday'
        } else if (this.state.OrderingCycleType === multiDay) {
            return 'item-color-multiday'
        } else {
            return 'item-color-nondaily'
        }
    }

    MinMaxModalAction = (showModal, index) => {
        this.setState({ showModal: showModal, isSelected: true });
        this.refs[index].select();
    }

    LduModalAction = (showLDUModal, index, cIndex) => {
        this.setState({ showLDUModal: showLDUModal });
        this.refs[index].focus();
        this.refs[index].select();
    }

    savedQntyModalAction = (showSavedQntyModal, index, cIndex) => {
        this.setState({ showSavedQntyModal: showSavedQntyModal });
        this.refs[index].focus();
        this.refs[index].select();
    }

    hideDisplayCard = (value) => {
        this.setState({ isDisplayCardEnabled: value })
    }

    formulaEnabled = (index, value) => {
        let isFormulaEnabled = this.state.isFormulaEnabled
        isFormulaEnabled[index] = value
        this.setState({ isFormulaEnabled: isFormulaEnabled })
    }

    itemChanged = (updatedItem, Itemidx) => {
        let { Items } = this.state;
        Items[Itemidx] = updatedItem;
        this.setState({ Item: updatedItem, counter: this.state.counter + 1, Items: Items })
    }

    onPrevQuestionClick = (index) => {
        let currentQuestionIndex = this.state.currentQuestionIndex;
        const THIS = this;
        if (currentQuestionIndex[index] > 0) {
            currentQuestionIndex[index] = currentQuestionIndex[index] - 1;
        }

        this.setState({
            currentQuestionIndex: currentQuestionIndex, dummy: THIS.state.dummy + 1, isPrevClicked: true,
            isDisplayCardEnabled: true
        });
    }

    determineQuestionIndex = (Itemidx, nextIndex) => {
        const { OrderingCycleType } = this.state;
        let isDisplayCardEnabled = this.state.isDisplayCardEnabled
        let isFormulaEnabled = this.state.isFormulaEnabled;
        let currentQuestionIndex = this.state.currentQuestionIndex;
        currentQuestionIndex[Itemidx] = nextIndex;
        if (currentQuestionIndex[Itemidx] === 4 && OrderingCycleType === multiDay) {
            isFormulaEnabled[Itemidx] = true;
            isDisplayCardEnabled = false;
        }
        if (currentQuestionIndex[Itemidx] === 1 && OrderingCycleType === nonDaily) {
            isFormulaEnabled[Itemidx] = true;
            isDisplayCardEnabled = false;
        }

        this.setState({ currentQuestionIndex: currentQuestionIndex, isFormulaEnabled: isFormulaEnabled, dummy: this.state.dummy + 1, isDisplayCardEnabled: isDisplayCardEnabled })
    }

    onNextQuestionClick = (index) => {
        let currentQuestionIndex = this.state.currentQuestionIndex;
        let isDisplayCardEnabled = this.state.isDisplayCardEnabled

        const { OrderingCycleType } = this.state;
        const THIS = this;

        if (currentQuestionIndex[index] < 4) {
            currentQuestionIndex[index] = currentQuestionIndex[index] + 1;
            if (currentQuestionIndex[index] === 4 && OrderingCycleType === multiDay) {
                if (this.refs[`${index}-${3}reviewLabel`]) {
                    this.refs[`${index}-${3}reviewLabel`].style.display = "none";
                }
                isDisplayCardEnabled = false;
            }
            if (currentQuestionIndex[index] === 1 && OrderingCycleType === nonDaily) {
                if (this.refs[`${index}-${0}reviewLabel`]) {
                    this.refs[`${index}-${0}reviewLabel`].style.display = "none";
                }
                isDisplayCardEnabled = false;
            }
        }
        if( currentQuestionIndex[index]=== 4 && OrderingCycleType === multiDay ){
          this.refs[index].focus();
        } 

        if( currentQuestionIndex[index] === 1 && OrderingCycleType === nonDaily ) {
          this.refs[index].focus();
        }

        this.setState({
            currentQuestionIndex: currentQuestionIndex,
            dummy: THIS.state.dummy + 1,
            isPrevClicked: false,
            isDisplayCardEnabled: isDisplayCardEnabled
        });
    }

    ispViewFormula = (index, Item) => {
        const { counter } = this.state;
        return (
            <FORMULA
                OrderingCycleType={this.state.OrderingCycleType}
                Item={Item}
                index={index}
                key={index}
                counter={counter + 1}
                itemChanged={this.itemChanged}
            />
        )
    }

    mobileViewFormula = (panelOpener, index, Item) => {
        const { currentQuestionIndex, OrderingCycleType, counter, isFormulaEnabled } = this.state;
        if (panelOpener === index && isFormulaEnabled[index] && window.innerWidth <= 768 && ((currentQuestionIndex[index] === 4 && OrderingCycleType === multiDay) || (currentQuestionIndex[index] === 1 && OrderingCycleType === nonDaily))) {
            return (
                <div>
                    {OrderingCycleType !== singleDay && !Item.isStoreOrderBlocked && panelOpener === index &&

                        <div className={panelOpener === index ? window.innerWidth <= 768 ? OrderingCycleType === multiDay ? "row" : "row" : "row" : "hide-for-collapse"}>
                            <div className="col-1" >
                                <img className={OrderingCycleType === multiDay ? 'left-chev-formula' : 'mob-mg-top-chev-left'} src={left_chev} onClick={() => { this.onPrevQuestionClick(index) }} alt="" />
                            </div>
                            <div className={OrderingCycleType === multiDay ? "col-10 no-padding" : "col-10 non-daily-formula"}>
                                <FORMULA
                                    OrderingCycleType={OrderingCycleType}
                                    Item={Item}
                                    index={index}
                                    key={index}
                                    counter={counter}
                                    itemChanged={this.itemChanged}
                                    question={this.state.QuestionDays[Item.itemId]}
                                />
                            </div>
                        </div>
                    }
                </div>
            )
        }
    }

    highlightSelectedTrend = (highlightSelectedTrend) => {
        this.setState({ highlightSelectedTrend: highlightSelectedTrend })
        if ((this.props.OrderingCycleType === multiDay) && (highlightSelectedTrend && highlightSelectedTrend.selectedTab)) {
            this.setState({ selectedTab: highlightSelectedTrend.selectedTab })
        } else {
            if (window.innerWidth <= 768 && this.props.OrderingCycleType === multiDay) {
                this.setState({ selectedTab: 'daily' })
            } else {
                this.setState({ selectedTab: 'weekly' })
            }
        }
    }

    toggleQuestionAnswerForDesktop = (index, Item) => {
        const { OrderingCycleType, panelOpener } = this.state;
        return (
            <div>{
                OrderingCycleType !== singleDay && !Item.isStoreOrderBlocked &&
                <div className={this.state.OrderingCycleType !== singleDay ? 'QA-box-ItemDetail add-margin-QACard' : 'QA-box-ItemDetail'}>
                    <QuestionAnswer
                        itemID={Item.itemId}
                        question={this.state.QuestionDays && this.state.QuestionDays[Item.itemId]}
                        Itemidx={index}
                        Item={Item}
                        key={index}
                        panelOpener={panelOpener}
                        formulaEnabled={this.formulaEnabled}
                        itemChanged={this.itemChanged}
                        OrderingCycleType={OrderingCycleType}
                        hideDisplayCard={this.hideDisplayCard}
                        reviewFinalizePage={false}
                        highlightSelectedTrendBox={this.highlightSelectedTrend}
                    />
                </div>
            }
            </div>
        )
    }

    toggleQuestionAnswerForMobile = (index, Item) => {
        const { currentQuestionIndex, OrderingCycleType, panelOpener, isFormulaEnabled } = this.state;
        return (
            <div>
                <div>{OrderingCycleType !== singleDay && !Item.isStoreOrderBlocked &&
                    <div className={OrderingCycleType !== singleDay ? 'add-margin-QACard row' : ' row'}>
                        <div className={((currentQuestionIndex[index] === 4 && OrderingCycleType === multiDay) || (currentQuestionIndex[index] === 1 && OrderingCycleType === nonDaily)) && window.innerWidth <= 768 ? 'adjust-chevron-left col-1' : 'col-1'}>
                            <img className={currentQuestionIndex[index] < 1 ? 'left-chev hide-for-QA-Trend' : 'left-chev'} src={left_chev} onClick={() => { this.onPrevQuestionClick(index) }} alt="" />
                        </div>
                        <div className="col-10 no-padding-right-padding-left">
                            <QuestionAnswer
                                itemID={Item.itemId}
                                question={this.state.QuestionDays && this.state.QuestionDays[Item.itemId]}
                                Itemidx={index}
                                Item={Item}
                                key={index}
                                panelOpener={panelOpener}
                                OrderingCycleType={this.state.OrderingCycleType}
                                hideDisplayCard={this.hideDisplayCard}
                                formulaEnabled={this.formulaEnabled}
                                itemChanged={this.itemChanged}
                                determineQuestionIndex={this.determineQuestionIndex}
                                currentQuestionIndex={currentQuestionIndex[index]}
                                reviewFinalizePage={false}
                                isPrevClicked={this.state.isPrevClicked}
                                highlightSelectedTrendBox={this.highlightSelectedTrend}
                            />
                        </div>
                        <div className="col-1 no-padding-left">
                            <img className={((OrderingCycleType === multiDay && ((currentQuestionIndex[index] > 3 && isFormulaEnabled[index]) || (currentQuestionIndex[index] > 2 && !isFormulaEnabled[index]))) || (OrderingCycleType === nonDaily && ((currentQuestionIndex[index] > 0 && isFormulaEnabled[index]) || (currentQuestionIndex[index] === 0 && !isFormulaEnabled[index])))) ? 'right-chev hide-for-QA-Trend' : 'right-chev'} src={right_chev} onClick={() => { this.onNextQuestionClick(index) }} alt="" />
                        </div>
                    </div>
                }
                </div>
            </div>
        )
    }

    validateGivenValue(value) {
        if (value !== "" && value !== null && Number.isInteger(value) && value >= 0) {
            return true;
        }
        return false
    }

    getPromoTextAndColor(promoText) {
        let displayText = "";
        let color = "#5b616b"

        if (promoText === START_PROMOTION) {
            displayText = "P+";
            color = "#018062";
        } else if (promoText === ON_PROMOTION) {
            displayText = "P";
            color = "#6e61a7";
        } else if (promoText === END_PROMOTION) {
            displayText = "P-"
            color = "#ec2526";
        }

        return {
            text: displayText, color: color
        }
    }

    addImage =(img)=>{
        if(img && img.target){
            img.target.src = noImageAvailable
        }
    }

    preventdefaultKeys = (e)=>{
        const { lastCall, delay } = this.state;
        if((DISALLOWED_KEYS.includes(e.key) || DISALLOWED_KEY_CODES.includes(e.keyCode)) && ( !(ALLOWED_KEY_CODES.includes(e.keyCode) && (new Date()).getTime() - lastCall < delay)|| !VALID_KEYS.includes(e.key) )) {
            e.preventDefault();
        }
    }

    render() {

        const { panelOpener,
            Item,
            index,
            OrderingCycleType,
            showModal,
            msgBoxBody,
            showLDUModal,
            msgLDUBody,
            LDUMin,
            LDUMax,
            itmMsgIndex,
            showSavedQntyModal,
            SavedQntyBody,
            previousSelectionVal,
            defaultSelectionVal,
            isSelected,
            readOnly,
            lastCall,
            delay
        } = this.state;

        return (
            <div key={`${index}`}>
                {Item && Object.keys(Item).length !== 0 &&
                    <div key={index} className="item-detail-accordion" count={index + 1} id={`div-${index}`} >
                        <div className="item-detail-card">
                            <div className={this.determineCycleType().toString()}>
                                {panelOpener === index && OrderingCycleType === multiDay && !Item.isStoreOrderBlocked && this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly) && window.innerWidth > 768 &&
                                    <div className="item-name-active row" data-tip data-event={`${panelOpener === index ? '' : ''}`} data-for="item" alt="item-info">
                                        <u>{Item.itemShortName}</u>
                                        <span className="item-name-promo-gap"></span>
                                        {panelOpener === index && Item.itemPromotionStatus ?
                                            <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(Item.itemPromotionStatus).text}</span> : ''
                                        }
                                        {
                                            panelOpener === index ?
                                                <span>
                                                    <ReactTooltip
                                                        className="item-detail-info"
                                                        place="bottom"
                                                        id='item'
                                                        type='light'
                                                        disabled={true}
                                                        effect="solid"
                                                        globalEventOff='click'
                                                        eventOff="mouseleave mouseout scroll mousewheel blur"
                                                    >
                                                        <div>
                                                            {
                                                                this.state.OrderingCycleType === multiDay &&
                                                                <div><span className="item-detail-info">{Item.leadTime + ' Day Lead, ' + Item.shelfLife + ' Day shelf life'}</span></div>
                                                            }
                                                            <div><span className="item-detail-info">Item Description: {Item.itemName || ''}</span></div>
                                                            <div><span className="item-detail-info">UPC: {Item.itemUPC || ''}</span></div>
                                                            <div><span className="item-detail-info">Item Number: {Item.itemId || ''}</span></div>
                                                            <div><span className="item-detail-info">Store Rank: {Item.storeRank || ''}</span></div>
                                                            <div><span className="item-detail-info">Market Rank: {Item.marketRank}</span></div>
                                                            <div><span className="item-detail-info">Registration: {Item.registrationStatus ? Item.registrationStatus.split('')[0].toUpperCase() : ''}</span></div>
                                                            <div><span className="item-detail-info">Retail: {formatCurrency(Item.retailPrice, '$')}</span></div>
                                                            {/** Bill Back and Item Status*/}
                                                            {
                                                                Item.itemStatus &&
                                                                <div><span className="item-detail-info">Status: {getItemStatus(Item.itemStatus, true)}</span></div>
                                                            }
                                                            <div><span className="item-detail-info">Billback: {getBillbackOrderingFlow(Item.isBillBackAvailable)}</span></div>
                                                        </div>
                                                    </ReactTooltip>
                                                </span>
                                                : null
                                        }
                                    </div>
                                }
                                {panelOpener === index && OrderingCycleType === nonDaily && !Item.isStoreOrderBlocked && (this.validateGivenValue(Item.forecastSellQnty) || this.validateGivenValue(Item.tomorrowSalesForecastQty)) && window.innerWidth > 768 &&
                                    <div className="item-name-active row" data-tip data-event={`${panelOpener === index ? '' : ''}`} data-for="item" alt="item-info">
                                        <u>{Item.itemShortName}</u>
                                        <span className="item-name-promo-gap"></span>
                                        {panelOpener === index && Item.itemPromotionStatus ?
                                            <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(Item.itemPromotionStatus).text}</span> : ''
                                        }
                                        {
                                            panelOpener === index ?
                                                <span>
                                                    <ReactTooltip
                                                        className="item-detail-info"
                                                        place="bottom"
                                                        id='item'
                                                        type='light'
                                                        disabled={true}
                                                        effect="solid"
                                                        globalEventOff='click'
                                                        eventOff="mouseleave mouseout scroll mousewheel blur"
                                                    >
                                                        <div>
                                                            <div><span className="item-detail-info">Item Description: {Item.itemName || ''}</span></div>
                                                            <div><span className="item-detail-info">UPC: {Item.itemUPC || ''}</span></div>
                                                            <div><span className="item-detail-info">Item Number: {Item.itemId || ''}</span></div>
                                                            <div><span className="item-detail-info">Store Rank: {Item.storeRank || ''}</span></div>
                                                            <div><span className="item-detail-info">Market Rank: {Item.marketRank}</span></div>
                                                            <div><span className="item-detail-info">Registration: {Item.registrationStatus ? Item.registrationStatus.split('')[0].toUpperCase() : ''}</span></div>
                                                            <div><span className="item-detail-info">Retail: {formatCurrency(Item.retailPrice, '$')}</span></div>
                                                            {/** Bill Back and Item Status*/}
                                                            {
                                                                Item.itemStatus &&
                                                                <div><span className="item-detail-info">Status: {getItemStatus(Item.itemStatus, true)}</span></div>
                                                            }
                                                            <div><span className="item-detail-info">Billback: {getBillbackOrderingFlow(Item.isBillBackAvailable)}</span></div>
                                                        </div>
                                                    </ReactTooltip>
                                                </span>
                                                : null
                                        }
                                    </div>
                                }

                                {panelOpener === index && window.innerWidth <= 768 &&
                                    <div className="item-name-active row" data-tip data-iscapture='true' data-scroll-hide='true' data-event={`${panelOpener === index ? 'click' : ''}`} data-for="item" alt="item-info">
                                        <u>{Item.itemShortName}</u>
                                        <span className="item-name-promo-gap"></span>
                                        {panelOpener === index && Item.itemPromotionStatus ?
                                            <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(Item.itemPromotionStatus).text}</span> : ''
                                        }
                                    </div>
                                }

                                <div className={panelOpener === index ? window.innerWidth <= 768 ? this.state.OrderingCycleType !== singleDay ? 'heading-styling row rmv-margin-product-card mob-margin add-margin-multi' : 'heading-styling row rmv-margin-product-card mob-margin' : 'heading-styling row' : 'heading-styling row'}>
                                    <div className={panelOpener === index ? window.innerWidth <= 768 ? 'col-3 col-sm-3 col-md-1 center-block rmv-pd-itm-image' : 'col-3 col-sm-3 col-md-1 center-block itm-pd' : 'col-3 col-sm-3 col-md-1 center-block itm-pd'} disabled={panelOpener === index ? false : true} >
                                        <span className="image-container">
                                                <img id="item-logo" src={imageAvailabilityCheck(Item)} alt="Item_Image" onError = {(e)=>this.addImage(e)} />
                                        </span>
                                    </div>

                                        <div className={panelOpener !== index ? "col-md-9 mob-adjustments-item-name" : "test"} disabled={true}>
                                            <span className={`item-name${panelOpener === index ? '-active' : ' collapse-panel-margin'}`} >
                                                {panelOpener === index ?
                                                    <span>
                                                        <ReactTooltip
                                                            className="item-detail-info"
                                                            place="bottom"
                                                            id='item'
                                                            type='light'
                                                            disabled={true}
                                                            effect="solid"
                                                        >
                                                            <div>
                                                                {
                                                                    this.state.OrderingCycleType === multiDay &&
                                                                    <div><span className="item-detail-info">{Item.leadTime + ' Day Lead, ' + Item.shelfLife + ' Day shelf life'}</span></div>
                                                                }
                                                                <div><span className="item-detail-info">Item Description: {Item.itemName || ''}</span></div>
                                                                <div><span className="item-detail-info">UPC: {Item.itemUPC || ''}</span></div>
                                                                <div><span className="item-detail-info">Item Number: {Item.itemId || ''}</span></div>
                                                                <div><span className="item-detail-info">Store Rank: {Item.storeRank || ''}</span></div>
                                                                <div><span className="item-detail-info">Market Rank: {Item.marketRank}</span></div>
                                                                <div><span className="item-detail-info">Registration: {Item.registrationStatus ? Item.registrationStatus.split('')[0].toUpperCase() : ''}</span></div>
                                                                <div><span className="item-detail-info">Retail: {formatCurrency(Item.retailPrice, '$')}</span></div>
                                                                {/** Bill Back and Item Status*/}
                                                                {
                                                                    Item.itemStatus &&
                                                                    <div><span className="item-detail-info">Status: {getItemStatus(Item.itemStatus, true)}</span></div>
                                                                }
                                                                <div><span className="item-detail-info">Billback: {getBillbackOrderingFlow(Item.isBillBackAvailable)}</span></div>
                                                            </div>
                                                        </ReactTooltip>
                                                    </span>
                                                    : <span>{window.innerWidth < 768 ?
                                                        Item.itemPromotionStatus ?
                                                            <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>
                                                                <span className="item-name">{Item.itemShortName.substring(0, 10) + "..."}</span>
                                                                {this.getPromoTextAndColor(Item.itemPromotionStatus).text}
                                                            </span>
                                                            : Item.itemShortName.substring(0, 10) + "..."
                                                        : Item.itemPromotionStatus ?
                                                            <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>
                                                                <span className="item-name">{Item.itemShortName}
                                                                    <span className="item-name-status" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(Item.itemPromotionStatus).text}</span>
                                                                </span>

                                                            </span>
                                                            : Item.itemShortName
                                                    }
                                                    </span>
                                                }
                                            </span>
                                        </div>

                                        {/* Reserved for formula: ISP */}
                                        {window.innerWidth > 768 && panelOpener === index &&
                                            <div className="col-md-9">

                                                {OrderingCycleType === singleDay && window.innerWidth > 768 &&
                                                    <div className="item-name-active" data-tip data-event={`${panelOpener === index ? '' : ''}`} data-for="item" alt="item-info">
                                                        <u>{Item.itemShortName}</u>
                                                        <span className="item-name-promo-gap"></span>
                                                        {panelOpener === index && Item.itemPromotionStatus ?
                                                            <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(Item.itemPromotionStatus).text}</span> : ''
                                                        }
                                                    </div>
                                                }

                                                {OrderingCycleType === multiDay && panelOpener === index && !Item.isStoreOrderBlocked && this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly) && window.innerWidth > 768 ?
                                                    <span>
                                                        {this.ispViewFormula(index, Item)}
                                                    </span> :
                                                    <span>
                                                        {OrderingCycleType === multiDay && window.innerWidth > 768 &&
                                                            <div className="item-name-active" data-tip data-event={`${panelOpener === index ? '' : ''}`} data-for="item" alt="item-info">
                                                                <u>{Item.itemShortName}</u>
                                                                <span className="item-name-promo-gap"></span>
                                                                {panelOpener === index && Item.itemPromotionStatus ?
                                                                    <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(Item.itemPromotionStatus).text}</span> : ''
                                                                }
                                                            </div>
                                                        }
                                                    </span>
                                                }

                                                {OrderingCycleType === nonDaily && panelOpener === index && !Item.isStoreOrderBlocked && (this.validateGivenValue(Item.forecastSellQnty) || this.validateGivenValue(Item.tomorrowSalesForecastQty)) && window.innerWidth > 768 ?
                                                    <span>
                                                        {this.ispViewFormula(index, Item)}
                                                    </span> :
                                                    <span>
                                                        {OrderingCycleType === nonDaily && window.innerWidth > 768 &&
                                                            <div className="item-name-active" data-tip data-event={`${panelOpener === index ? '' : ''}`} data-for="item" alt="item-info">
                                                                <u>{Item.itemShortName}</u>
                                                                <span className="item-name-promo-gap"></span>
                                                                {panelOpener === index && Item.itemPromotionStatus ?
                                                                    <span className="promo" style={{ color: this.getPromoTextAndColor(Item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(Item.itemPromotionStatus).text}</span> : ''
                                                                }
                                                            </div>
                                                        }
                                                    </span>
                                                }
                                            </div>
                                        }


                                        <div className={panelOpener === index && window.innerWidth <= 768 ? 'col-3 col-sm-3 col-md-1 add-padding-mobile-expanded' : 'col-3 col-sm-3 col-md-1 text-right-rest'}>
                                            {Item && Item.isStoreOrderBlocked ?
                                                <span className="store-blocked">BLOCKED</span> :
                                                <input
                                                    ref={index}
                                                    id={`input-${index}`}
                                                    autoComplete="off"
                                                    disabled={readOnly}
                                                    tabIndex={index === panelOpener ? 0 : -1}
                                                    name="untransmittedOrderQty"
                                                    autoFocus={index === panelOpener ? true : false}
                                                    value={this.validateGivenValue(parseInt(Item.untransmittedOrderQty)) ? parseInt(Item.untransmittedOrderQty) + '' : ''}
                                                    onKeyDown={(e) => { if (((e.key === "Enter") || (e.key === "Tab")) && ((new Date()).getTime() - lastCall > delay)) { e.persist(); this.onKeyPressOrderBox(e, index) }; this.preventdefaultKeys(e) }}
                                                    onChange={(e) => { this.handleorderQuantity(e, index) }}
                                                    onBlur={(e) => { this.setState({ isSelected: false }); this.handleorderQuantityValidation(e, index, false, true, false, false, false, false) }}
                                                    className="order-box qty-expanded"
                                                    placeholder="Order"
                                                    maxLength="4"
                                                    onFocus={(evt) => { this.setState({ isSelected: true }); this.getFocus(index, panelOpener); this.handleFocus(evt) }}
                                                    type="number"
                                                    onCopy={(e) => {e.preventDefault();}} 
                                                    onPaste={(e) => {e.preventDefault();}}
                                                />

                                            }
                                            {/* <span className="order-box-text">Order</span> */}
                                            {((isSelected && index === panelOpener) || (Item && Item.hasOwnProperty("untransmittedOrderQty") && Number.parseInt(Item.untransmittedOrderQty) >= 0 && Item.untransmittedOrderQty !== '')) && !Item.isStoreOrderBlocked ?
                                                <span className="order-box-text">Order</span> : ''
                                            }

                                        </div>
                                        <div className={`col-1 col-sm-1 col-md-1 arrow-container-rest ${panelOpener === index ? "arrow-container-opened" : "arrow-container-closed"}`}>
                                            <i onClick={() => this.onArrow(index)} className={panelOpener === index ? window.innerWidth <= 768 ? 'fa fa-angle-up align-cat-mobile' : 'fa fa-angle-up cat-arrow arrow-expanded' : 'fa fa-angle-down cat-arrow arrow-collapsed'}></i>
                                        </div>

                                        {/* Reserved for formula: 7MD*/}
                                        {panelOpener === index &&
                                            this.mobileViewFormula(panelOpener, index, Item)
                                        }

                                    </div>
                                    {
                                        // panelOpener === index &&
                                        <Collapse key={index} isOpen={panelOpener === index} >
                                            {/* QA Section */}
                                            {window.innerWidth > 768 && panelOpener === index && OrderingCycleType !== singleDay && this.toggleQuestionAnswerForDesktop(index, Item)}

                                            {panelOpener === index && window.innerWidth <= 768 && OrderingCycleType !== singleDay &&
                                                this.toggleQuestionAnswerForMobile(index, Item)
                                            }
                                            {panelOpener === index &&

                                                <div className={this.state.isFormulaEnabled[index] && window.innerWidth <= 768 && this.state.OrderingCycleType !== singleDay ? 'Item-card-container-hidden' : ''}>
                                                    <Card className={this.state.isDisplayCardEnabled ? 'display-item-card reduce-margin-display-card' : 'hide-display-card'}>
                                                        <hr />
                                                        <div className="display-bar col-md-none col-lg-none d-md-none d-lg-none"><DisplayBar selectedTab={this.state.selectedTab} onTabChange={this.onTabChange} Item={Item} OrderingCycleType={this.state.OrderingCycleType} question={this.state.QuestionDays && this.state.QuestionDays[Item.itemId]} /></div>
                                                        <CardBody>
                                                            <div key={index} className="d-none d-md-block col-md-12">
                                                                <div className="row">
                                                                    <div className="col-md-1 label-info"><LabelInfo /></div>
                                                                    <div className={this.state.OrderingCycleType === multiDay ? 'col-md-3 daily-trend text-right-multi' : 'col-md-7 daily-trend'}><DailyTrend Item={Item} OrderingCycleType={this.state.OrderingCycleType} /></div>
                                                                    <div className={this.state.OrderingCycleType === multiDay ? 'col-md-8 weekly-trend text-right-multi' : 'col-md-4 weekly-trend'}><WeeklyTrend highlight={this.state.highlightSelectedTrend} question={this.state.QuestionDays && this.state.QuestionDays[Item.itemId]} Item={Item} selectedQuestion={this.state.selectedQuestion} OrderingCycleType={this.state.OrderingCycleType} /></div>
                                                                </div>
                                                            </div>
                                                            <div key={index + 1} className="d-md-none mob-weather-container">

                                                                <div className={this.state.OrderingCycleType === singleDay ? 'col-2 label-info mob-inline' : 'col-1 label-info mob-inline'}><LabelInfo /></div>
                                                                {this.state.selectedTab === "weekly" && this.state.OrderingCycleType !== multiDay &&
                                                                    <div className="col-10 weekly-trend weekly mob-inline"><WeeklyTrend Item={Item} question={this.state.QuestionDays && this.state.QuestionDays[Item.itemId]} selectedQuestion={this.state.selectedQuestion} OrderingCycleType={this.state.OrderingCycleType} /></div>
                                                                }

                                                                {this.state.selectedTab === "weekly1" && this.state.OrderingCycleType === multiDay &&
                                                                    <div className="col-10 weekly-trend weekly1 mob-inline"><WeeklyTrend Item={Item} OrderingCycleType={this.state.OrderingCycleType} weekly2={false} /></div>
                                                                }
                                                                {this.state.selectedTab === "weekly2" && this.state.OrderingCycleType === multiDay &&
                                                                    <div className="col-10 weekly-trend weekly2 mob-inline"><WeeklyTrend Item={Item} OrderingCycleType={this.state.OrderingCycleType} weekly1={false} /></div>
                                                                }

                                                                {this.state.selectedTab === "daily" &&
                                                                    <div className="col-10 daily-trend mob-inline"><DailyTrend Item={Item} OrderingCycleType={this.state.OrderingCycleType} /></div>
                                                                }

                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </div>

                                            }

                                        </Collapse >
                                    }
                                </div>
                            </div>
                        </div>
                        }
                {showModal && panelOpener === index &&
                            <MessageBox
                                msgTitle=""
                                msgBody={msgBoxBody}
                                className={"message-box"}
                                initialModalState={false}
                                orderMinMax={true}
                                index={itmMsgIndex}
                                reviewFinalizePage={false}
                                modalAction={this.MinMaxModalAction} />}

                        {showLDUModal && panelOpener === index &&
                            <MessageBox
                                msgTitle=""
                                msgBody={msgLDUBody}
                                className={"message-box-ldu"}
                                initialModalState={false}
                                orderMinMax={false}
                                LDUBox={true}
                                LDUMin={LDUMin}
                                LDUMax={LDUMax}
                                index={itmMsgIndex}
                                reviewFinalizePage={false}
                                modalAction={this.LduModalAction}
                                lduMinOrderQntyChk={this.lduMinOrderQntyChk}
                                lduMaxOrderQntyChk={this.lduMaxOrderQntyChk} />}

                        {showSavedQntyModal && panelOpener === index &&
                            <MessageBox
                                msgTitle=""
                                msgBody={SavedQntyBody}
                                className={"message-box-ldu"}
                                initialModalState={false}
                                orderMinMax={false}
                                LDUBox={false}
                                savedQntyModal={true}
                                reviewFinalizePage={false}
                                previousSelectionVal={previousSelectionVal}
                                defaultSelectionVal={defaultSelectionVal}
                                index={itmMsgIndex}
                                modalAction={this.savedQntyModalAction}
                                previousSelectionChk={this.previousSelectionChk}
                                defaultSelectionChk={this.defaultSelectionChk} />}
                    </ div>
        )
            }
        }
        
const mapStateToProps = state => {
    return ({
                    inputItmQnty: state.ordering && state.ordering.inputItmQnty && state.ordering.inputItmQnty.payload,
                selectedLink: state.ordering.orderingSelectedLink && state.ordering.orderingSelectedLink.payload && state.ordering.orderingSelectedLink.payload.selectedLink ? state.ordering.orderingSelectedLink.payload.selectedLink : 'Ordering',
                panelOpener: state.ordering.panelOpener && state.ordering.panelOpener.payload && !isNaN(state.ordering.panelOpener.payload.panelOpener) ? parseInt(state.ordering.panelOpener.payload.panelOpener) : 0,
                previousPanelOpenner: state.ordering.panelOpener && state.ordering.panelOpener.payload && !isNaN(state.ordering.panelOpener.payload.previousPanelOpenner) ? parseInt(state.ordering.panelOpener.payload.previousPanelOpenner) : 0,
            });
        }
        export default connect(
            mapStateToProps
)(withRouter(ItemDetail))