import React, { Component } from 'react'
import './formula.css'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { cycleTypes } from '../../../../../../constants/ActionTypes'
import info from '../../../../../../assets/images/info.png';
import { getTimeZoneTimeStamp } from '../../../../../utility/DateHelper';
import { postOrderingBOHDetails, postOrderDetails } from '../../../../../../actions/index'
import { storeDetails } from '../../../../../../lib/storeDetails'
import { ORDER_QTY_REGEX, VALID_KEYS, ALLOWED_KEY_CODES, DISALLOWED_KEY_CODES, DISALLOWED_KEYS, TOTAL_REGEX } from '../../../../../utility/constants';
import { validateRolesAndReadOnlyView } from '../../../../../utility/validateRolesAndReadOnlyView';

class Formula extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormulaEnabled: false,
            storeId: storeDetails() && storeDetails().storeId,
            storeTimeZone: storeDetails() && storeDetails().timeZone,
            previousBOHValue: '',
            previousMOHValue: '',
            readOnly: validateRolesAndReadOnlyView()
        };
    }

    componentWillMount() {
        this.setState({
            OrderingCycleType: this.props.OrderingCycleType,
            Item: this.props.Item,
            index: this.props.index
        })
    }

    componentWillReceiveProps(newProps) {
        const { Item, index } = this.props;

        this.setState({
            Item: Item,
            index: index
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps !== this.props) || (nextState !== this.state);
    }

    componentDidMount() {
        const { Item, index, OrderingCycleType } = this.props;
        this.setState({
            index: index,
            OrderingCycleType: OrderingCycleType,
            Item: Item,
            previousBOHValue: Item && Item.totalBalanceOnHandQty,
            previousMOHValue: Item && Item.minimumOnHandQty
        });
    }

    updateOrderQnty = (evnt, item) => {
        const { name, value } = evnt.target;

        if ((value === '' || value === "-") || (name === "totalbox" ? TOTAL_REGEX.test(value) : ORDER_QTY_REGEX.test(value))) {
            this.setState({
                Item: item
            });
        }
    }

    updateOrderQntyValidation = (evnt, item) => {
        const { name, value } = evnt.target;
        if ((value === '') || name === "totalbox" ? TOTAL_REGEX.test(value) : ORDER_QTY_REGEX.test(value)) {
            this.setState({
                Item: item
            }, () => {
                const { index } = this.state;
                this.forecastOrderQuantity(index, item);// update order quantity
            })
        }
    }

    onBlurBOHOrderQty = (event, item) => {
        event.persist();
        const { previousBOHValue, index } = this.state;
        if (parseInt(item.totalBalanceOnHandQty) !== parseInt(previousBOHValue)){
          this.updateOrderQntyValidation(event, item);
          this.updateBOHMOHOrderQnty('boh');
        }
        setTimeout(function () {
          if (document && document.getElementById(`input-${index}`) && event && (event.key === "Enter" || event.key === "Tab")) {
              document.getElementById(`input-${index}`).focus();
          }
      }, 10);
    }

    onBlurMOHOrderQty = (event, Item) => {
      const { previousMOHValue, index } = this.state;
        event.persist();
        if ( parseInt(Item.minimumOnHandQty) !== parseInt(previousMOHValue)){
          this.updateOrderQntyValidation(event, Item);
          this.updateBOHMOHOrderQnty('moh');
        }
        setTimeout(function () {
          if (document && document.getElementById(`input-${index}`) && event && (event.key === "Enter" || event.key === "Tab")) {
              document.getElementById(`input-${index}`).focus();
          }
      }, 10);
    }

    updateBOHMOHOrderQnty = (transactionType) => {
        const { Item, storeId } = this.state;
        let data = {};
        let itemsArray = [];
        if (transactionType.toLowerCase() === 'boh') {
            data.itemId = Item.itemId;
            data.itemQty = parseInt(Item.totalBalanceOnHandQty);
            data.itemUPC = Item.itemUPC;
            data.itemName = Item.itemName;
            data.activityTime = getTimeZoneTimeStamp(this.state.storeTimeZone);
            this.props.dispatch(postOrderingBOHDetails(this.state.storeId, data, transactionType))
            this.setState({
                previousMOHValue: Item.minimumOnHandQty
            })
        } if (transactionType.toLowerCase() === 'moh') {
            data.itemId = Item.itemId;
            data.itemQty = parseInt(Item.minimumOnHandQty);
            data.itemUPC = Item.itemUPC;
            data.itemName = Item.itemName;
            data.activityTime = getTimeZoneTimeStamp(this.state.storeTimeZone);
            this.props.dispatch(postOrderingBOHDetails(this.state.storeId, data, transactionType))
            //Submit action only for MoH
            itemsArray.push(Item);
            this.props.dispatch(postOrderDetails({
                Items: itemsArray,
                storeId: storeId,
                postMohData: true
            }));
            this.setState({
                previousMOHValue: Item.minimumOnHandQty
            });
        }
        return data;
    }

    calculateInventory = (totalBalanceOnHandQty, pendingDeliveryQty) => {
        let totalBOH, pending;

        if (totalBalanceOnHandQty === '' || totalBalanceOnHandQty === null || typeof (totalBalanceOnHandQty) === 'undefined') {
            totalBOH = 0;
        } else {
            totalBOH = parseInt(totalBalanceOnHandQty) >=0 ? totalBalanceOnHandQty : 0;
        }

        if (pendingDeliveryQty === '' || pendingDeliveryQty === null || typeof (pendingDeliveryQty) === 'undefined') {
            pending = 0;
        } else {
            pending = pendingDeliveryQty;
        }

        return (parseInt(totalBOH) + parseInt(pending)) >= 0 ? (parseInt(totalBOH) + parseInt(pending)) : 0;
    }

    calculateOrderQuantityNonDaily = (item) => {
        let forecastSellQnty, minimumOnHandQty, totalBalanceOnHandQty, pendingDeliveryQty, orderQuantity;

        if (item && item.forecastSellQnty === null) {
            return "";
        } else {
            forecastSellQnty = parseInt(item.forecastSellQnty);
        }

        if ((item && item.minimumOnHandQty === null) || (isNaN(item && item.minimumOnHandQty)) || (item && item.minimumOnHandQty === '')) {
            minimumOnHandQty = 0;
        } else {
            minimumOnHandQty = parseInt(item.minimumOnHandQty);
        }

        if ((item && item.totalBalanceOnHandQty === null) || (isNaN(item && item.totalBalanceOnHandQty)) || (item && item.totalBalanceOnHandQty === '')) {
            totalBalanceOnHandQty = 0;
        } else {
            totalBalanceOnHandQty = parseInt(item.totalBalanceOnHandQty) >= 0 ? item.totalBalanceOnHandQty : 0;
        }

        if ((item && item.pendingDeliveryQty === null) || (isNaN(item && item.pendingDeliveryQty)) || (item && item.pendingDeliveryQty === '')) {
            pendingDeliveryQty = 0;
        } else {
            pendingDeliveryQty = parseInt(item.pendingDeliveryQty);
        }

        orderQuantity = ((forecastSellQnty) + minimumOnHandQty) - (this.calculateInventory(totalBalanceOnHandQty, pendingDeliveryQty));
        if (isNaN(orderQuantity) || orderQuantity < 0) {
            return 0;
        } else {
            return orderQuantity;
        }
    }

    validateGivenValue(value, negativeCheck = false) {
        if (value !== "" && value !== null && Number.isInteger(value) && value >= 0) {
            return true;
        } else if (negativeCheck) {
            if (value !== "" && value !== null && Number.isInteger(value)) {
                return true;
            }
        }
        return false
    }

    forecastOrderQuantity = (index, item) => {
        let updatedItem = item;
        let orderQuantity = this.validateGivenValue(this.calculateOrderQuantityNonDaily(updatedItem)) ? this.calculateOrderQuantityNonDaily(updatedItem) : updatedItem.untransmittedOrderQty;
        updatedItem.untransmittedOrderQty = orderQuantity;
        this.props.itemChanged(updatedItem, index);
    }

    isld1MaxSellExp(Item) {
        if (isNaN(Item.MaxSellExpire)) {
            return isNaN(Math.max(Item.totalExpire, Item.todaySalesForecastQty)) ? '' : Math.max(Item.totalExpire, Item.todaySalesForecastQty)
        } else {
            return Item.MaxSellExpire;
        }
    }

    determineInventoryForLd1(Item) {
        let totalUnits = Item.totalUnits;
        let totalExpire = Item.totalExpire || Item.todayBalanceOnHandQty;
        let totalSell = Item.totalSell || Item.todaySalesForecastQty;
        let calMaxExpSell = Math.max(totalExpire, totalSell)
        let total = totalUnits - calMaxExpSell;

        if (Item.inventory) {
            return Item.inventory;
        } else {
            return Math.max(0, total)
        }
    }

    calculateInventoryld1 = (Item) => {
        let ivt = (Item.totalUnits) - Math.max(Item.totalExpire, Item.totalSell);
        return isNaN(Math.max(0, ivt)) ? "" : Math.max(0, ivt);
    }

    determineEstimatedOrderQnty = (Item) => {
        if (Item.estOrder) {
            return Item.estOrder;
        } else {
            let estOrderQnty = (Item.totalSellWeekly) - this.calculateInventoryld1(Item);
            return isNaN(Math.max(0, estOrderQnty)) ? '' : Math.max(0, estOrderQnty);
        }
    }

    bindtotalBalanceOnHandQty = (boH) => {
        let inputQnty = this.validateGivenValue(parseInt(boH), true) ? parseInt(boH) : '';
        if (inputQnty === "") {
            return ""
        } else if (inputQnty === 0) {
            return 0
        } else {
            return parseInt(inputQnty) || inputQnty === "-" ? inputQnty : ""
        }
    }

    checkifMobileld1(Item) {
        if (window.innerWidth < 768) {
            return (
                <div className="multiday-formula">
                    <div className="row mt-4 total-row-ld1">
                        <div className="total-content">
                            <label htmlFor="total" className="formulatxt">Total</label>
                            <input type="number" className="form-control no-border formulaVal rmv-padding-bottom" value={Item.totalUnits ? Item.totalUnits : 0} name="total" />
                        </div>

                        <div className="symbol total-sign"> - </div>

                        <div className="SellExp-content">
                            <label htmlFor="sellexp" className="formulatxt sellExpHeading">{Item.maxSellExpireDayLeadTime}: Exp./F</label>
                            <img className="status-SELLEXP" alt="Max-SellExp-tooltip" data-tip data-event={'click'} data-for="SELL-EXP" src={info} />
                            <input type="number" className="form-control no-border formulaVal sellExpContent" value={this.isld1MaxSellExp(Item)} name="sellexp" />
                        </div>

                        <div className="symbol sym-invt total-equals equal"> = </div>

                        <div className="inventory-content-multi pd-co-ld1">
                            <label htmlFor="inventory" className="formulatxt InvtLabel2">Carry Over</label>
                            <input type="number" className="form-control no-border formulaVal InvtContent2 InvtContentAlign row1-invtcontent" value={this.determineInventoryForLd1(Item)} name="inventory" />
                        </div>

                    </div>
                    <div className="row total-row2-ld1">
                        <div className="sell-content">
                            <label htmlFor="sell" className="formulatxt sellWeeklyHeading">{Item.forecastDelveryDay}: F</label>
                            <input type="number" className="form-control no-border formulaVal sellWeeklyContent" value={Item.totalSellWeekly ? Item.totalSellWeekly : 0} name="sell" />
                        </div>
                        <div className="symbol row2-total-minus-ld1"> - </div>

                        <div className="inventory-content-multi inventory2 mob-carry-over-ld1">
                            <label htmlFor="inventory" className="formulatxt InvtLabel2 row2-invtlabel">Carry Over</label>
                            <input type="number" className="form-control no-border formulaVal InvtContent2 row2-invtcontent2" value={this.determineInventoryForLd1(Item)} name="inventory" />
                        </div>
                        <div className="symbol row2-total-plus-ld1 equal"> = </div>

                        <div className="estimation-content">
                            <label htmlFor="estimation" className="formulatxt">Order</label>
                            <input type="number" className="form-control no-border formulaVal estContent" value={this.determineEstimatedOrderQnty(Item)} name="estimation" />
                        </div>

                        <div>
                            <ReactTooltip className="SELL-EXP-tooltip" place="bottom" id='SELL-EXP' type='light' disabled={true} effect="solid" globalEventOff='click'>
                                <div>
                                    <span>The largest # between Sell and Expire.</span>
                                </div>
                            </ReactTooltip>
                        </div>

                    </div>
                </div>
            )

        } else {
            return (
                <div className="formular-bar formular-1d-lead">
                    <div className="total-content cusDivSpacing">
                        <label htmlFor="total" className="formulatxt">Total</label>
                        <input type="number" className="form-control no-border formulaVal rmv-padding-bottom" value={Item.totalUnits ? Item.totalUnits : 0} readOnly name="total" />
                    </div>
                    <div className="symbol cusDivSpacing"> - </div>

                    <div className="SellExp-content cusDivSpacing">
                        <label htmlFor="sellexp" className="formulatxt sellExpHeading cusPad">{Item.maxSellExpireDayLeadTime}: Exp./F</label>
                        <img className="status-SELLEXP" alt="Max-SellExp-tooltip" data-tip data-for="SELL-EXP" src={info} />
                        <input type="number" readOnly className="form-control no-border formulaVal sellExpContent" value={this.isld1MaxSellExp(Item)} name="sellexp" />
                    </div>
                    <div className="symbol sym-invt cusDivSpacing equal"> = </div>

                    <div className="inventory-content-multi cusDivSpacing">
                        <label htmlFor="inventory" className="formulatxt InvtLabel2">Carry Over</label>
                        <input type="number" className="form-control no-border formulaVal InvtContent2 InvtContentAlign" value={this.determineInventoryForLd1(Item)} name="inventory" />
                    </div>
                    <div className="col-md-1 cusLine"></div>
                    <div className="sell-content cusDivSpacing">
                        <label htmlFor="sell" className="formulatxt sellWeeklyHeading">{Item.forecastDelveryDay}: F</label>
                        <input type="number" className="form-control no-border formulaVal sellWeeklyContent" value={Item.totalSellWeekly ? Item.totalSellWeekly : 0} name="sell" />
                    </div>
                    <div className="symbol cusDivSpacing"> - </div>

                    <div className="inventory-content-multi inventory2 cusDivSpacing">
                        <label htmlFor="inventory" className="formulatxt InvtLabel2">Carry Over</label>
                        <input type="number" className="form-control no-border formulaVal InvtContent2" value={this.determineInventoryForLd1(Item)} name="inventory" />
                    </div>
                    <div className="symbol cusDivSpacing equal"> = </div>

                    <div className="estimation-content cusDivSpacing">
                        <label htmlFor="estimation" className="formulatxt">Order</label>
                        <input type="number" className="form-control no-border formulaVal estContent" value={this.determineEstimatedOrderQnty(Item)} name="estimation" />
                    </div>

                    <div>
                        <ReactTooltip className="SELL-EXP-tooltip" place="bottom" id='SELL-EXP' type='light' disabled={true} effect="solid" globalEventOff='click'>
                            <div>
                                <span>The largest # between Sell and Expire.</span>
                            </div>
                        </ReactTooltip>
                    </div>
                </div>
            )
        }
    }

    checkifMobileld2(Item) {
        if (window.innerWidth < 768) {
            return (
                <div>
                    <div className="row total-row-ld2">
                        <div className="total-content">
                            <label for="total" className="formulatxt">Total</label>
                            <input type="number" class="form-control no-border formulaVal rmv-padding-bottom pd-ld2-total" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.totalUnits ? Item.leadTime2SH2.totalUnits : 0} name="total" />
                        </div>

                        <div className="symbol ld2-total-sign"> - </div>

                        <div className="SellExp-content">
                            <label for="sellexp" className="formulatxt sellExpHeading">{Item.maxSellExpireDayLD2SH2}: Exp./F</label>
                            <img className="status-SELLEXP left-alignld2" alt="Max-SellExp-tooltip" data-tip data-event={'click'} data-for="SELL-EXP" src={info} />
                            <input type="number" class="form-control no-border formulaVal sellExpContent" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.MaxSellExpire ? Item.leadTime2SH2.MaxSellExpire : 0} name="sellexp" />
                        </div>

                        <span className="symbol sym-Ono-ldtime"> + </span>

                        <span className="pending-delivery-ldtime">
                            <label for="pending-delivery" className="formulatxt">Ono</label>
                            <input type="number" class="form-control no-border formulaVal OnoContent-ldtime" value={Item && Item.leadTime2SH2 && Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0} name="pending-delivery" />
                        </span>

                        <span className="symbol ono-equals"> = </span>

                        <span className="leadTime-invt-ldtime">
                            <label for="leadTime-invt" className="formulatxt InvtLabel2">Carry Over</label>
                            <input type="number" class="form-control no-border formulaVal OnoContent InvtContent2 add-padding" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.carryOver ? Item.leadTime2SH2.carryOver : 0} name="leadTime-invt" />
                        </span>

                        <div>
                            <ReactTooltip className="SELL-EXP-tooltip" place="bottom" id='SELL-EXP' type='light' disabled={true} effect="solid" globalEventOff='click'>
                                <div>
                                    <span>The largest # between Sell and Expire.</span>
                                </div>
                            </ReactTooltip>
                        </div>

                    </div>

                    <div className="row total-row2-ld2">

                        <div className="sell-content">
                            <label for="sell" className="formulatxt sellWeeklyHeading">{Item.forecastDelveryDay}: F</label>
                            <input type="number" class="form-control no-border formulaVal sellWeeklyContent" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.totalSellWeekly ? Item.leadTime2SH2.totalSellWeekly : 0} name="sell" />
                        </div>

                        <div className="symbol r2-ld2-minus-symbol"> - </div>

                        <div className="inventory-content-multi inventory2">
                            <label for="inventory" className="formulatxt InvtLabel2">Carry Over</label>
                            <input type="number" class="form-control no-border formulaVal InvtContent2 rmv-padding-co" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.carryOver ? Item.leadTime2SH2.carryOver : 0} name="inventory" />
                        </div>

                        <div className="symbol r2-ld2-equals-symbol equal"> = </div>

                        <div className="estimation-content">
                            <label for="estimation" className="formulatxt">Order</label>
                            <input type="number" class="form-control no-border formulaVal estContent" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.estOrder ? Item.leadTime2SH2.estOrder : 0} name="estimation" />
                        </div>



                    </div>
                </div>
            )
        } else {
            return (
                <div className="formular-bar formula-2d-lead">
                    <div className="total-content">
                        <label htmlFor="total" className="formulatxt">Total</label>
                        <input type="number" className="form-control no-border formulaVal rmv-padding-bottom" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.totalUnits ? Item.leadTime2SH2.totalUnits : 0} name="total" />
                    </div>
                    <div className="symbol"> - </div>

                    <div className="SellExp-content">
                        <label htmlFor="sellexp" className="formulatxt sellExpHeading">{Item.maxSellExpireDayLD2SH2}: Exp./F</label>
                        <img className="status-SELLEXP left-alignld2" alt="Max-SellExp-tooltip" data-tip data-for="SELL-EXP" src={info} />
                        <input type="number" className="form-control no-border formulaVal sellExpContent" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.MaxSellExpire ? Item.leadTime2SH2.MaxSellExpire : 0} name="sellexp" />
                    </div>
                    <span className="symbol sym-Ono-ldtime"> + </span>
                    <span className="pending-delivery-ldtime">
                        <label htmlFor="pending-delivery" className="formulatxt">Ono</label>
                        <input type="number" className="form-control no-border formulaVal OnoContent-ldtime" value={Item && Item.leadTime2SH2 && Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0} name="pending-delivery" />
                    </span>

                    <span className="symbol ono-equals"> = </span>
                    <span className="leadTime-invt-ldtime">
                        <label htmlFor="leadTime-invt" className="formulatxt InvtLabel2">Carry Over</label>
                        <input type="number" className="form-control no-border formulaVal OnoContent InvtContent2 add-padding" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.carryOver ? Item.leadTime2SH2.carryOver : 0} name="leadTime-invt" />
                    </span>

                    <div className="sell-content">
                        <label htmlFor="sell" className="formulatxt sellWeeklyHeading">{Item.forecastDelveryDay}: F</label>
                        <input type="number" className="form-control no-border formulaVal sellWeeklyContent" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.totalSellWeekly ? Item.leadTime2SH2.totalSellWeekly : 0} name="sell" />
                    </div>
                    <div className="symbol"> - </div>

                    <div className="inventory-content-multi inventory2">
                        <label htmlFor="inventory" className="formulatxt InvtLabel2">Carry Over</label>
                        <input type="number" className="form-control no-border formulaVal InvtContent2 rmv-padding-co" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.carryOver ? Item.leadTime2SH2.carryOver : 0} name="inventory" />
                    </div>
                    <div className="symbol equal"> = </div>

                    <div className="estimation-content">
                        <label htmlFor="estimation" className="formulatxt">Order</label>
                        <input type="number" className="form-control no-border formulaVal estContent" value={Item && Item.leadTime2SH2 && Item.leadTime2SH2.estOrder ? Item.leadTime2SH2.estOrder : 0} name="estimation" />
                    </div>

                    <div>
                        <ReactTooltip className="SELL-EXP-tooltip" place="bottom" id='SELL-EXP' type='light' disabled={true} effect="solid" globalEventOff='click'>
                            <div>
                                <span>The largest # between Sell and Expire.</span>
                            </div>
                        </ReactTooltip>
                    </div>

                </div>
            )
        }
    }

    checkifMobileld2sh2(Item) {
        if (window.innerWidth < 768) {
            return (
                <div className="twoDay-lead-formula">
                    <div className="row total-row-ld2sh2">
                        <div className="total-content">
                            <label for="total" className="formulatxt">Total</label>
                            <input type="number" class="form-control no-border formulaVal rmv-padding-bottom ld2sh2-total-margin" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.totalUnits ? Item.leadTime2SH3.totalUnits : 0} name="total" />
                        </div>

                        <div className="symbol ld2sh2-minus-sym-row1"> - </div>

                        <div className="SellExp-content">
                            <label for="sellexp" className="formulatxt sellExpHeading">{Item.maxSellExpireDayLD2SH3}: Exp./F</label>
                            <img className="status-SELLEXP" alt="Max-SellExp-tooltip" data-tip data-event={'click'} data-for="SELL-EXP" src={info} />
                            <input type="number" class="form-control no-border formulaVal sellExpContent" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.MaxSellExpire ? Item.leadTime2SH3.MaxSellExpire : 0} name="sellexp" />
                        </div>

                        <span className="symbol ono-equals ld2sh2-equals-exp-sym-row1"> = </span>

                        <span className="leadTime-invt-ld2">
                            <label for="leadTime-invt" className="formulatxt">Carry Over</label>
                            <input type="number" class="form-control no-border formulaVal OnoContent ld2-width" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.carryOver ? Item.leadTime2SH3.carryOver : 0} name="leadTime-invt" />
                        </span>

                        <span className="symbol sym-Ono-ld2 ld2sh2-plus-co-sym-row1"> + </span>

                        <span className="pending-delivery-ld2">
                            <label for="pending-delivery-ld2-label" className="formulatxt ld2-np-padding-label">Ono</label>
                            <input type="number" class="form-control no-border formulaVal OnoContent-ld2 ld2-no-padding-row1" value={Item && Item.leadTime2SH3 && Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0} name="pending-delivery" />
                        </span>

                        <span className="symbol ono-equals ld2sh2-plus-ono-sym-row1"> = </span>

                        <span className="leadTime-invt-ld2 rmv-padding-ld2sh2">
                            <label for="leadTime-invt" className="formulatxt ld2-txt">Inventory</label>
                            <input type="number" class="form-control no-border formulaVal OnoContent-ld2invt ld2-content" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.invtLeadTime ? Item.leadTime2SH3.invtLeadTime : 0} name="leadTime-invt" />
                        </span>

                    </div>
                    <div className="row total-row2-ld2sh2">
                        <div className="sell-content">
                            <label for="sell" className="formulatxt sellWeeklyHeading">{Item.forecastDelveryDay}: F</label>
                            <input type="number" class="form-control no-border formulaVal sellWeeklyContent" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.totalSellWeekly ? Item.leadTime2SH3.totalSellWeekly : 0} name="sell" />
                        </div>

                        <div className="symbol ld2-row2-minus-symbol"> - </div>

                        <span className="leadTime-invt-ld2">
                            <label for="leadTime-invt" className="formulatxt ld2-txt">Inventory</label>
                            <input type="number" class="form-control no-border formulaVal OnoContent-ld2invt ld2-content" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.invtLeadTime ? Item.leadTime2SH3.invtLeadTime : 0} name="leadTime-invt" />
                        </span>

                        <div className="symbol ld2-row2-equals-symbol"> = </div>

                        <div className="estimation-content">
                            <label for="estimation" className="formulatxt">Order</label>
                            <input type="number" class="form-control no-border formulaVal estContent" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.estOrder ? Item.leadTime2SH3.estOrder : 0} name="estimation" />
                        </div>

                        <div>
                            <ReactTooltip className="SELL-EXP-tooltip" place="bottom" id='SELL-EXP' type='light' disabled={true} effect="solid" globalEventOff='click'>
                                <div>
                                    <span>The largest # between Sell and Expire.</span>
                                </div>
                            </ReactTooltip>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="formular-bar formula-2d-lead-2d-shelf">
                    <div className="total-content">
                        <label htmlFor="total" className="formulatxt">Total</label>
                        <input type="number" className="form-control no-border formulaVal rmv-padding-bottom" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.totalUnits ? Item.leadTime2SH3.totalUnits : 0} name="total" />
                    </div>
                    <div className="symbol cusDivSpacing"> - </div>

                    <div className="SellExp-content">
                        <label htmlFor="sellexp" className="formulatxt sellExpHeading">{Item.maxSellExpireDayLD2SH3}: Exp./F</label>
                        <img className="status-SELLEXP" alt="Max-SellExp-tooltip" data-tip data-for="SELL-EXP" src={info} />
                        <input type="number" className="form-control no-border formulaVal sellExpContent" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.MaxSellExpire ? Item.leadTime2SH3.MaxSellExpire : 0} name="sellexp" />
                    </div>

                    <span className="symbol ono-equals twoday-equal"> = </span>
                    <span className="leadTime-invt-ld2">
                        <label htmlFor="leadTime-invt" className="formulatxt">Carry Over</label>
                        <input type="number" className="form-control no-border formulaVal OnoContent ld2-width" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.carryOver ? Item.leadTime2SH3.carryOver : 0} name="leadTime-invt" />
                    </span>

                    <span className="symbol sym-Ono-ld2 cusDivSpacing"> + </span>
                    <span className="pending-delivery-ld2">
                        <label htmlFor="pending-delivery-ld2-label" className="formulatxt">Ono</label>
                        <input type="number" className="form-control no-border formulaVal OnoContent-ld2" value={Item && Item.leadTime2SH3 && Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0} name="pending-delivery" />
                    </span>

                    <span className="symbol ono-equals twoday-equal"> = </span>
                    <span className="leadTime-invt-ld2">
                        <label htmlFor="leadTime-invt" className="formulatxt ld2-txt">Inventory</label>
                        <input type="number" className="form-control no-border formulaVal OnoContent-ld2invt ld2-content" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.invtLeadTime ? Item.leadTime2SH3.invtLeadTime : 0} name="leadTime-invt" />
                    </span>

                    <div className="sell-content">
                        <label htmlFor="sell" className="formulatxt sellWeeklyHeading">{Item.forecastDelveryDay}: F</label>
                        <input type="number" className="form-control no-border formulaVal sellWeeklyContent" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.totalSellWeekly ? Item.leadTime2SH3.totalSellWeekly : 0} name="sell" />
                    </div>

                    <div className="symbol cusDivSpacing"> - </div>
                    <span className="leadTime-invt-ld2">
                        <label htmlFor="leadTime-invt" className="formulatxt ld2-txt">Inventory</label>
                        <input type="number" className="form-control no-border formulaVal OnoContent-ld2invt ld2-content" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.invtLeadTime ? Item.leadTime2SH3.invtLeadTime : 0} name="leadTime-invt" />
                    </span>

                    <div className="symbol equal twoday-equal"> = </div>
                    <div className="estimation-content">
                        <label htmlFor="estimation" className="formulatxt">Order</label>
                        <input type="number" className="form-control no-border formulaVal estContent" value={Item && Item.leadTime2SH3 && Item.leadTime2SH3.estOrder ? Item.leadTime2SH3.estOrder : 0} name="estimation" />
                    </div>

                    <div>
                        <ReactTooltip className="SELL-EXP-tooltip" place="bottom" id='SELL-EXP' type='light' disabled={true} effect="solid" globalEventOff='click'>
                            <div>
                                <span>The largest # between Sell and Expire.</span>
                            </div>
                        </ReactTooltip>
                    </div>

                </div>
            )
        }
    }
    preventdefaultKeys = (e)=>{
        if((DISALLOWED_KEYS.includes(e.key) || DISALLOWED_KEY_CODES.includes(e.keyCode)) && ( !ALLOWED_KEY_CODES.includes(e.keyCode) || !VALID_KEYS.includes(e.key) )) {
         e.preventDefault();
        }
    }

    checkIfForecastValueExists(Item) {
        if (Item.forecastSellQnty === 0) {
            return 0;
        } else if (Item.forecastSellQnty === '') {
            return 0;
        } else if ((Item.forecastSellQnty) || typeof (Item.tomorrowSalesForecastQty) === 'undefined') {
            return Item.forecastSellQnty;
        } else {
            return Item.forecastSellQnty || Item.tomorrowSalesForecastQty;
        }
    }

    checkifMobileNondaily(THIS, Item) {
        const { readOnly } = THIS.state;
        if (window.innerWidth < 768) {
            return (
                <div>
                    <div className="formular-bar non-daily-mobile-top-row row">
                        <div className="col-3 non-daily-total-height">
                            <span className="totalQuantity">
                                <input name="totalbox"
                                    type="number"
                                    disabled={readOnly}
                                    //value={(parseInt(Item.totalBalanceOnHandQty)) || Item.totalBalanceOnHandQty === "-"? Item.totalBalanceOnHandQty: ""}
                                    value={parseInt(Item.totalBalanceOnHandQty) >= 0 ? Item.totalBalanceOnHandQty + "" : parseInt(Item.totalBalanceOnHandQty) < 0 ? 0 : "" }
                                    placeholder=""
                                    className="total-box formulaVal"
                                    maxLength="4"
                                    onCopy={(e) => {e.preventDefault();}} 
                                    onPaste={(e) => {e.preventDefault();}}
                                    onBlur={(evt) => { THIS.onBlurBOHOrderQty(evt, { ...Item, totalBalanceOnHandQty: evt.target.value ? evt.target.value : '' }) }}
                                    onKeyDown={(evt) => { if ((evt.key === "Enter") || (evt.key === "Tab")) { THIS.onBlurBOHOrderQty(evt, { ...Item, totalBalanceOnHandQty: evt.target.value ? evt.target.value : '' }) }; this.preventdefaultKeys(evt) }}
                                    onChange={(evt) => { THIS.updateOrderQnty(evt, { ...Item, totalBalanceOnHandQty: evt.target.value ? evt.target.value : '' }) }} />
                            </span>
                            <span className="total-box-text">Total</span>
                        </div>
                        <div className="col- 1 symbol pd-left-ono"> + </div>
                        <div className="col-3 ono-content">
                            <label htmlFor="ono" className="ono">OnO</label>
                            <div className="value-margin pd-left-ivt">
                                <span className="formulaVal non-daily-inventory">{Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0}</span>
                            </div>
                            {/* <input type="number" className="form-control no-border formulaVal non-daily-inventory" value={Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0} name="ono" /> */}
                        </div>
                        <div className="col-1 symbol"> = </div>
                        <div className="col-3 inventory-content ivt-non-daily">
                            <label htmlFor="inventory" className="inventory">Inventory</label>
                            <div className="value-margin pd-left-ivt">
                                <span className="inventory-val">{parseInt(this.calculateInventory(Item.totalBalanceOnHandQty, Item.pendingDeliveryQty))}</span>
                            </div>
                            {/* <input type="number" className="form-control no-border formulaVal non-daily-inventory non-daily-ivt-coloring" value={this.calculateInventory(Item.totalBalanceOnHandQty  || 0, Item.pendingDeliveryQty || 0)} name="inventory" /> */}
                        </div>
                    </div>

                    <div className="row non-daily-mobile-bottom-row">
                        <div className="col-2 forecast-content">
                            <div className="heading-margin">
                                <span className="ono">{Item && Item.orderCycleTypeCode === cycleTypes.guidedReplenishment ? "Proj. F" : "Forecast"}</span>
                            </div>
                            <div className="value-margin non-daily-value-margin-padding">
                                <span className="ono-val">{THIS.checkIfForecastValueExists(Item)}</span>
                            </div>
                        </div>
                        <div className="col-1 symbol non-daily-second-row-padding"> + </div>
                        <div className="col-2 non-daily-second-row-min-box-padding">
                            <span className="min">
                                <input name="minbox"
                                    type="number"
                                    disabled={readOnly}
                                    value={parseInt(Item.minimumOnHandQty) >= 0 ? Item.minimumOnHandQty + "" : ""}
                                    className="total-box formulaVal"
                                    maxLength="4"
                                    tabIndex={-1}
                                    onCopy={(e) => {e.preventDefault();}} 
                                    onPaste={(e) => {e.preventDefault();}}
                                    onBlur={(evt) => { THIS.onBlurMOHOrderQty(evt, { ...Item, minimumOnHandQty: evt.target.value ? evt.target.value : '' }) }}
                                    onKeyDown={(evt) => { if ((evt.key === "Enter") || (evt.key === "Tab")) { THIS.onBlurMOHOrderQty(evt, { ...Item, minimumOnHandQty: evt.target.value ? evt.target.value : '' }) }; this.preventdefaultKeys(evt) }}
                                    onChange={(evt) => { THIS.updateOrderQnty(evt, { ...Item, minimumOnHandQty: evt.target.value ? evt.target.value : '' }) }} />
                            </span>
                            <span className="min-box-text min-label">Min</span>
                        </div>
                        <div className="col-2 symbol pd-left non-daily-second-row-padding minus-margin-left align-minus-nondaily-row2"> - </div>
                        <div className="col-1 inventory-content ivt-non-daily-margin mob-ivt-non-daily-margin">
                            <div className="heading-margin">
                                <span className="inventory align-ivt-label-nondaily-row2">Inventory</span>
                            </div>
                            <div className="value-margin">
                                <span className="inventory-val align-ivt-val-nondaily-row2">{parseInt(this.calculateInventory(Item.totalBalanceOnHandQty, Item.pendingDeliveryQty))}</span>
                            </div>
                        </div>
                        <div className="col-1 symbol non-daily-second-row-padding mob-non-daily-second-row-padding"> = </div>
                        <div className="col-2 order-content mob-order-content">
                            <div className="heading-margin">
                                <span className="ono">Order</span>
                            </div>
                            <div className="value-margin">
                                <span className="ono-val non-daily-order">{this.calculateOrderQuantityNonDaily(Item)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="formular-bar formula-non-daily">
                    <div className="col-md-1 non-daily-total-height cusDivSpacing">
                        <span className="totalQuantity">
                            <input name="totalbox"
                                type="number"
                                value={parseInt(Item.totalBalanceOnHandQty) >= 0 ? Item.totalBalanceOnHandQty + "" : parseInt(Item.totalBalanceOnHandQty) < 0 ? 0 : "" }
                                disabled={readOnly}
                                placeholder=""
                                className="total-box formulaVal"
                                maxLength="4"
                                onCopy={(e) => {e.preventDefault();}} 
                                onPaste={(e) => {e.preventDefault();}}
                                onBlur={(evt) => { THIS.onBlurBOHOrderQty(evt, { ...Item, totalBalanceOnHandQty: evt.target.value ? evt.target.value : '' }) }}
                                onKeyDown={(evt) => { if ((evt.key === "Enter") || (evt.key === "Tab")) { THIS.onBlurBOHOrderQty(evt, { ...Item, totalBalanceOnHandQty: evt.target.value ? evt.target.value : '' }) }; this.preventdefaultKeys(evt) }}
                                onChange={(evt) => { THIS.updateOrderQnty(evt, { ...Item, totalBalanceOnHandQty: evt.target.value ? evt.target.value : '' }) }} />
                        </span>
                        <span className="total-box-text">Total</span>
                    </div>
                    <div className="symbol pd-left-ono cusDivSpacing"> + </div>
                    <div className="ono-content cusDivSpacing">
                        <label htmlFor="ono" className="ono">OnO</label>
                        <div className="value-margin pd-left-ivt">
                            <span className="formulaVal non-daily-inventory">{Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0}</span>
                        </div>
                        {/* <input type="number" className="form-control no-border formulaVal non-daily-inventory" value={Item.pendingDeliveryQty ? Item.pendingDeliveryQty : 0} name="ono" /> */}
                    </div>
                    <div className="symbol cusDivSpacing"> = </div>
                    <div className="inventory-content ivt-non-daily cusDivSpacing">
                        <label htmlFor="inventory" className="inventory">Inventory</label>
                        <div className="value-margin pd-left-ivt">
                            <span className="inventory-val">{parseInt(this.calculateInventory(Item.totalBalanceOnHandQty, Item.pendingDeliveryQty))}</span>
                        </div>
                        {/* <input type="number" className="form-control no-border formulaVal non-daily-inventory non-daily-ivt-coloring" value={this.calculateInventory(Item.totalBalanceOnHandQty  || 0, Item && Item.pendingDeliveryQty)} name="inventory" /> */}
                    </div>
                    <div className="col-md-1 cusNonDailyFo cusLine" ></div>
                    <div className="forecast-content cusDivSpacing">
                        <div className="heading-margin">
                            <span className="ono">{Item && Item.orderCycleTypeCode === cycleTypes.guidedReplenishment ? "Proj. F" : "Forecast"}</span>
                        </div>
                        <div className="value-margin non-daily-value-margin-padding">
                            <span className="ono-val">{THIS.checkIfForecastValueExists(Item)}</span>
                        </div>
                    </div>
                    <div className="symbol cusDivSpacing"> + </div>
                    <div className="col-md-1 non-daily-total-height cusDivSpacing">
                        <span className="min">
                            <input name="minbox"
                                type="number"
                                disabled={readOnly}
                                value={parseInt(Item.minimumOnHandQty) >= 0 ? Item.minimumOnHandQty + "" : ""}
                                className="total-box formulaVal"
                                maxLength="4"
                                tabIndex={-1}
                                onCopy={(e) => {e.preventDefault();}} 
                                onPaste={(e) => {e.preventDefault();}}
                                onBlur={(evt) => { THIS.onBlurMOHOrderQty(evt, { ...Item, minimumOnHandQty: evt.target.value ? evt.target.value : '' }) }}
                                onKeyDown={(evt) => { if ((evt.key === "Enter") || (evt.key === "Tab")) { THIS.onBlurMOHOrderQty(evt, { ...Item, minimumOnHandQty: evt.target.value ? evt.target.value : '' }) }; this.preventdefaultKeys(evt) }}
                                onChange={(evt) => { THIS.updateOrderQnty(evt, { ...Item, minimumOnHandQty: evt.target.value ? evt.target.value : '' }) }}
                            />
                        </span>
                        <span className="total-box-text min-label">Min</span>
                    </div>
                    <div className="symbol pd-left cusDivSpacing"> - </div>
                    <div className="inventory-content ivt-non-daily-margin cusDivSpacing">
                        <div className="heading-margin">
                            <span className="inventory">Inventory</span>
                        </div>
                        <div className="value-margin pd-left-ivt">
                            <span className="inventory-val">{parseInt(this.calculateInventory(Item.totalBalanceOnHandQty, Item.pendingDeliveryQty))}</span>
                        </div>
                    </div>
                    <div className="symbol cusDivSpacing"> = </div>
                    <div className="order-content cusDivSpacing">
                        <div className="heading-margin">
                            <span className="ono">Order</span>
                        </div>
                        <div className="value-margin">
                            <span className="ono-val non-daily-order">{this.calculateOrderQuantityNonDaily(Item)}</span>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        const THIS = this;
        const { Item, OrderingCycleType, index } = this.state;

        if (OrderingCycleType === 'MULTI_DAY' && Item.hasOwnProperty('totalUnits') && Item.hasOwnProperty('totalExpire') && Item.hasOwnProperty('totalSellWeekly') && Item.hasOwnProperty('totalSell') && Item.leadTime === 1) {
            return (
                <div key={index}>
                    {this.checkifMobileld1(Item)}
                </div>
            )
        } else if (OrderingCycleType === 'MULTI_DAY' && Item.hasOwnProperty('totalUnits') && Item.hasOwnProperty('totalExpire') && Item.hasOwnProperty('totalSellWeekly') && Item.hasOwnProperty('totalSell') && Item.leadTime === 2 && Item.shelfLife === 2) {
            return (
                <div key={index}>
                    {this.checkifMobileld2(Item)}
                </div>
            )
        } else if (OrderingCycleType === 'MULTI_DAY' && Item.hasOwnProperty('totalUnits') && Item.hasOwnProperty('totalExpire') && Item.hasOwnProperty('totalSellWeekly') && Item.hasOwnProperty('totalSell') && Item.leadTime === 2 && Item.shelfLife > 2) {
            return (
                <div key={index}>
                    {this.checkifMobileld2sh2(Item)}
                </div>
            )
        } else if (OrderingCycleType === "NON_DAILY" && Item && Item.hasOwnProperty('forecastSellQnty')) {
            return (
                <div key={index}>
                    {this.checkifMobileNondaily(THIS, Item)}
                </div>

            )
        } else return null
    }
}


export default connect(
    null
)(withRouter(Formula))