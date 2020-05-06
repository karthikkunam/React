import React, { Component } from 'react'
import './QuestionAnswer.css'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { datesToString, getTimeZoneTimeStamp } from '../../../../../utility/DateHelper';
import * as constants from '../../../../../../constants/ActionTypes';
import { subtractDays, addDays } from '../../../../../utility/DateFormatter';
import { DEFAULT_TIME_ZONE, MM_DD_FORMAT, ORDER_QTY_REGEX, VALID_KEYS, ALLOWED_KEY_CODES, DISALLOWED_KEYS, DISALLOWED_KEY_CODES } from '../../../../../utility/constants';
import { nonDaily, multiDay, singleDay, cycleTypes } from '../../../../../../constants/ActionTypes'
import { postOrderingBOHDetails } from '../../../../../../actions/index'
import { storeDetails } from '../../../../../../lib/storeDetails'
import { validateRolesAndReadOnlyView } from '../../../../../utility/validateRolesAndReadOnlyView';

class QuestionAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Itemidx: 0,
            isSelected: false,
            QAindex: '',
            currentQuestionIndex: 0,
            panelOpener: 0,
            isFormulaEnabled: false,
            isPrevClicked: false,
            storeId: storeDetails() && storeDetails().storeId,
            storeTimeZone: storeDetails() && storeDetails().timeZone,
            previousValue: '',
            lastCall: (new Date()).getTime(),
            delay: 500,
            readOnly: validateRolesAndReadOnlyView(),
            multiDayQstnHistory:[],
            nonDailyQstnHistory:[]
        }

        this.getNextValidItemIndex = this.getNextValidItemIndex.bind(this);
    }

    componentDidMount() {
        const { Item, OrderingCycleType, storeSelectedLink, question, Itemidx, panelOpener, currentQuestionIndex } = this.props
        this.setState({
            Item: Item,
            OrderingCycleType: OrderingCycleType,
            question: question,
            Itemidx: Itemidx,
            storeSelectedLink: storeSelectedLink,
            panelOpener: panelOpener,
            currentQuestionIndex: currentQuestionIndex || 0,
            previousValue: Item && Item.totalBalanceOnHandQty

        }, () => {
            this.triggerAfterDidMount();
        });
        this.props.highlightSelectedTrendBox({
            itmId: this.props.itemID,
            ordreDaySell: false,
            forecastSell: false
        });
    }

    triggerAfterDidMount() {
        let self = this;
        let { Itemidx, panelOpener, OrderingCycleType, Item } = this.state;

        if (window.innerWidth <= 768 && OrderingCycleType === multiDay) {
            const { Itemidx } = this.props;
            this.refs[`${Itemidx}-${1}`].style.display = "none"
            this.refs[`${Itemidx}-${2}`].style.display = "none"
            this.refs[`${Itemidx}-${3}`].style.display = "none"
            this.props.hideDisplayCard('true');
        }
        let totalUnits = this.validateGivenValue(Item.totalUnits) ? Item.totalUnits : this.validateGivenValue(Item.totalBalanceOnHandQty) ? Item.totalBalanceOnHandQty : '';
        let totalExpire = this.validateGivenValue(Item.todayBalanceOnHandQty) ? Item.todayBalanceOnHandQty : this.validateGivenValue(Item.totalExpire) ? Item.totalExpire : '';
        let totalOrderSell = this.validateGivenValue(Item.todaySalesForecastQty) ? Item.todaySalesForecastQty : this.validateGivenValue(Item.totalSell) ? Item.totalSell : '';
        let totalForeCastSell = this.validateGivenValue(Item.totalSellWeekly) ? Item.totalSellWeekly : this.validateGivenValue(Item.tomorrowSalesForecastQty) ? Item.tomorrowSalesForecastQty : '';
        let tomorrowSalesForecastQty = this.validateGivenValue(Item.forecastSellQnty) ? Item.forecastSellQnty : Item.tomorrowSalesForecastQty;

        // ITEM should focus on first question when order quantity is empty

        if ((Item.untransmittedOrderQty === null || Item.untransmittedOrderQty === undefined) && panelOpener === Itemidx) {
            setTimeout(() => {
                if (self.refs[`${Itemidx}-${0}`]) {
                    self.refs[`${Itemidx}-${0}`].focus();
                    if (self.refs && self.refs[`${Itemidx}-${0}reviewLabel`]) {
                        self.refs[`${Itemidx}-${0}reviewLabel`].style.color = '#585858';
                    }
                }            
            }, 10);
        }

        if (this.validateGivenValue(totalUnits) && this.validateGivenValue(totalExpire) && this.validateGivenValue(totalOrderSell) && this.validateGivenValue(totalForeCastSell) && OrderingCycleType === "MULTI_DAY") {
            if (self.refs && self.refs[`${Itemidx}-${0}reviewLabel`]) {
                self.refs[`${Itemidx}-${0}reviewLabel`].style.color = '#9A9A9B';
            }

            if (self.refs && self.refs[`${Itemidx}-${1}reviewLabel`]) {
                self.refs[`${Itemidx}-${1}reviewLabel`].style.color = '#9A9A9B';
            }

            if (self.refs && self.refs[`${Itemidx}-${2}reviewLabel`]) {
                self.refs[`${Itemidx}-${2}reviewLabel`].style.color = '#9A9A9B';
            }

            if (self.refs && self.refs[`${Itemidx}-${3}reviewLabel`]) {
                self.refs[`${Itemidx}-${3}reviewLabel`].style.color = '#9A9A9B';
            }
            self.getNextValidItemIndex({ key: "Enter" }, 2, false, false, true);
            if(window.innerWidth <= 768 ){
                self.props.determineQuestionIndex(Itemidx, 4);
                self.triggerAfterRecieveProps();
            }

        }

        if ( this.validateGivenValue(tomorrowSalesForecastQty) && OrderingCycleType === "NON_DAILY") {
            if (self.refs && self.refs[`${Itemidx}-${0}reviewLabel`]) {
                self.refs[`${Itemidx}-${0}reviewLabel`].style.color = '#9A9A9B';
            }
            self.getNextValidItemIndex({ key: "Enter" }, -1, false, false, true);
            if(window.innerWidth <= 768 ){
                self.props.determineQuestionIndex(Itemidx, 1);
                self.triggerAfterRecieveProps();
            }
        }
    }

    computeForecastSell(foreCastSellDate) {
        return `${datesToString(foreCastSellDate.forecastSell[0], { dayFormat: 'ddd MM/DD', separator: '&' })} & ${datesToString(foreCastSellDate.forecastSell[1], { dayFormat: 'ddd MM/DD', separator: '&' })}`
    }

    componentWillMount() {
        let item = this.props.Item;

        const { question } = this.props;
        let totalUnits = this.validateGivenValue(item.totalUnits) ? item.totalUnits : this.validateGivenValue(item.totalBalanceOnHandQty) ? item.totalBalanceOnHandQty : '';
        let totalExpire = this.validateGivenValue(item.todayBalanceOnHandQty) ? item.todayBalanceOnHandQty : this.validateGivenValue(item.totalExpire) ? item.totalExpire : '';
        let totalOrderSell = this.validateGivenValue(item.todaySalesForecastQty) ? item.todaySalesForecastQty : this.validateGivenValue(item.totalSell) ? item.totalSell : '';
        let totalForeCastSell = this.validateGivenValue(item.totalSellWeekly) ? item.totalSellWeekly : this.validateGivenValue(item.tomorrowSalesForecastQty) ? item.tomorrowSalesForecastQty : '';
        if (this.props.OrderingCycleType === multiDay) {
            this.setState({
                Questions: ['Total', 'Sell', 'Expire', 'Weekly'],
                QuestionSet: [{ name: 'How many units in Total?', value: totalUnits },
                { name: `How many expire ${question && question.expire ? datesToString(question.expire, true, { dayFormat: 'MM/DD', separator: ' - ' }) : ''}?`, value: totalExpire },
                { name: `Forecast Sales for ${question && question.ordreDaySell ? datesToString(question.ordreDaySell, true, { dayFormat: 'MM/DD', separator: ' - ' }) : ''}?`, value: totalOrderSell },
                { name: `Forecast Sales for ${question && question.forecastSell ? datesToString(question.forecastSell, true, { dayFormat: 'MM/DD', separator: ' - ' }) : ''}?`, value: totalForeCastSell }],
                multiDayQstnHistory: [totalUnits,totalExpire,totalOrderSell,totalForeCastSell]
            })
        } else {
            let tomorrowSalesForecastQty;
            let forecastSellQnty = this.validateGivenValue(item.forecastSellQnty) ? item.forecastSellQnty : item.tomorrowSalesForecastQty;
            if (item.tomorrowSalesForecastQty || item.tomorrowSalesForecastQty === 0) {
                tomorrowSalesForecastQty = item.tomorrowSalesForecastQty;
            } else {
                tomorrowSalesForecastQty = '';
            }
            let forecastFromDate = subtractDays(item.submitDate, 1, DEFAULT_TIME_ZONE, MM_DD_FORMAT);
            const forecastFrom = subtractDays(item.submitDate, 1, DEFAULT_TIME_ZONE);
            let forecastToDate = addDays(forecastFrom, item.forecastPeriod - 1, DEFAULT_TIME_ZONE, MM_DD_FORMAT);
            this.setState({
                Questions: ['Forecast'],
                QuestionSet: [{ name: ` ${item && item.orderCycleTypeCode === cycleTypes.guidedReplenishment ? "Proj. F" : "Forecast"} sales for ${forecastFromDate} - ${forecastToDate}?`, value: tomorrowSalesForecastQty || forecastSellQnty }],
                nonDailyQstnHistory:[tomorrowSalesForecastQty || forecastSellQnty]
            })
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            Item: newProps.Item,
            currentQuestionIndex: newProps.currentQuestionIndex,
            isPrevClicked: newProps.isPrevClicked,
            storeSelectedLink: newProps.storeSelectedLink,
            Itemidx: newProps.Itemidx,
            panelOpener: newProps.panelOpener
        }, () => {
            this.triggerAfterRecieveProps();
        })
    }

    triggerAfterRecieveProps() {
        let { currentQuestionIndex, isPrevClicked, OrderingCycleType, storeSelectedLink, panelOpener, Itemidx, Item } = this.state;
        let self = this;
        let totalUnits = this.validateGivenValue(Item.totalUnits) ? Item.totalUnits : Item.totalBalanceOnHandQty;
        let totalExpire = Item.todayBalanceOnHandQty;
        let totalOrderSell = Item.todaySalesForecastQty;
        let totalForeCastSell = this.validateGivenValue(Item.totalSellWeekly) ? Item.totalSellWeekly : Item.tomorrowSalesForecastQty;
        let tomorrowSalesForecastQty = (Item.tomorrowSalesForecastQty) || Item.forecastSellQnty;

        // ITEM should focus on first question when order quantity is empty
        if ((Item.untransmittedOrderQty === null || Item.untransmittedOrderQty === undefined) && panelOpener === Itemidx) {
            setTimeout(() => {
                if (self.refs[`${Itemidx}-${0}`]) {
                    self.refs[`${Itemidx}-${0}`].focus();
                    if (self.refs && self.refs[`${Itemidx}-${0}reviewLabel`]) {
                        self.refs[`${Itemidx}-${0}reviewLabel`].style.color = '#585858';
                    }
                }
            }, 10);
        }

        // ITEM SHOULD POPULATE FORMULA WHEN ALL QUESTIONS ARE ANSWERED

        if (panelOpener === Itemidx) {
            if (this.validateGivenValue(totalUnits) && this.validateGivenValue(totalExpire) && this.validateGivenValue(totalOrderSell) && this.validateGivenValue(totalForeCastSell) && OrderingCycleType === "MULTI_DAY") {
                if (self.refs && self.refs[`${Itemidx}-${0}reviewLabel`]) {
                    self.refs[`${Itemidx}-${0}reviewLabel`].style.color = '#9A9A9B';
                }

                if (self.refs && self.refs[`${Itemidx}-${1}reviewLabel`]) {
                    self.refs[`${Itemidx}-${1}reviewLabel`].style.color = '#9A9A9B';
                }

                if (self.refs && self.refs[`${Itemidx}-${2}reviewLabel`]) {
                    self.refs[`${Itemidx}-${2}reviewLabel`].style.color = '#9A9A9B';
                }

                if (self.refs && self.refs[`${Itemidx}-${3}reviewLabel`]) {
                    self.refs[`${Itemidx}-${3}reviewLabel`].style.color = '#9A9A9B';
                }
                self.getNextValidItemIndex({ key: "Enter" }, 2, false, false, true);
            }

            if (this.validateGivenValue(tomorrowSalesForecastQty) >= 0 && OrderingCycleType === "NON_DAILY") {
                if (self.refs && self.refs[`${Itemidx}-${0}reviewLabel`]) {
                    self.refs[`${Itemidx}-${0}reviewLabel`].style.color = '#9A9A9B';
                }
                self.getNextValidItemIndex({ key: "Enter" }, -1, false, false, true);
            }
        }

        if (totalUnits && totalExpire && totalOrderSell && totalForeCastSell) {
            if (self.refs && self.refs[`${Itemidx}-${0}reviewLabel`]) {
                self.refs[`${Itemidx}-${0}reviewLabel`].style.color = '#9A9A9B';
            }

            if (self.refs && self.refs[`${Itemidx}-${1}reviewLabel`]) {
                self.refs[`${Itemidx}-${1}reviewLabel`].style.color = '#9A9A9B';
            }

            if (self.refs && self.refs[`${Itemidx}-${2}reviewLabel`]) {
                self.refs[`${Itemidx}-${2}reviewLabel`].style.color = '#9A9A9B';
            }

            if (self.refs && self.refs[`${Itemidx}-${3}reviewLabel`]) {
                self.refs[`${Itemidx}-${3}reviewLabel`].style.color = '#9A9A9B';
            }
        }

        if (tomorrowSalesForecastQty) {
            if (document.getElementsByClassName('QA-box-text')[0]) {
                document.getElementsByClassName('QA-box-text')[0].style.color = '#585858';
            }
        }

        if (currentQuestionIndex === 0 && window.innerWidth <= 768 && OrderingCycleType === multiDay && this.refs && this.refs[`${Itemidx}-${0}`] && this.refs[`${Itemidx}-${1}`]) {

            this.refs[`${Itemidx}-${0}`].style.display = "block";
            this.refs[`${Itemidx}-${1}`].style.display = "none";
        }

        if (window.innerWidth <= 768 && OrderingCycleType === multiDay && storeSelectedLink === "ItemDetail" && this.refs) {
            switch (currentQuestionIndex) {
                case 0:
                    this.refs[`${Itemidx}-${0}`].style.display = "block";
                    this.refs[`${Itemidx}-${1}`].style.display = "none";
                    this.refs[`${Itemidx}-${2}`].style.display = "none";
                    this.refs[`${Itemidx}-${3}`].style.display = "none";
                    if (this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`] && isPrevClicked) {
                        this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`].style.color = "#9a9a9b";
                    }
                    break;
                case 1:
                    this.refs[`${Itemidx}-${0}`].style.display = "none";
                    this.refs[`${Itemidx}-${1}`].style.display = "block";
                    this.refs[`${Itemidx}-${2}`].style.display = "none";
                    this.refs[`${Itemidx}-${3}`].style.display = "none";
                    if (this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`] && isPrevClicked) {
                        this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`].style.color = "#9a9a9b";
                    }
                    break;
                case 2:
                    this.refs[`${Itemidx}-${0}`].style.display = "none";
                    this.refs[`${Itemidx}-${1}`].style.display = "none";
                    this.refs[`${Itemidx}-${2}`].style.display = "block";
                    this.refs[`${Itemidx}-${3}`].style.display = "none";
                    if (this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`] && isPrevClicked) {
                        this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`].style.color = "#9a9a9b";
                    }
                    break;
                case 3:
                    this.refs[`${Itemidx}-${0}`].style.display = "none";
                    this.refs[`${Itemidx}-${1}`].style.display = "none";
                    this.refs[`${Itemidx}-${2}`].style.display = "none";
                    this.refs[`${Itemidx}-${3}`].style.display = "block";
                    if (this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`] && isPrevClicked) {
                        this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`].style.color = "#9a9a9b";
                    }
                    break;
                case 4:
                    this.refs[`${Itemidx}-${0}`].style.display = "none";
                    this.refs[`${Itemidx}-${1}`].style.display = "none";
                    this.refs[`${Itemidx}-${2}`].style.display = "none";
                    this.refs[`${Itemidx}-${3}`].style.display = "none";
                    break;
                default:    
            }
        }

        if (window.innerWidth <= 768 && OrderingCycleType === nonDaily && storeSelectedLink === "ItemDetail" && this.refs) {
            switch (currentQuestionIndex) {
                case 0:
                    this.refs[`${Itemidx}-${0}`].style.display = "block";
                    if (this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`] && isPrevClicked) {
                        this.refs[`${Itemidx}-${currentQuestionIndex}reviewLabel`].style.color = "#9a9a9b";
                    }
                    break;
                case 1:
                    this.refs[`${Itemidx}-${0}`].style.display = "none";
                    break;
                default:    
            }
        }
    }

    validateGivenValue(value) {
        if (value !== "" && value !== null && Number.isInteger(value) && value >= 0) {
            return true;
        }
        return false
    }

    updateOrderQnty = (e, index) => {
        let { QuestionSet, Item, Itemidx } = this.state;
        let updatedQnty = e.target.value ? parseInt(e.target.value) : '';
        if (e.target.value === '' || (ORDER_QTY_REGEX.test(updatedQnty))) {
            if (isNaN(updatedQnty)) {
                return;
            } else {
                if (this.props.OrderingCycleType === multiDay) {
                    switch (index) {
                        case 0:
                            Item.totalUnits = updatedQnty;
                            Item.totalBalanceOnHandQty = updatedQnty;
                            break;
                        case 1:
                            Item.totalExpire = updatedQnty;
                            Item.todayBalanceOnHandQty = updatedQnty;

                            break;
                        case 2:
                            Item.totalSell = updatedQnty;
                            Item.todaySalesForecastQty = updatedQnty;
                            break;
                        case 3:
                            Item.totalSellWeekly = updatedQnty;
                            Item.tomorrowSalesForecastQty = updatedQnty;
                            break;
                        default:    
                    }
                } else {
                    switch (index) {
                        case 0:
                            Item.forecastSellQnty = updatedQnty;
                            Item.tomorrowSalesForecastQty = updatedQnty;
                            break;
                        default:     
                    }
                }

                if(window.innerWidth <= 768 ){
                    this.props.itemChanged(Item, Itemidx);
                }
                QuestionSet[index].value = updatedQnty;
                this.setState({ Item: Item, QuestionSet: QuestionSet });
            }
        }
    }

    calculateInventory = () => {
        const { Item } = this.state;
        let maxSellExpire = Math.max(Item.totalExpire, Item.totalSell);
        let ivt = Item.totalUnits - maxSellExpire;
        return Math.max(0, ivt);
    }

    calculateEstimatedOrderQnty = () => {
        const { Item } = this.state;
        let calculatedInventory = this.calculateInventory();
        let estOrderQnty = Item.totalSellWeekly - calculatedInventory;
        return Math.max(0, estOrderQnty);
    }

    calculateMaxSellExp = () => {
        const { Item } = this.state;
        return Math.max(Item.totalExpire, Item.totalSell);
    }

    calculateInventoryforLeadTime = () => {
        let { Item } = this.state;
        let calculatedInventoryForLead = this.calculateInventory();
        let pendingQnty = Item.pendingDeliveryQty;
        let pendingDvyQty, invtLeadTime;
    
        if(pendingQnty === '' || pendingQnty === null || typeof(pendingQnty) === 'undefined'){
            pendingDvyQty = 0;
        }else{
            pendingDvyQty = pendingQnty;
        }

        invtLeadTime = calculatedInventoryForLead + pendingDvyQty;
        return Math.max(0, invtLeadTime);
    }

    /**For lead time 2 and shelf life == 2 Starts------ */
    calculateCarryOverForLD2 = () => {
        let carryOver = 0;
        let { Item } = this.state;

        let totalUnits = Item.totalUnits;
        let expireSell = this.calculateMaxSellExp();
        let pendingQnty = Item.pendingDeliveryQty;
        let pendingDvyQty;
    
        if(pendingQnty === '' || pendingQnty === null || typeof(pendingQnty) === 'undefined'){
            pendingDvyQty = 0;
        }else{
            pendingDvyQty = pendingQnty;
        }

        carryOver = (totalUnits - expireSell) + pendingDvyQty;
        return Math.max(0, carryOver);
    }

    calculateEstimatedOrderQntyForLD2 = () => {
        let { Item } = this.state;
        let calculatedCarryOverLD2 = this.calculateCarryOverForLD2();
        let estOrderQnty = Item.totalSellWeekly - calculatedCarryOverLD2;
        return Math.max(0, estOrderQnty);
    }

    /**For lead time 2 and shelf life == 2 Ends------ */

    /**For lead time 2 and shelf life > 2 Starts------ */
    clalculateCarryOverLD2SH3 = () => {
        let { Item } = this.state;
        let carryOver = 0;
        let totalUnits = Item.totalUnits;
        let expireSell = this.calculateMaxSellExp();

        carryOver = totalUnits - expireSell;
        return Math.max(0, carryOver);
    }

    calculateInventoryforLD2SH3 = () => {
        let inventory = 0;
        let { Item } = this.state;

        let carryOver = this.clalculateCarryOverLD2SH3();
        let pendingQnty = Item.pendingDeliveryQty;
        let pendingDvyQty;
    
        if(pendingQnty === '' || pendingQnty === null || typeof(pendingQnty) === 'undefined'){
            pendingDvyQty = 0;
        }else{
            pendingDvyQty = pendingQnty;
        }
        
        inventory = carryOver + pendingDvyQty;
        return Math.max(0, inventory);
    }

    calculateEstimatedOrderQntyForLD2SH3 = () => {
        let { Item } = this.state;
        let calculatedInventoryLD2SH3 = this.calculateInventoryforLD2SH3();
        let estOrderQnty = Item.totalSellWeekly - calculatedInventoryLD2SH3;
        return Math.max(0, estOrderQnty);
    }

    /**For lead time 2 and shelf life > 2 Ends------ */
    calculateMaxSellExpDay = (expireCt, sellCt, questions) => {
        if (expireCt > sellCt) {
            return datesToString(questions && questions.expire, { dayFormat: 'ddd', separator: ' & ' });
        } else {
            return datesToString(questions && questions.ordreDaySell, { dayFormat: 'ddd', separator: ' & ' });
        }
    }

    calculateOrderQuantityNonDaily = (item) => {
        let forecastSellQnty, minimumOnHandQty, totalBalanceOnHandQty, pendingDeliveryQty, orderQuantity;
        if (item.forecastSellQnty !== '' && parseInt(item.forecastSellQnty) >= 0) {
            if (item && item.forecastSellQnty === null) {
                return "";
            } else {
                forecastSellQnty = parseInt(item.forecastSellQnty);
            }

            if ((item && item.minimumOnHandQty === null) || (isNaN(item && item.minimumOnHandQty)) || (item && item.minimumOnHandQty === '')) {
                //return "";
                minimumOnHandQty = 0;
            } else {
                minimumOnHandQty = parseInt(item.minimumOnHandQty);
            }

            if ((item && item.totalBalanceOnHandQty === null) || (isNaN(item && item.totalBalanceOnHandQty)) || (item && item.totalBalanceOnHandQty === '')) {
                //return "";
                totalBalanceOnHandQty = 0;

            } else {
                totalBalanceOnHandQty = parseInt(item.totalBalanceOnHandQty) >= 0 ? item.totalBalanceOnHandQty: 0 ;
            }

            if ((item && item.pendingDeliveryQty  === null) || (isNaN(item && item.pendingDeliveryQty )) || (item && item.pendingDeliveryQty  === '')) {
                pendingDeliveryQty = 0;
            } else {
                pendingDeliveryQty = parseInt(item.pendingDeliveryQty);
            }

            orderQuantity = (forecastSellQnty + minimumOnHandQty) - (totalBalanceOnHandQty + pendingDeliveryQty);
            if (isNaN(orderQuantity) || orderQuantity < 0) {
                return 0;
            } else {
                return orderQuantity;
            }
        } else if (item.forecastSellQnty === 0) {
            return 0;
        } else {
            return ''
        }
    }

    getNextValidItemIndex(event, currentIndex, isTriggeredByQuestion, focus, triggeredByMountOrProps) {
        let { QuestionSet, Itemidx, Item, OrderingCycleType, panelOpener, multiDayQstnHistory, nonDailyQstnHistory } = this.state;
        let { question } = this.props;
        if ((event.key === "Enter") || (event.key === "Tab")) {
            /**Multi day cases */
            Item.totalUnits = this.validateGivenValue(Item.totalUnits) ? Item.totalUnits : Item.totalBalanceOnHandQty;
            Item.totalExpire =  Item.todayBalanceOnHandQty;
            Item.totalSell = Item.todaySalesForecastQty;
            Item.totalSellWeekly = this.validateGivenValue(Item.totalSellWeekly) ? Item.totalSellWeekly : Item.tomorrowSalesForecastQty;
            Item.inventory = this.calculateInventory() || '';
            Item.estOrder = this.calculateEstimatedOrderQnty();
            Item.Itemidx = Itemidx;
            Item.isFormulaEnabled = true;
            Item.MaxSellExpire = this.calculateMaxSellExp();
            Item.maxSellExpireDayLeadTime = this.calculateMaxSellExpDay(Item.totalExpire, Item.totalSell, question);
            Item.maxSellExpireDayLD2SH2 = this.calculateMaxSellExpDay(Item.totalExpire, Item.totalSell, question);
            Item.maxSellExpireDayLD2SH3 = this.calculateMaxSellExpDay(Item.totalExpire, Item.totalSell, question);
            Item.forecastDelveryDay = datesToString(question && question.forecastSell, { dayFormat: 'ddd', separator: ' & ' })
            /**Non daily cases */
            Item.forecastSellQnty = this.validateGivenValue(Item.forecastSellQnty) ? Item.forecastSellQnty : Item.tomorrowSalesForecastQty;

            if (OrderingCycleType === constants.nonDaily && isTriggeredByQuestion &&  this.validateGivenValue(Item.forecastSellQnty) && (JSON.stringify(nonDailyQstnHistory) !== JSON.stringify([Item.forecastSellQnty]) || triggeredByMountOrProps )) {
                let orderQuantity = this.validateGivenValue(this.calculateOrderQuantityNonDaily(Item)) ? this.calculateOrderQuantityNonDaily(Item) : Item.untransmittedOrderQty;
                /**New Req: update the orderQnty with the formula generated value. 
                 * Validations are handled later while on focus out and Enter  */
                if (orderQuantity === 0 || orderQuantity < 0) {
                    Item.untransmittedOrderQty = 0;
                } else {
                    Item.untransmittedOrderQty = orderQuantity;
                }
                this.setState({ nonDailyQstnHistory: [Item.forecastSellQnty]})
              }
            Item.forecastSellObj = Item.forecastSellObj || {};
            Item.inventoryLeadTime = this.calculateInventoryforLeadTime();
            if(OrderingCycleType === multiDay && ( JSON.stringify(multiDayQstnHistory) !== JSON.stringify([Item.totalUnits, Item.totalExpire, Item.totalSell, Item.totalSellWeekly]) || triggeredByMountOrProps)){

              Item.leadTime2SH2 = {
                totalUnits: Item.totalUnits || '',
                MaxSellExpire: this.calculateMaxSellExp() || '',
                carryOver: this.calculateCarryOverForLD2(),
                totalSellWeekly: Item.totalSellWeekly || '',
                estOrder: this.calculateEstimatedOrderQntyForLD2(),
              };

              Item.leadTime2SH3 = {
                  totalUnits: Item.totalUnits || '',
                  MaxSellExpire: this.calculateMaxSellExp(),
                  carryOver: this.clalculateCarryOverLD2SH3(),
                  invtLeadTime: this.calculateInventoryforLD2SH3(),
                  totalSellWeekly: Item.totalSellWeekly || '',
                  estOrder: this.calculateEstimatedOrderQntyForLD2SH3()
              };

              // let minQnty = Item.minimumAllowableOrderQty;
              // let maxQnty = Item.maximumAllowableOrderQty;
              let estOrderLeadTimeQnty = Item.estOrder;
              let estOrderLeadTime2SH2Qnty = Item.leadTime2SH2.estOrder;
              let estOrderLeadTime2SH3Qnty = Item.leadTime2SH3.estOrder;
              if (Item.leadTime === 1 && Item.shelfLife >= 2 && isTriggeredByQuestion && this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly)) {
                  /** If the algorithm leads to a negative value or Zero, it is expected to display a “ZERO” in order quantity box.*/
                  //LeadTime 1 & ShelfLife gte 2
                  if (estOrderLeadTimeQnty === 0 || estOrderLeadTimeQnty < 0) {
                      Item.untransmittedOrderQty = 0;
                  } else {
                      Item.untransmittedOrderQty = estOrderLeadTimeQnty;
                  }
              } else if (Item.leadTime === 2 && Item.shelfLife === 2 && isTriggeredByQuestion && this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly)) {
                  /** If the algorithm leads to a negative value or Zero, it is expected to display a “ZERO” in order quantity box.*/
                  //LeadTime 2 & ShelfLife eq 2
                  if (estOrderLeadTime2SH2Qnty === 0 || estOrderLeadTime2SH2Qnty < 0) {
                      Item.untransmittedOrderQty = 0;
                  } else {
                      Item.untransmittedOrderQty = estOrderLeadTime2SH2Qnty;
                  }
              } else if (Item.leadTime === 2 && Item.shelfLife > 2 && isTriggeredByQuestion && this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly)) {
                  /** If the algorithm leads to a negative value or Zero, it is expected to display a “ZERO” in order quantity box.*/
                  //LeadTime 2 & ShelfLife gt 2
                  if (estOrderLeadTime2SH3Qnty === 0 || estOrderLeadTime2SH3Qnty < 0) {
                      Item.untransmittedOrderQty = 0;
                  } else {
                      Item.untransmittedOrderQty = estOrderLeadTime2SH3Qnty;
                  }
              } else {

              }
              this.setState({ multiDayQstnHistory: [Item.totalUnits, Item.totalExpire, Item.totalSell, Item.totalSellWeekly]})
            }
            this.props.itemChanged(Item, Itemidx);
            this.props.highlightSelectedTrendBox({
                itmId: this.props.itemID,
                ordreDaySell: false,
                forecastSell: false
            });
            // this.setState({ isFormulaEnabled: true })
            if (this.props && window.innerWidth <= 768) {
                if (this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly) && OrderingCycleType === "MULTI_DAY") {
                    this.props.formulaEnabled(Itemidx, true);
                } else if (OrderingCycleType === "MULTI_DAY") {
                    this.props.formulaEnabled(Itemidx, false);
                }

                if (this.validateGivenValue(Item.tomorrowSalesForecastQty) && OrderingCycleType === "NON_DAILY") {
                    this.props.formulaEnabled(Itemidx, true);
                } else if (OrderingCycleType === "NON_DAILY") {
                    this.props.formulaEnabled(Itemidx, false);
                }
            }
            if (QuestionSet.length <= currentIndex + 1 && panelOpener === Itemidx && focus) {
                    if (document.getElementById(`input-${Itemidx}`)) {
                        setTimeout(function () {
                            document.getElementById(`input-${Itemidx}`).focus();
                        }, 1);
                    }
            } else {
                return currentIndex + 1;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps !== this.props) || (nextState !== this.state);
    }

    checkMobFormulaEnabled() {
        const { Item, Itemidx, OrderingCycleType } = this.state;
        if (this.props && window.innerWidth <= 768) {
            if (this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly) && OrderingCycleType === "MULTI_DAY") {
                this.props.formulaEnabled(Itemidx, true);
            }

            if (this.validateGivenValue(Item.tomorrowSalesForecastQty) && OrderingCycleType === "NON_DAILY") {
                this.props.formulaEnabled(Itemidx, true);
            }
        }
    }

    checkAndRedirectIdFormulaExists() {
        const { Item, Itemidx, OrderingCycleType } = this.state;
        if (this.props && window.innerWidth <= 768) {
            if (this.validateGivenValue(Item.totalUnits) && this.validateGivenValue(Item.totalExpire) && this.validateGivenValue(Item.totalSell) && this.validateGivenValue(Item.totalSellWeekly) && OrderingCycleType === "MULTI_DAY") {
                this.props.determineQuestionIndex(Itemidx, 4);
            }

            if (this.validateGivenValue(Item.tomorrowSalesForecastQty) && OrderingCycleType === "NON_DAILY") {
                this.props.determineQuestionIndex(Itemidx, 1);
            }
        }
    }

    onKeyPressOrderBox = (event, index) => {
        const { lastCall, delay } = this.state;
        const now = (new Date()).getTime();
        const { Itemidx } = this.props;
        let nextIndex;
        let input = event.target.value ? parseInt(event.target.value) : '';
        if (now - lastCall > delay) {
            nextIndex =  this.getNextValidItemIndex(event, index, true, true);
            this.setState({ lastCall :now },()=>{
                if (window.innerWidth > 768) {
                    if (nextIndex && this.refs[`${Itemidx}-${nextIndex}`]) {
                        setTimeout(()=>{
                            this.refs[`${Itemidx}-${nextIndex}`].focus()
                        }, 20)
                    }
                } else if (window.innerWidth <= 768 && this.props.OrderingCycleType === multiDay) {
                    if (nextIndex) {
                        this.props.determineQuestionIndex(Itemidx, nextIndex);
                        setTimeout(() => {
                            this.refs[`${Itemidx}-${index}`].style.display = "none";
                            this.refs[`${Itemidx}-${nextIndex}`].style.display = "block";
                            this.refs[`${Itemidx}-${nextIndex}`].focus();
                        }, 1);
                    }
                    if (typeof (nextIndex) === 'undefined' && this.validateGivenValue(input)) {
                        this.checkAndRedirectIdFormulaExists();
                        this.checkMobFormulaEnabled()
                    }
                }
                else if (window.innerWidth <= 768 && this.props.OrderingCycleType === nonDaily) {
                    if (nextIndex) {
                        this.props.determineQuestionIndex(Itemidx, nextIndex);
                        // this.props.formulaEnabled(Itemidx, true);
                        setTimeout(() => {
                            this.refs[`${Itemidx}-${index}`].style.display = "none";
                            this.refs[`${Itemidx}-${nextIndex}`].style.display = "block";
                            this.refs[`${Itemidx}-${nextIndex}`].focus();
                        }, 1);
                    }
                    if (typeof (nextIndex) === 'undefined' && this.validateGivenValue(input)) {
                        this.checkAndRedirectIdFormulaExists();
                        this.checkMobFormulaEnabled();
                    }
                }
            });
            
        }else if(event && event.key === "Tab" && now - lastCall <= delay) { // Tab issue when key press happens outside delay
            nextIndex = index;
            if (window.innerWidth > 768) {
                setTimeout(()=>{
                    if (this.refs[`${Itemidx}-${nextIndex}`]) {
                        this.refs[`${Itemidx}-${nextIndex}`].focus();
                    }
                }, 1);

            } else if (window.innerWidth <= 768 && this.props.OrderingCycleType === multiDay) {
                if (nextIndex) {
                    this.props.determineQuestionIndex(Itemidx, nextIndex);
                    setTimeout(() => {
                        this.refs[`${Itemidx}-${index}`].style.display = "none";
                        this.refs[`${Itemidx}-${nextIndex}`].style.display = "block";
                        this.refs[`${Itemidx}-${nextIndex}`].focus();
                    }, 1);
                }
                if (typeof (nextIndex) === 'undefined' && this.validateGivenValue(input)) {
                    this.checkAndRedirectIdFormulaExists();
                    this.checkMobFormulaEnabled()
                }
            }
            else if (window.innerWidth <= 768 && this.props.OrderingCycleType === nonDaily) {
                if (nextIndex) {
                    this.props.determineQuestionIndex(Itemidx, nextIndex);
                    // this.props.formulaEnabled(Itemidx, true);
                    setTimeout(() => {
                        this.refs[`${Itemidx}-${index}`].style.display = "none";
                        this.refs[`${Itemidx}-${nextIndex}`].style.display = "block";
                        this.refs[`${Itemidx}-${nextIndex}`].focus();
                    }, 1);
                }
                if (typeof (nextIndex) === 'undefined' && this.validateGivenValue(input)) {
                    this.checkAndRedirectIdFormulaExists();
                    this.checkMobFormulaEnabled();
                }
            }
        }
    }

    getFocus(e, index) {
        const { Itemidx } = this.props;
        if (this.refs[`${Itemidx}-${index}reviewLabel`]) {
            this.refs[`${Itemidx}-${index}reviewLabel`].style.color = "#008060";
        }
        this.setState({ QAindex: index, isSelected: true })
        switch (index) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                this.props.highlightSelectedTrendBox({
                    itmId: this.props.itemID,
                    ordreDaySell: true,
                    forecastSell: false,
                    selectedTab: 'weekly1'
                });
                break;
            case 3:
                this.props.highlightSelectedTrendBox({
                    itmId: this.props.itemID,
                    ordreDaySell: false,
                    forecastSell: true,
                    selectedTab: 'weekly2'
                });
                break;
            default:    
        }
    }

    looseFocus(e, index, childIdx) {
        const { Itemidx, Item, previousValue } = this.state;
        if (!e.target.value) {
            this.updateOrderQnty(e, index)
        }
        this.setState({ QAindex: index, isSelected: false })
        switch (index) {
            case 0:
                this.props.highlightSelectedTrendBox({
                    itmId: this.props.itemID,
                    nonDailyforeCastTrend: false
                });
                if (this.state.Questions && this.state.Questions[0] !== 'Forecast') {
                    let bohObject = {};
                    bohObject.itemId = this.props.itemID;
                    bohObject.itemQty = Item.totalUnits;
                    bohObject.itemUPC = Item.itemUPC;
                    bohObject.itemName = Item.itemName;
                    bohObject.activityTime = getTimeZoneTimeStamp(this.state.storeTimeZone);
                    if ((Item.totalUnits || Item.totalUnits === 0) && Item.totalUnits !== "" && Item.totalUnits !== previousValue) {
                        this.props.dispatch(postOrderingBOHDetails(this.state.storeId, bohObject, "boh"))
                    }
                }
                break;
            case 1:
                break;
            case 2:
                this.props.highlightSelectedTrendBox({
                    itmId: this.props.itemID,
                    ordreDaySell: false,
                    forecastSell: false
                });
                break;
            case 3:
                this.props.highlightSelectedTrendBox({
                    itmId: this.props.itemID,
                    ordreDaySell: false,
                    forecastSell: false
                })
                break;
            default:    
        }
        this.props.itemChanged(Item, Itemidx);
        this.getNextValidItemIndex({ key: "Enter" }, index, true, false);
        if (this.refs[`${Itemidx}-${index}reviewLabel`])
            this.refs[`${Itemidx}-${index}reviewLabel`].style.color = "#9a9a9b";
    }

    preventdefaultKeys = (e)=>{
        const { lastCall, delay } = this.state;
        if((DISALLOWED_KEYS.includes(e.key) || DISALLOWED_KEY_CODES.includes(e.keyCode)) && ( !(ALLOWED_KEY_CODES.includes(e.keyCode) && (new Date()).getTime() - lastCall < delay)|| !VALID_KEYS.includes(e.key) )) {
         e.preventDefault();
        }
    }

    render() {
        const THIS = this;
        const { currentQuestionIndex, QuestionSet, QAindex, isSelected, isFormulaEnabled, readOnly, lastCall, delay } = this.state;

        const { Itemidx, OrderingCycleType } = this.props;

        return (
            <div className="QA-Container row QA-width" key={Itemidx}>
                {QuestionSet.map(function (question, index) {
                    return (
                        <div className="col-md-3 QA-align-chevron" key={`${Itemidx}-${index}`}>
                            <span className="QA-Qnty">
                                <input
                                    autoComplete="off"
                                    name="QA"
                                    maxLength="4"
                                    disabled = { readOnly }
                                    type="number"
                                    value={ THIS.validateGivenValue(question.value) ? parseInt(question.value) + "" : '' }
                                    className="QA-box"
                                    id={`box-qnty-${index}`}
                                    tabIndex = {-1}
                                    min = "0"
                                    max = "9999"
                                    ref={`${Itemidx}-${index}`}
                                    placeholder={question.name}
                                    onChange={(evt) => { THIS.updateOrderQnty(evt, index) }}
                                    onCopy={(e) => {e.preventDefault();}} 
                                    onPaste={(e) => {e.preventDefault();}}
                                    onKeyDown={(evt) => { if ( ((evt.key === "Enter") || (evt.key === "Tab")) && ((new Date()).getTime() - lastCall > delay)) { THIS.onKeyPressOrderBox(evt, index) }; THIS.preventdefaultKeys(evt) }}
                                    onFocus={(e) => { THIS.getFocus(e, index) }}
                                    onBlur={(e) => { THIS.looseFocus(e, index) }}
                                />
                            </span>
                            {((QAindex === index && isSelected) || Number.parseInt(question.value) >= 0) && ((OrderingCycleType === multiDay && currentQuestionIndex < 4) || (OrderingCycleType === "NON_DAILY" && currentQuestionIndex < 1)) && window.innerWidth <= 768 &&
                                <span ref={`${Itemidx}-${index}reviewLabel`}
                                    className={isFormulaEnabled &&
                                        window.innerWidth <= 768 &&
                                        THIS.props.OrderingCycleType !== singleDay ? 'QA-box-text' : 'QA-box-text'}
                                    id="QA-text">{question.name}</span>
                            }
                            {((QAindex === index && isSelected) || Number.parseInt(question.value) >= 0) && window.innerWidth > 768 &&
                                <span ref={`${Itemidx}-${index}reviewLabel`}
                                    className={isFormulaEnabled &&
                                        window.innerWidth <= 768 &&
                                        THIS.props.OrderingCycleType !== singleDay ? 'QA-box-text' : 'QA-box-text'}
                                    id="QA-text">{question.name}</span>
                            }
                        </div>
                    )
                })
                }

            </div>
        )
    }
}

const mapStateToProps = state => {
    return ({
        storeSelectedLink: state.ordering.orderingSelectedLink && state.ordering.orderingSelectedLink.payload && state.ordering.orderingSelectedLink.payload.selectedLink ? state.ordering.orderingSelectedLink.payload.selectedLink : 'Ordering',
    });
}
export default connect(
    mapStateToProps
)(withRouter(QuestionAnswer))
