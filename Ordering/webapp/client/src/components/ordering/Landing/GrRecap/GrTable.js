import React, { Component } from 'react';
import './GrTable.css';
import { getDataForGr, postOrderDetails, getGRVendorDetails } from '../../../../actions';
import SpinnerComponent from '../../../shared/SpinnerComponent'
import { sortGrData } from '../../../utility/sortGrData'
import { unsortGrData } from '../../../utility/unsortGrData';
import { storeDetails } from '../../../../lib/storeDetails';
import { grRecapSubmitData } from '../../../utility/grRecapSubmitData'
import { checkAllItemsApproved } from '../../../utility/checkAllItemsApproved'
import ReactTooltip from 'react-tooltip';
import MessageBox from '../../../shared/MessageBox';
import info from '../../../../assets/images/info.png'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NON_DAILY , VENDOR_STRING, START_PROMOTION, ON_PROMOTION, END_PROMOTION, APPROVED_STATUS } from '../../../../constants/ActionTypes'
import { determineMinLDU, determineMaxLDU } from '../../../utility/ldu';
import { ORDER_QTY_REGEX, VALID_KEYS, ALLOWED_KEY_CODES, DISALLOWED_KEY_CODES, DISALLOWED_KEYS } from '../../../utility/constants';
import { validateOrderQty } from '../../../utility/validateOrderQty';
import { validateRolesAndReadOnlyView } from '../../../utility/validateRolesAndReadOnlyView';

class GrTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedStoreFunction: null,
            storeId: storeDetails() && storeDetails().storeId,
            grData: false,
            grVendorList: false,
            originalData: [],
            descriptionFlag: 0,
            statusFlag: 0,
            balanceOnHandFlag: 0,
            onOrderFlag: 0,
            quantityFlag: 0,
            flagArray: [1,2],
            parentCollapse: false,
            masterCheckNonDaily: false,
            masterCheckVendor: false,
            grDroppdown: NON_DAILY,
            grNonDailySpinner: true,
            grVendorSpinner: false,
            showModal: false,
            msgBoxBody: '',
            autoApprove: storeDetails() && storeDetails().isGRAutoApprove,
            grPageMessageBox: false,
            grOnHomeMessageBox: false,
            showLDUModal: false,
            msgLDUBody: '',
            LDUMin: '',
            LDUMax: '',
            itmMsgIndex: '',
            prevLength: 0,
            showSavedQntyModal: false,
            SavedQntyBody: '',
            disableApproveButton: true,
            onSubmitContainerSpinner: false,
            onRender: false,
            grStatus: '',
            readOnly: validateRolesAndReadOnlyView() 
        }

        /* Added to reset the default image on login page*/
        document.querySelector("body").style.backgroundImage='none';
        this.lduMinOrderQntyChk = this.lduMinOrderQntyChk.bind(this);
        this.lduMaxOrderQntyChk = this.lduMaxOrderQntyChk.bind(this);
        this.previousSelectionChk = this.previousSelectionChk.bind(this);
        this.defaultSelectionChk = this.defaultSelectionChk.bind(this);
      }

    componentDidMount(){
        const { storeId } = this.state;
        //setTimeout(() => {
            this.props.dispatch(getDataForGr(storeId));
        //}, 1000)
    }
    
    componentWillReceiveProps(newProps){
        const { 
            descriptionFlag, 
            onOrderFlag, 
            statusFlag, 
            quantityFlag, 
            balanceOnHandFlag, 
            autoApprove,
            originalData,
            orginalVendorList,
            grDroppdown,
            storeId,
            grData,
            grVendorList
         } = this.state;

        this.setState({
            grDroppdown: newProps.grDroppdown,
            onRender: true,
            grStatus: newProps.grStatus
        },()=>{
            this.setState({
                grData: sortGrData(newProps.grData, descriptionFlag, statusFlag, onOrderFlag, balanceOnHandFlag, quantityFlag),
                originalData: newProps.grData,
                grVendorList: sortGrData([...(newProps.grVendorList && newProps.grVendorList.CDC ? this.props.grVendorList.CDC: [] ), ...((newProps.grVendorList && newProps.grVendorList.DSD ? newProps.grVendorList.DSD: [] ))],descriptionFlag, statusFlag, onOrderFlag, balanceOnHandFlag, quantityFlag) ,
                orginalVendorList: [...(newProps.grVendorList && newProps.grVendorList.CDC ? this.props.grVendorList.CDC: [] ), ...((newProps.grVendorList && newProps.grVendorList.DSD ? newProps.grVendorList.DSD: [] ))] ,
            },()=>{
                this.setContinueButton();
                if( newProps && newProps.grVendorList && newProps.grVendorList !== grVendorList && grDroppdown === VENDOR_STRING && (this.props.grStatus === "COMPLETE" || this.props.grStatus === "NETWORK_ERROR")){
                    this.setState({ grVendorSpinner: false, onSubmitContainerSpinner: false});
                    this.props.grRecapStopSpinner();
                }

                if( newProps && grData && newProps.grData !== grData && grDroppdown === NON_DAILY && (this.props.grStatus === "COMPLETE" || this.props.grStatus === "NETWORK_ERROR")){
                    this.setState({ grNonDailySpinner: false, onSubmitContainerSpinner: false });
                    this.props.grRecapStopSpinner();
                }
            })

            if(grDroppdown !== newProps.grDroppdown){
                if(newProps.grDroppdown === NON_DAILY){
                    this.props.dispatch(getDataForGr(storeId));
                    this.setState({ 
                        grNonDailySpinner: true, 
                        grData: [],
                        descriptionFlag: 0,
                        statusFlag: 0,
                        balanceOnHandFlag: 0,
                        onOrderFlag: 0,
                        quantityFlag: 0,
                     });
                }
                if(newProps.grDroppdown === VENDOR_STRING){
                    this.props.dispatch(getGRVendorDetails(storeId))
                    this.setState({ 
                        grVendorSpinner: true, 
                        grVendorList: [],
                        descriptionFlag: 0,
                        statusFlag: 0,
                        balanceOnHandFlag: 0,
                        onOrderFlag: 0,
                        quantityFlag: 0, 
                    });
                }
            }
        });

        if(newProps && newProps.sortValue){
            this.sort(newProps.sortValue)
        }
        if(newProps && newProps.submit){
            this.props.dispatch(postOrderDetails(grRecapSubmitData( originalData, orginalVendorList, storeId, newProps.grDroppdown )));
            this.props.submitComplete();
            setTimeout(() => {
                this.setState({ onSubmitContainerSpinner: true })
                if(newProps.grDroppdown === NON_DAILY){
                    this.props.dispatch(getDataForGr(storeId));
                }
                if(newProps.grDroppdown === VENDOR_STRING){
                    this.props.dispatch(getGRVendorDetails(storeId))
                }
            }, 1000)

        }

        if(newProps && newProps.previous){
            this.props.previousComplete()
            if(autoApprove){
                this.props.history.push('/landing');
            } else {
                const allItemsApproved = checkAllItemsApproved(originalData,orginalVendorList, newProps.grDroppdown);
                if(allItemsApproved){
                    this.props.history.push('/landing');
                } else {
                    this.displayMessageBox2();
                }
            }
        }

        if(newProps && newProps.onHome){
            if(autoApprove){
                this.props.history.push('/home');
            } else {
                const allItemsApproved = checkAllItemsApproved(originalData,orginalVendorList, newProps.grDroppdown);
                if(allItemsApproved){
                    this.props.history.push('/home');
                } else {
                    this.displayOnClickHome();
                }
            }
        }
    }
    
    sort = (flag)=>{
        const THIS = this;
        const {  originalData, orginalVendorList, descriptionFlag, onOrderFlag, statusFlag, quantityFlag, balanceOnHandFlag } = this.state;
        this.setState({ onRender: true },()=>{
            setTimeout(() => {
                switch (flag) {
                    case "descriptionFlag":
                        THIS.setState({ 
                            descriptionFlag: descriptionFlag === 0 ? 1 : descriptionFlag === 1 ? 2 :1 ,
                            statusFlag: 0,
                            balanceOnHandFlag: 0,
                            onOrderFlag: 0,
                            quantityFlag: 0,
                            grData: sortGrData(originalData, descriptionFlag === 0 ? 1 : descriptionFlag === 1 ? 2 :1, 0, 0, 0, 0),
                            grVendorList: sortGrData(orginalVendorList, descriptionFlag === 0 ? 1 : descriptionFlag === 1 ? 2 :1 , 0, 0, 0, 0)
                        },()=>{
                            if (this.refs.main){
                                this.refs.main.scrollTop=0;
                            }
                        });
                        break;
                    case "statusFlag":
                            THIS.setState({ 
                                statusFlag: statusFlag === 0 ? 1 : statusFlag === 1 ? 2 :1,
                                descriptionFlag: 0,
                                balanceOnHandFlag: 0,
                                onOrderFlag: 0,
                                quantityFlag: 0,
                                grData: sortGrData(originalData, 0, statusFlag === 0 ? 1 : statusFlag === 1 ? 2 :1, 0, 0, 0),
                                grVendorList: sortGrData(orginalVendorList, 0, statusFlag === 0 ? 1 : statusFlag === 1 ? 2 :1, 0, 0, 0)
        
                            },()=>{
                                if (this.refs.main){
                                    this.refs.main.scrollTop=0;
                                }
                            });
                        break;
                    case "onOrderFlag":
                        THIS.setState({ 
                            onOrderFlag: onOrderFlag === 0 ? 1 : onOrderFlag === 1 ? 2 :1,
                            descriptionFlag: 0,
                            statusFlag: 0,
                            balanceOnHandFlag: 0,
                            quantityFlag: 0,
                            grData: sortGrData(originalData, 0, 0, onOrderFlag === 0 ? 1 : onOrderFlag === 1 ? 2 :1, 0, 0),
                            grVendorList: sortGrData(orginalVendorList, 0, 0, onOrderFlag === 0 ? 1 : onOrderFlag === 1 ? 2 :1, 0, 0)
                        },()=>{
                            if (this.refs.main){
                                this.refs.main.scrollTop=0;
                            }
                        });
                        break;
                    case "balanceOnHandFlag":
                            THIS.setState({ 
                                balanceOnHandFlag: balanceOnHandFlag === 0 ? 1 : balanceOnHandFlag === 1 ? 2 :1,
                                descriptionFlag: 0,
                                statusFlag: 0,
                                onOrderFlag: 0,
                                quantityFlag: 0,
                                grData: sortGrData(originalData, 0, 0, 0, balanceOnHandFlag === 0 ? 1 : balanceOnHandFlag === 1 ? 2 :1, 0),
                                grVendorList: sortGrData(orginalVendorList, 0, 0, 0, balanceOnHandFlag === 0 ? 1 : balanceOnHandFlag === 1 ? 2 :1, 0)
        
                            },()=>{
                                if (this.refs.main){
                                    this.refs.main.scrollTop=0;
                                }
                            });
                        break;
                    case "quantityFlag":
                        THIS.setState({ 
                            quantityFlag: quantityFlag === 0 ? 1 : quantityFlag === 1 ? 2 :1,
                            descriptionFlag: 0,
                            statusFlag: 0,
                            balanceOnHandFlag: 0,
                            onOrderFlag: 0,
                            grData: sortGrData(originalData, 0, 0, 0, 0, quantityFlag === 0 ? 1 : quantityFlag === 1 ? 2 :1),
                            grVendorList: sortGrData(orginalVendorList, 0, 0, 0, 0, quantityFlag === 0 ? 1 : quantityFlag === 1 ? 2 :1)
        
                        },()=>{
                            if (this.refs.main){
                                this.refs.main.scrollTop=0;
                            }
                        });
                    break;
                    default:
                        break;
                }            
            }, 100);            

        })

    }

    alignItem(elementId) {
        if (window.innerWidth > 320) {
            setTimeout(function () {
                const element = document.getElementById(elementId);
                element && element.scrollIntoView({
                    block: 'start',
                    inline: 'start',
                    behavior: "smooth"
                });
            }, 300);
        } 
    }

    handleFocus(event){
        event.target.select();
    }

    modalAction= (grPageMessageBox)=> {
        this.setState({ grPageMessageBox: grPageMessageBox});
    }

    MinMaxModalAction= (showModal, index, catIndex)=> {
        const { grDroppdown } = this.state;
        this.setState({showModal: showModal});
        
        if(grDroppdown === NON_DAILY){
            if(validateOrderQty(catIndex)){
                this.refs[`${NON_DAILY}-${catIndex}-${index}`].focus(); 
                this.refs[`${NON_DAILY}-${catIndex}-${index}`].select(); 
            }else{
                this.refs[`${NON_DAILY}-${index}`].focus(); 
                this.refs[`${NON_DAILY}-${index}`].select(); 
            }
        }else if(grDroppdown === VENDOR_STRING){
            if(validateOrderQty(catIndex)){
                this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].focus(); 
                this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].select(); 
            }else{
                this.refs[`${VENDOR_STRING}-${index}`].focus(); 
                this.refs[`${VENDOR_STRING}-${index}`].select(); 
            }
        }
    }

    LduModalAction= (showLDUModal, index, catIndex)=> {
        const { grDroppdown } = this.state;
        
        this.setState({showLDUModal: showLDUModal});
        if(grDroppdown === NON_DAILY){
            if(validateOrderQty(catIndex)){
                this.refs[`${NON_DAILY}-${catIndex}-${index}`].focus(); 
                this.refs[`${NON_DAILY}-${catIndex}-${index}`].select(); 
            }else{
                this.refs[`${NON_DAILY}-${index}`].focus(); 
                this.refs[`${NON_DAILY}-${index}`].select(); 
            }
        }else if(grDroppdown === VENDOR_STRING){
            if(validateOrderQty(catIndex)){
                this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].focus(); 
                this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].select();
            }else{
                this.refs[`${VENDOR_STRING}-${index}`].focus(); 
                this.refs[`${VENDOR_STRING}-${index}`].select(); 
            }
        }
    }

    lduMinOrderQntyChk(minVal, index, catIndex) {
        let { grData, grVendorList, grDroppdown } = this.state;

        if(grDroppdown === NON_DAILY){
            if(validateOrderQty(catIndex)){
                grData[catIndex].items[index].untransmittedOrderQty = minVal;
            }else{
                grData[index].untransmittedOrderQty = minVal;
            }
        } else if ( grDroppdown === VENDOR_STRING ){
            if(validateOrderQty(catIndex)){
                grVendorList[catIndex].items[index].untransmittedOrderQty = minVal; 
            }else{
                grVendorList[index].untransmittedOrderQty = minVal;
            }
        }

        this.setState({
            grData: grData,
            grVendorList: grVendorList,
            showLDUModal: false
        },()=>{
            let { grDroppdown } = this.state;

            if(grDroppdown === NON_DAILY){
                if(validateOrderQty(catIndex)){
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].select(); 
                }else{
                    this.refs[`${NON_DAILY}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${index}`].select(); 
                }
            } else if ( grDroppdown === VENDOR_STRING ){
                if(validateOrderQty(catIndex)){
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].focus(); 
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].select(); 
                }else{
                    this.refs[`${VENDOR_STRING}-${index}`].focus(); 
                    this.refs[`${VENDOR_STRING}-${index}`].select();
                }
            }
        })
    }

    previousSelectionChk(preVal, index, catIndex) {
        let { grData, grVendorList, grDroppdown } = this.state;

        if(grDroppdown === NON_DAILY){
            if(validateOrderQty(catIndex)){
                grData[catIndex].items[index].untransmittedOrderQty = preVal;
                grData[catIndex].items[index].savedQuantity = preVal;
            }else{
                grData[index].untransmittedOrderQty = preVal;
                grData[index].savedQuantity = preVal;
            }
        } else if ( grDroppdown === VENDOR_STRING ){
            if(validateOrderQty(catIndex)){
                grVendorList[catIndex].items[index].untransmittedOrderQty = preVal;
                grVendorList[catIndex].items[index].savedQuantity = preVal;
            }else{
                grVendorList[index].untransmittedOrderQty = preVal;
                grVendorList[index].savedQuantity = preVal;
            }
        }

        this.setState({
            grData: grData,
            grVendorList: grVendorList,
            showSavedQntyModal: false
        },()=>{
            let { grDroppdown } = this.state;
            
            if(grDroppdown === NON_DAILY){
                if(validateOrderQty(catIndex)){
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].select(); 
                }else{
                    this.refs[`${NON_DAILY}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${index}`].select(); 
                }
            } else if ( grDroppdown === VENDOR_STRING ){
                if(validateOrderQty(catIndex)){
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].focus(); 
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].select(); 
                }else{
                    this.refs[`${VENDOR_STRING}-${index}`].focus(); 
                    this.refs[`${VENDOR_STRING}-${index}`].select(); 
                }
            }
        })
    }

    defaultSelectionChk(defaultVal, index, catIndex) {
        let { grData, grVendorList, grDroppdown } = this.state;

        if(grDroppdown === NON_DAILY){
            if(validateOrderQty(catIndex)){
                grData[catIndex].items[index].untransmittedOrderQty = defaultVal;
                grData[catIndex].items[index].savedQuantity = defaultVal;
            }else{
                grData[index].untransmittedOrderQty = defaultVal;
                grData[index].savedQuantity = defaultVal;
            }
        } else if ( grDroppdown === VENDOR_STRING ){
            if(validateOrderQty(catIndex)){
                grVendorList[catIndex].items[index].untransmittedOrderQty = defaultVal;
                grVendorList[catIndex].items[index].savedQuantity = defaultVal;
            }else{
                grVendorList[index].untransmittedOrderQty = defaultVal;
                grVendorList[index].savedQuantity = defaultVal;
            }
        }

        this.setState({
            grData: grData,
            grVendorList: grVendorList,
            showSavedQntyModal: false
        },()=>{
            let { grDroppdown } = this.state;

            if(grDroppdown === NON_DAILY){
                if(validateOrderQty(catIndex)){
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].select(); 
                }else{
                    this.refs[`${NON_DAILY}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${index}`].select();
                }
            } else if ( grDroppdown === VENDOR_STRING ){
                if(validateOrderQty(catIndex)){
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].focus(); 
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].select();
                }else{
                    this.refs[`${VENDOR_STRING}-${index}`].focus();
                    this.refs[`${VENDOR_STRING}-${index}`].select();  
                }
            }
        })
    }

    lduMaxOrderQntyChk(maxVal, index, catIndex) {
        let { grData, grVendorList, grDroppdown } = this.state;

        if(grDroppdown === NON_DAILY){
            if(validateOrderQty(catIndex)){
                grData[catIndex].items[index].untransmittedOrderQty = maxVal;
            }else{
                grData[index].untransmittedOrderQty = maxVal;
            }
        } else if ( grDroppdown === VENDOR_STRING ){
            if(validateOrderQty(catIndex)){
                grVendorList[catIndex].items[index].untransmittedOrderQty = maxVal;
            }else{
                grVendorList[index].untransmittedOrderQty = maxVal;
            }
        }

        this.setState({
            grData: grData,
            grVendorList: grVendorList,
            showLDUModal: false
        },()=>{
            let { grDroppdown } = this.state;

            if(grDroppdown === NON_DAILY){
                if(validateOrderQty(catIndex)){
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].focus();
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].select();
                }else{
                    this.refs[`${NON_DAILY}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${index}`].select(); 
                }
            } else if ( grDroppdown === VENDOR_STRING ){
                if(validateOrderQty(catIndex)){
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].focus();
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].select();
                }else{
                    this.refs[`${VENDOR_STRING}-${index}`].focus();
                    this.refs[`${VENDOR_STRING}-${index}`].select();
                }
            }
        })
    }

    savedQntyModalAction=(showSavedQntyModal, index, catIndex)=>{
        const { grDroppdown } = this.state;

        this.setState({showSavedQntyModal: showSavedQntyModal},()=>{
            if(grDroppdown === NON_DAILY){
                if(validateOrderQty(catIndex)){
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${catIndex}-${index}`].select(); 
                }else{
                    this.refs[`${NON_DAILY}-${index}`].focus(); 
                    this.refs[`${NON_DAILY}-${index}`].select(); 
                }
            }else if(grDroppdown === VENDOR_STRING){
                if(validateOrderQty(catIndex)){
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].focus(); 
                    this.refs[`${VENDOR_STRING}-${catIndex}-${index}`].select();
                }else{
                    this.refs[`${VENDOR_STRING}-${index}`].focus(); 
                    this.refs[`${VENDOR_STRING}-${index}`].select(); 
                }
            }
        });
    }

    displayMessageBox(inputQnty, itmQnty, catIndex, index) {
        const msgBoxBody = inputQnty > itmQnty ?
            `Order quantity exceeds the MAX quantity, should not be more than ${itmQnty} units.` :
            `Order quantity is less than the MIN quantity, must be at least ${itmQnty} units.`;
        this.setState({
            msgBoxBody: msgBoxBody,
            showModal: true,
            itmMsgIndex: index,
            catIndex: catIndex
        });
        setTimeout(() => {
            document.getElementById("orderMin").focus();
        }, 1);
    }
    modalActionOnHome= (grOnHomeMessageBox)=> {
        this.setState({ grOnHomeMessageBox: grOnHomeMessageBox});
    }
    
    displayMessageBox2(){
        const msgBoxBody = `Are you sure you want to exit? Not all of your orders have been approved`
       this.setState({msgBoxBody: msgBoxBody, grPageMessageBox: true})
    }

    displayOnClickHome(){
        const msgBoxBody = `Are you sure you want to exit? Not all of your orders have been approved`
       this.setState({msgBoxBody: msgBoxBody, grOnHomeMessageBox: true})
    }
 
    handleOrderQuantityForItems( event, index, grDroppdown ) {
        let  { grData, originalData, grVendorList, orginalVendorList } = this.state;
        let inputQnty = event.target.value ? parseInt(event.target.value) : "";
        if (event.target.value === '' || ORDER_QTY_REGEX.test(event.target.value)) {
            if(isNaN(inputQnty)){
                return;
            }else{
                if(grDroppdown === NON_DAILY){
                    grData[index].valueChange = true;
                    grData[index].untransmittedOrderQty = inputQnty;
                    this.setState({ grData: grData, originalData: unsortGrData(originalData, grData[index]) });
                } else if (grDroppdown === VENDOR_STRING) {
                    grVendorList[index].valueChange = true;
                    grVendorList[index].untransmittedOrderQty = inputQnty;
                    this.setState({ grVendorList: grVendorList, orginalVendorList: unsortGrData(orginalVendorList, grVendorList[index]) });
                }
            }
        }
    }
        
    validateOrderQuantityForItems( index, data, grDroppdown, isSubmit, moveFocus){
        const {  originalData, orginalVendorList, storeId } = this.state;
        let inputQnty = data[index].untransmittedOrderQty;
        /**Show Modal- Previous and default selection */
        let SavedQntyBody = `Choose a desired Order Quantity:`;
        let savedQuantity = data[index]['savedQuantity'];
        if(inputQnty === "" && data[index].hasOwnProperty('savedQuantity') && data[index]['savedQuantity'] !== null){
            if(parseInt(data[index]['savedQuantity']) === 0){
                data[index].untransmittedOrderQty = 0;
                inputQnty = 0;
            } else {
                this.setState({
                    SavedQntyBody: SavedQntyBody,
                    showSavedQntyModal: true,
                    previousSelectionVal: savedQuantity,
                    defaultSelectionVal: 0,
                    itmMsgIndex: index,
                    catIndex: undefined
                })
                setTimeout(() => {
                    let defaultButton = document.getElementById("btn-previous");
                    if (defaultButton) {
                        defaultButton.focus();
                    }
                }, 1);
            }
        }

        if(isNaN(inputQnty)){
            return;
        }else{
            if(inputQnty !== ""){
                
                /**Order Min/Max */
                let minQnty = data[index].minimumAllowableOrderQty;
                let maxQnty = data[index].maximumAllowableOrderQty;

                /**LDU Check */
                let ldu = data[index].ldu;
                let maxLDU = ldu && determineMaxLDU(ldu, inputQnty)
                let msgLDUBody = `The order quantity is not a multiple of LDU. Choose one of the below:`;
                let minLDU = ldu && determineMinLDU(ldu, inputQnty);

                if (inputQnty !== 0 && inputQnty >= minQnty && inputQnty <= maxQnty && ldu && inputQnty % ldu !== 0) {
                        this.setState({
                            msgLDUBody: msgLDUBody,
                            showLDUModal: true,
                            LDUMin: minLDU,
                            LDUMax: maxLDU,
                            itmMsgIndex: index,
                            catIndex: undefined
                        })
                        setTimeout(() => {
                            let defaultButton = document.getElementById("btn-ldu-min"); // for ldu
                            if (defaultButton) {
                                defaultButton.focus();
                            }
                        }, 1);
                } else if (inputQnty !== 0 && inputQnty < minQnty) {
                    //Display Min Message
                    this.displayMessageBox(inputQnty, minQnty, null, index);
                    data[index].untransmittedOrderQty = minQnty;
                } else if (inputQnty !== 0 && inputQnty > maxQnty) {
                    //Display Max Message
                    this.displayMessageBox(inputQnty, maxQnty, null, index);
                    data[index].untransmittedOrderQty = maxQnty;
                } else {
                    // :: TODO : move all this into a function 
                    if(validateOrderQty(data[index].untransmittedOrderQty)){
                        data[index].savedQuantity = data[index].untransmittedOrderQty;
                    }

                    let itemsArray = [];
                    if(isSubmit && data[index].valueChange ){
                        data[index].valueChange = false;
                        data[index].isUserModifiedItemOrderQty = true;
                        data[index].orderChangeStatus = "Approved";
                        data[index].isSelectedByUser = false;
                        itemsArray.push(data[index]);
                        this.props.dispatch(postOrderDetails({
                            Items: itemsArray,
                            storeId: storeId
                            }));

                    }
                    if(moveFocus) {
                        this.moveFocusToNextValidItem(data, index, grDroppdown);
                    }
                    if(grDroppdown === NON_DAILY){
                        this.setState({ grData: data, originalData: unsortGrData(originalData, data[index]) });
                    } else if ( grDroppdown === VENDOR_STRING ){
                        this.setState({ grVendorList: data, orginalVendorList: unsortGrData(orginalVendorList, data[index]) });
                    }
                }
            }
        }    
    }

    moveFocusToNextValidItem(data, itemIndex, grDroppdown){
        const itemsLength = data.length - 1;
        
        if(itemIndex + 1 <= itemsLength){
            this.refs[`${grDroppdown}-${itemIndex + 1}`].focus(); 
        }
    }

    handleOrderQuantityForItemsWithCat(event, catIndex, index, grDroppdown) {
        let { grData, grVendorList } = this.state;
        let inputQnty = event.target.value  ? parseInt(event.target.value) : "";
        if (event.target.value === '' || ORDER_QTY_REGEX.test(event.target.value)) {
            if (isNaN(inputQnty)) {
                grData[catIndex].items[index].untransmittedOrderQty = 0;
            } else {
                if (grDroppdown === NON_DAILY) {
                    grData[catIndex].items[index].valueChange = true;
                    grData[catIndex].items[index].untransmittedOrderQty = inputQnty;
                    this.setState({
                        grData: grData,
                        originalData: grData
                    });
                } else if (grDroppdown === VENDOR_STRING) {
                    grVendorList[catIndex].items[index].valueChange = true;
                    grVendorList[catIndex].items[index].untransmittedOrderQty = inputQnty;
                    this.setState({
                        grVendorList: grVendorList,
                        orginalVendorList: grVendorList
                    });
                }
            }
        }
    }

    validateOrderQuantityForItemsWithCat(catIndex, index, data, grDroppdown, isSubmit, moveFocus){
        const {  storeId } = this.state;
        let inputQnty = data[catIndex].items[index].untransmittedOrderQty;
        /**Show Modal- Previous and default selection */
        let SavedQntyBody = `Choose a desired Order Quantity:`;
        let savedQuantity = data[catIndex].items[index]['savedQuantity'];
        if(inputQnty === "" && data[catIndex].items[index].hasOwnProperty('savedQuantity') && data[catIndex].items[index]['savedQuantity'] !== null){
            if(parseInt(data[catIndex].items[index]['savedQuantity']) === 0){
                data[catIndex].items[index].untransmittedOrderQty = 0;
                inputQnty = 0;
            } else {
                this.setState({
                    SavedQntyBody: SavedQntyBody,
                    showSavedQntyModal: true,
                    previousSelectionVal: savedQuantity,
                    defaultSelectionVal: 0,
                    itmMsgIndex: index,
                    catIndex: catIndex
                })
                setTimeout(() => {
                    let defaultButton = document.getElementById("btn-previous");
                    if (defaultButton) {
                        defaultButton.focus();
                    }
                }, 1);
            }
        }

        if(isNaN(inputQnty)){
            return;
        }else{
            if(inputQnty !== ""){
                
                /**Order Min/Max */
                let minQnty = data[catIndex].items[index].minimumAllowableOrderQty;
                let maxQnty = data[catIndex].items[index].maximumAllowableOrderQty;

                /**LDU Check */
                let ldu = data[catIndex].items[index].ldu;
                let maxLDU = ldu && determineMaxLDU(ldu, inputQnty)
                let msgLDUBody = `The order quantity is not a multiple of LDU. Choose one of the below:`; 
                let minLDU = ldu && determineMinLDU(ldu, inputQnty);

                //console.log("LDU", Items[index], minQnty, maxQnty, minLDU, maxLDU);
                if ( inputQnty !== 0 && inputQnty >= minQnty && inputQnty <= maxQnty && ldu && inputQnty % ldu !== 0) {
                        this.setState({
                            msgLDUBody: msgLDUBody,
                            showLDUModal: true,
                            LDUMin: minLDU,
                            LDUMax: maxLDU,
                            itmMsgIndex: index,
                            catIndex: catIndex
                        })
                        setTimeout(() => {
                            let defaultButton = document.getElementById("btn-ldu-min"); // for ldu
                            if (defaultButton) {
                                defaultButton.focus();
                            }
                        }, 1);
                } else if (inputQnty !== 0 && inputQnty < minQnty) {
                    //Display Min Message
                    this.displayMessageBox(inputQnty, minQnty, catIndex, index);
                    data[catIndex].items[index].untransmittedOrderQty = minQnty;
                } else if (inputQnty !== 0 && inputQnty > maxQnty) {
                    //Display Max Message
                    this.displayMessageBox(inputQnty, maxQnty, catIndex, index);
                    data[catIndex].items[index].untransmittedOrderQty = maxQnty;
                } else {
                    // :: TODO : move all this into a function 
                    if(validateOrderQty(data[catIndex].items[index].untransmittedOrderQty)){
                        data[catIndex].items[index].savedQuantity = data[catIndex].items[index].untransmittedOrderQty;
                    }

                    let itemsArray = [];
                    if(isSubmit && data[catIndex].items[index].valueChange){
                        data[catIndex].items[index].valueChange = false;
                        data[catIndex].items[index].isUserModifiedItemOrderQty = true;
                        data[catIndex].items[index].orderChangeStatus = "Approved";
                        data[catIndex].items[index].isSelectedByUser = false;
                        itemsArray.push(data[catIndex].items[index]);
                        this.props.dispatch(postOrderDetails({
                            Items: itemsArray,
                            storeId: storeId
                            }));
                    }

                    if(moveFocus) {
                        this.moveFocusToNextValidItemWithCat(data, catIndex, index, grDroppdown);
                    } 
                    if(grDroppdown === NON_DAILY){
                        this.setState({ grData: data, originalData: data });
                    } else if ( grDroppdown === VENDOR_STRING ){
                        this.setState({ grVendorList: data, orginalVendorList: data });
                    }
                }
            }
        }    
    }


    moveFocusToNextValidItemWithCat(data, catIndex, itemIndex, grDroppdown){
        const catLength = data.length - 1;
        const itemsLength = data[catIndex].items.length - 1;
        
        if(itemIndex + 1 <= itemsLength){
            this.refs[`${grDroppdown}-${catIndex}-${itemIndex + 1}`].focus(); 
        }else if(itemIndex + 1 > itemsLength && catIndex + 1 <= catLength ) {
            this.refs[`${grDroppdown}-${catIndex + 1}-${0}`].focus(); 
        }
    }

    parentCollapse(){
        const THIS = this;
        this.setState({ parentCollapse: !this.state.parentCollapse},()=>{
            let  { grData, grVendorList } = THIS.state;
            grData && grData.length > 0 && grData.forEach(function(category) { 
                category.isExpanded =  !THIS.state.parentCollapse 
             }); 
             grVendorList && grVendorList.length > 0 && grVendorList.forEach(function(category) { 
                category.isExpanded =  !THIS.state.parentCollapse 
             });
             THIS.setState({ grData: grData, grVendorList: grVendorList });
        })
    }

    categoryCollapse(index,grDroppdown){    
        let  { grData, grVendorList } = this.state;
        if(grDroppdown === NON_DAILY){
            if (!grData[index].hasOwnProperty("isExpanded")){
                grData[index].isExpanded = false;
            } else {
                grData[index].isExpanded = !grData[index].isExpanded;
            }
            this.setState({ grData: grData });
        }else if ( grDroppdown === VENDOR_STRING ) {
            if (!grVendorList[index].hasOwnProperty("isExpanded")){
                grVendorList[index].isExpanded = false;
            } else {
                grVendorList[index].isExpanded = !grVendorList[index].isExpanded;
            }
            this.setState({ grVendorList: grVendorList });
        }

    }

    parentSelectionUpdated(parentIndex, data, grDroppdown){
        data[parentIndex].items && data[parentIndex].items.forEach(function(item){
            if(item.orderChangeStatus !== APPROVED_STATUS){
                item.isSelectedByUser = data[parentIndex].isSelectedByUser
            }
        });
        if( grDroppdown === NON_DAILY ){
            this.setState({ grData: data, originalData: data },()=>{
                this.setContinueButton();
            });
        } else if ( grDroppdown === VENDOR_STRING ){
            this.setState({ grVendorList: data, orginalVendorList: data },()=>{
                this.setContinueButton();
            });
        }

    }

    onChangeMasterCheckbox(){
        let { 
            grData, 
            grVendorList, 
            grDroppdown, 
            masterCheckNonDaily, 
            masterCheckVendor, 
            flagArray,
            statusFlag,
            balanceOnHandFlag,
            onOrderFlag,
            quantityFlag 
        } = this.state;

        if(grDroppdown === NON_DAILY){
            this.setState({ masterCheckNonDaily: !masterCheckNonDaily });
            grData && grData.length > 0 && grData.forEach((data,index)=>{
                if (!data.hasOwnProperty("isSelectedByUser")){
                    if(grData[index].orderChangeStatus !== APPROVED_STATUS){
                        grData[index].isSelectedByUser = true;
                    }
                }else {
                    if(grData[index].orderChangeStatus !== APPROVED_STATUS){
                        grData[index].isSelectedByUser = !masterCheckNonDaily                           
                    }
                }

                if(!flagArray.includes(statusFlag) && !flagArray.includes(balanceOnHandFlag) && !flagArray.includes(onOrderFlag) && !flagArray.includes(quantityFlag)){
                    this.parentSelectionUpdated(index, grData, grDroppdown);                    
                }
            });
        }else if(grDroppdown === VENDOR_STRING){
            this.setState({ masterCheckVendor: !masterCheckVendor });
            grVendorList && grVendorList.length > 0 && grVendorList.forEach((data,index)=>{
                if (!data.hasOwnProperty("isSelectedByUser")){
                    if(grVendorList[index].orderChangeStatus !== APPROVED_STATUS){
                        grVendorList[index].isSelectedByUser = true;
                    }
                }else {
                    if(grVendorList[index].orderChangeStatus !== APPROVED_STATUS){
                        grVendorList[index].isSelectedByUser = !masterCheckVendor          
                    }
                }
                if(!flagArray.includes(statusFlag) && !flagArray.includes(balanceOnHandFlag) && !flagArray.includes(onOrderFlag) && !flagArray.includes(quantityFlag)){
                    this.parentSelectionUpdated(index, grVendorList, grDroppdown)                   
                }
            }); 
        }

    }


    onChangeParentChkBox = (index, data , grDroppdown) => {

        if (!data[index].hasOwnProperty("isSelectedByUser")){
            if(data[index].orderChangeStatus !== APPROVED_STATUS){
                data[index].isSelectedByUser = true;
                this.parentSelectionUpdated(index, data, grDroppdown)            
            }
        } else {
            if(data[index].orderChangeStatus !== APPROVED_STATUS){
                data[index].isSelectedByUser = !data[index].isSelectedByUser ;         
                this.parentSelectionUpdated(index, data, grDroppdown);           
            }
        }
    }

    onChangeChildChkBoxForItems( index, data , grDroppdown,isSelectedByUser) {
        let  { originalData, orginalVendorList } = this.state;
        if(isSelectedByUser){
            if (!data[index].hasOwnProperty("isSelectedByUser")){
                if(data[index].orderChangeStatus !== APPROVED_STATUS){
                    data[index].isSelectedByUser = true;
                }
    
            } else {
                if(data[index].orderChangeStatus !== APPROVED_STATUS){
                    data[index].isSelectedByUser = !data[index].isSelectedByUser          
                }
            }
        }
        setTimeout(() => {
            this.setContinueButton();
        }, 100)
        if( grDroppdown === NON_DAILY ){
            this.setState({ grData: data, originalData: unsortGrData(originalData, data[index]) })
        } else if ( grDroppdown === VENDOR_STRING ){
            this.setState({ grVendorList: data, orginalVendorList: unsortGrData(orginalVendorList, data[index]) })
        }
    } 

    onChangeChildChkBoxWithCat = ( index, childIndex, data, grDroppdown) => {
        if (!data[index].items[childIndex].hasOwnProperty("isSelectedByUser")){
            if(data[index].items[childIndex].orderChangeStatus !== APPROVED_STATUS){
                data[index].items[childIndex].isSelectedByUser = true;
                this.checkAllChildsSelected( index, data, grDroppdown );
            }
        } else {
            if(data[index].items[childIndex].orderChangeStatus !== APPROVED_STATUS){
                data[index].items[childIndex].isSelectedByUser = !data[index].items[childIndex].isSelectedByUser;
                this.checkAllChildsSelected( index, data, grDroppdown );
            }
        }
        setTimeout(() => {
            this.setContinueButton();
        }, 100)    
    }

    checkAllChildsSelected(parentIndex, data, grDroppdown){
        let count = 0;
        data[parentIndex].items.forEach(function(value){
            if(value && value.isSelectedByUser){
              count++;
            }
        });
        if ( data[parentIndex].items.length === count){
            data[parentIndex].isSelectedByUser = true
        } else {
            data[parentIndex].isSelectedByUser = false;
        }

        if( grDroppdown === NON_DAILY){
            this.setState({grData: data, originalData: data });
        } else if ( grDroppdown === VENDOR_STRING ){
            this.setState({grVendorList: data, orginalVendorList: data });
        }
    }

    setContinueButton(){
        const { originalData , orginalVendorList, grDroppdown } = this.state;
        let disableApproveButton = true;

        if( grDroppdown === NON_DAILY ){
            originalData && originalData.length > 0 && originalData.forEach(function (category) {
                category.items && category.items.length > 0 && category.items.forEach(function (item) {
                    if (item.isSelectedByUser === true) {
                        disableApproveButton = false;
                        return;
                    }
                });
            });
        } else if( grDroppdown === VENDOR_STRING ){
            orginalVendorList && orginalVendorList.length > 0 && orginalVendorList.forEach(function (category) {
                category.items && category.items.length > 0 && category.items.forEach(function (item) {
                    if (item.isSelectedByUser === true) {
                        disableApproveButton = false;
                        return;
                    }
                });
            });
        }

        this.setState({ disableApproveButton : disableApproveButton },()=>{
            this.props.disableApproveButtonFunction(disableApproveButton);
        })

    }

    getPromoTextAndColor(promoText) {
        let displayText = "";
        let color = "#5b616b"
        let promoStr = promoText.toUpperCase();
        if (promoStr === START_PROMOTION) {
            displayText = "P+";
            color = "#018062";
        } else if (promoStr === ON_PROMOTION) {
            displayText = "P";
            color = "#6e61a7";
        } else if (promoStr === END_PROMOTION) {
            displayText = "P-"
            color = "#ec2526";
        }

        return {
            text: displayText, color: color
        }
    }

    // LifeCycle method that is always called after render
    componentDidUpdate(prevProps, prevState) {
        if(prevState.onRender === true){
            this.setState({ onRender: false});
            if (this.refs.main){
                this.refs.main.scrollTop=0;
            }
        }
    }

    preventdefaultKeys = (e)=>{
        if( (DISALLOWED_KEYS.includes(e.key) || DISALLOWED_KEY_CODES.includes(e.keyCode)) && ( !ALLOWED_KEY_CODES.includes(e.keyCode) || !VALID_KEYS.includes(e.key) )) {
         e.preventDefault();
        }
    }

    render() {
        const { 
            grData, 
            descriptionFlag, 
            onOrderFlag, 
            statusFlag, 
            quantityFlag, 
            balanceOnHandFlag, 
            masterCheckNonDaily,
            masterCheckVendor, 
            grDroppdown, 
            grVendorList,
            grNonDailySpinner,
            grVendorSpinner,
            showModal,
            msgBoxBody,
            grPageMessageBox,
            grOnHomeMessageBox,
            showLDUModal,
            msgLDUBody, 
            LDUMin, 
            LDUMax, 
            itmMsgIndex, 
            catIndex,
            showSavedQntyModal, 
            SavedQntyBody,
            previousSelectionVal,
            defaultSelectionVal,
            flagArray,
            onSubmitContainerSpinner,
            onRender,
            readOnly 
        } = this.state;
        //console.log("test", grNonDailySpinner, grDroppdown === NON_DAILY, grData && grData.length === 0, (this.props.grStatus === "COMPLETE" || this.props.grStatus === "NETWORK_ERROR"))
        const THIS = this;
        return (
          <div className = "gr-padding-div">
              { grDroppdown === NON_DAILY && grNonDailySpinner && 
                    <div className = "ordering-home-spinner" >
                        <SpinnerComponent displaySpinner = { grNonDailySpinner } />
                    </div>
                }
                { grDroppdown === VENDOR_STRING && grVendorSpinner && 
                    <div className = "ordering-home-spinner" >
                        <SpinnerComponent displaySpinner = { grVendorSpinner } />
                    </div>
                }
                <table className = "gr-table-header">
                <thead className = "d-none d-md-block">
                    <tr className = "row text-left header-row">
                    <th className = "col-3 col-sm-3 col-md-5 gr-header-text cusCatItemDesc" scope="col">
                        <label id = {`gr-recap-cat`}  className="group-sort-postion gr-group-checkbox cusGrCat" style = {{ fontWeight: flagArray.includes(descriptionFlag) ? "bold":"normal"}}>
                            <input disabled = { readOnly } type="checkbox" onClick = {()=> THIS.onChangeMasterCheckbox()} checked = { grDroppdown === NON_DAILY ?  masterCheckNonDaily : masterCheckVendor }  name= {`single-day-cat-`} value={`s-`} onChange = {()=> THIS.render()} />
                            <span className="gr-group-checkmark cusGrCheckGrp gr-header-checkbox"></span>
                            <span className = "bold">{ !flagArray.includes(statusFlag) && !flagArray.includes(balanceOnHandFlag) && !flagArray.includes(onOrderFlag) && !flagArray.includes(quantityFlag) ? "Category, ":"" }</span>{ "Item Description" }
 
                        </label>
                        <span  className = "gr-sort sort-position cusSortButton" >
                            { descriptionFlag === 0 &&
                                <i name = "descriptionFlag" className="fa fa-sort" onClick={((e) => this.sort("descriptionFlag"))}></i>
                            }
                            { descriptionFlag === 1 &&
                                <i name = "descriptionFlag" className="fa fa-sort-up" onClick={((e) => this.sort("descriptionFlag"))}></i> 
                            }
                            { descriptionFlag === 2 &&
                                <i name = "descriptionFlag" className="fa fa-sort-down" onClick={((e) => this.sort("descriptionFlag"))}></i> 
                            }
                        </span>

                    </th>
                    <th className = "left-border-mob col-2 col-sm-2 col-md-2  gr-header-text cusStatusHeader" style = {{ fontWeight: flagArray.includes(statusFlag) ? "bold":"normal"}}>
                        Status
                        <span className = "gr-sort">
                            { statusFlag === 0 &&
                                <i name = "statusFlag" className="fa fa-sort" onClick={((e) => this.sort("statusFlag"))}></i>
                            }
                            { statusFlag === 1 &&
                                <i name = "statusFlag" className="fa fa-sort-up" onClick={((e) => this.sort("statusFlag"))}></i> 
                            }
                            { statusFlag === 2 &&
                                <i name = "statusFlag" className="fa fa-sort-down" onClick={((e) => this.sort("statusFlag"))}></i> 
                            }
                        </span>
                    </th>
                    <th className = "left-border-mob  col-2 col-sm-2 col-md-1  gr-header-text cusBohHeader" style = {{ fontWeight: flagArray.includes(balanceOnHandFlag) ? "bold":"normal"}}>
                        BoH
                        <span className = "gr-sort">
                            { balanceOnHandFlag === 0 &&
                                <i name = "balanceOnHandFlag" className="fa fa-sort" onClick={((e) => this.sort("balanceOnHandFlag"))}></i>
                            }
                            { balanceOnHandFlag === 1 &&
                                <i name = "balanceOnHandFlag" className="fa fa-sort-up" onClick={((e) => this.sort("balanceOnHandFlag"))}></i> 
                            }
                            { balanceOnHandFlag === 2 &&
                                <i name = "balanceOnHandFlag" className="fa fa-sort-down" onClick={((e) => this.sort("balanceOnHandFlag"))}></i> 
                            }
                        </span>
                    </th>
                    <th className = "left-border-mob col-2 col-sm-2 col-md-1 gr-header-text  side-padding cusOnOrder" style = {{ fontWeight: flagArray.includes(onOrderFlag) ? "bold":"normal"}}>
                        OnO
                        <span className = "gr-sort">
                            { onOrderFlag === 0 &&
                                <i name = "onOrderFlag" className="fa fa-sort" onClick={((e) => this.sort("onOrderFlag"))}></i>
                            }
                            { onOrderFlag === 1 &&
                                <i name = "onOrderFlag" className="fa fa-sort-up" onClick={((e) => this.sort("onOrderFlag"))}></i> 
                            }
                            { onOrderFlag === 2 &&
                                <i name = "onOrderFlag" className="fa fa-sort-down" onClick={((e) => this.sort("onOrderFlag"))}></i> 
                            }
                        </span>
                    </th>
                    <th className = "left-border-mob right-border-mob col-2 col-sm-2 col-md-2 gr-header-text side-padding cusOrdQty" style = {{ fontWeight: flagArray.includes(quantityFlag) ? "bold":"normal"}}>
                        Ord Qty
                        <span className = "gr-sort cusGrSortHeader">
                            { quantityFlag === 0 &&
                                <i name = "quantityFlag" className="fa fa-sort" onClick={((e) => this.sort("quantityFlag"))}></i>
                            }
                            { quantityFlag === 1 &&
                                <i name = "quantityFlag" className="fa fa-sort-up" onClick={((e) => this.sort("quantityFlag"))}></i> 
                            }
                            { quantityFlag === 2 &&
                                <i name = "quantityFlag" className="fa fa-sort-down" onClick={((e) => this.sort("quantityFlag"))}></i> 
                            }
                        </span>
                    </th>
                    <th className = "col-1 col-sm-1 col-md-1 gr-header-text"> <i onClick = {()=> this.parentCollapse()} className={this.state.parentCollapse === false ? 'fa fa-angle-up gr-cat-arrow': 'fa fa-angle-down gr-cat-arrow'}></i></th>
                    </tr>
                </thead>

                <thead className = "d-sm-none">
                    <tr className = "row text-left header-row">
                    <th className = "col-1 col-sm-1 gr-header-text">
                        <label id = {`gr-recap-cat`} className="group-sort-postion gr-group-checkbox ">
                            <input disabled = { readOnly } type="checkbox" onClick = {()=> THIS.onChangeMasterCheckbox()} checked = { grDroppdown === NON_DAILY ?  masterCheckNonDaily : masterCheckVendor }  name= {`single-day-cat-`} value={`s-`} onChange = {()=> THIS.render()} />
                            <span className="gr-group-checkmark"></span> 
                        </label>
                    </th>
                    <th className = "col-4 col-sm-4 gr-header-text side-padding">
                        Item Description
                     </th>
                    <th className = "left-border-mob col-2 col-sm-2 gr-header-text side-padding">
                        Stat
                        <img className="status-mob d-md-none" data-tip data-for="status" alt = "status-info" src={ info }/>
                        <ReactTooltip place="left" id='status' type='light' effect="solid">
                            <div className="gr-tooltip">
                               <div style = {{ marginTop: "2%"}}><span  style={{ fontWeight: "bold"}}>A</span><span> - Approved</span></div>
                                <div style = {{ marginTop: "2%"}}><span  style={{ fontWeight: "bold"}}>PA</span><span> - Pending Approved</span></div>
                                <div style = {{ marginTop: "2%"}}><span  style={{ fontWeight: "bold"}}>PT</span><span> - Pending Transmission</span></div>

                            </div>
                        </ReactTooltip>    
                    </th>
                    <th className = "left-border-mob  col-2  col-sm-2 gr-header-text">
                        BoH
                    </th>
                    <th className = "left-border-mob col-1 col-sm-1 gr-header-text side-padding">
                        OnO
                    </th>
                    <th className = "left-border-mob bold col-2 col-sm-2 gr-header-text side-padding">
                        QTY
                        <img className="status-mob d-md-none" data-tip data-for="quantity" alt = "status-info" src={ info }/>
                        <ReactTooltip place="left" id='quantity' type='light' effect="solid">
                            <div className="gr-quantity-tooltip">
                                <div style = {{ marginTop: "2%", color: "#287cba"}}><span>System Edited #</span></div>
                                <div style = {{ marginTop: "2%", color: "#ec2526"}}><span>User Edited #</span></div>
                            </div>
                        </ReactTooltip>  
                    </th>
                    </tr>
                </thead>
            </table>
            <div className = "gr-category-table" ref="main" >

                {/**Adding watermark for gr-recap data */}

                {!grNonDailySpinner && (grDroppdown === NON_DAILY) && (grData && grData.length === 0 ) && (this.props.grStatus === "COMPLETE" || this.props.grStatus === "NETWORK_ERROR") &&
                        <span className="gr-no-data-indicator no-data-indicator">Currently system is generating Order data for the new window. Please wait for few minutes and try again.</span>
                }

                {!grVendorSpinner && (grDroppdown === VENDOR_STRING) && (grVendorList && grVendorList.length === 0 ) && (this.props.grStatus === "COMPLETE" || this.props.grStatus === "NETWORK_ERROR") &&
                        <span className="gr-no-data-indicator no-data-indicator">Currently system is generating Order data for the new window. Please wait for few minutes and try again.</span>
                }

                { !flagArray.includes(statusFlag) && !flagArray.includes(balanceOnHandFlag) && !flagArray.includes(onOrderFlag) && !flagArray.includes(quantityFlag) && grDroppdown === NON_DAILY && grData && grData.length > 0 && grData.map((category, catIndex)=> {
                    return(
                        <table key = {catIndex}>
                            <tbody className='container'>
                            <tr className = "row gr-cat-row header-row gr-gr-category-table">
                                    <td className = "col-8 col-sm-8 col-md-9 gr-cat-text text-left nonDaily-stripe">
                                        <label id = {`gr-recap-cat-${catIndex}`} className="gr-group-checkbox"> {category.name}
                                            <input disabled = { readOnly } type="checkbox" onClick = {()=> THIS.onChangeParentChkBox(catIndex, grData , grDroppdown)} checked = { category.isSelectedByUser ? category.isSelectedByUser : false }  name= {`single-day-cat-${catIndex}`} value={`s-${catIndex}`} onChange = {()=> THIS.render()} />
                                            <span className="gr-group-checkmark"></span>
                                        </label>
                                    </td>
                                    <td className = "col-2 col-sm-2 col-md-2 cat-header-text side-padding">
                                    </td>
                                    <td className = "col-2 col-sm-2 col-md-1 cat-header-text"> <i id={`${NON_DAILY}-${catIndex}`} onClick = {()=> {this.alignItem(`${NON_DAILY}-${catIndex}`); this.categoryCollapse(catIndex,NON_DAILY)}} className={ category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down gr-cat-arrow2': 'fa fa-angle-up gr-cat-arrow2'}></i></td>
                                </tr>
                            </tbody>
                            { ( category.hasOwnProperty("isExpanded") ? category.isExpanded : true ) && category && category.items && category.items.length > 0 && category.items.map((item,itemIndex)=>{
                                if(!item){
                                    return null;
                                }
                                return(
                                    <tbody key = { itemIndex }>
                                        <tr className = "row gr-cat-row header-row">
                                        <td className = "col-5 col-sm-5 col-md-5 gr-item-text text-left">
                                            <label id = {`gr-recap-cat-${catIndex}-item-${itemIndex}`} className="gr-category-checkbox"> {item.itemName}
                                                { item.itemPromotionStatus ?
                                                    <span className="promo gr-promo-padding" style={{ color: this.getPromoTextAndColor(item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(item.itemPromotionStatus).text}</span> : ''
                                                }
                                                <input disabled = { item.orderChangeStatus === APPROVED_STATUS || readOnly ? true: false } type="checkbox" onClick = {()=> THIS.onChangeChildChkBoxWithCat( catIndex, itemIndex, grData, NON_DAILY )} checked = { item.isSelectedByUser ? item.isSelectedByUser : false }  name= {`gr-recap-cat-${catIndex}-item-${itemIndex}`} onChange = {()=> THIS.render()} />
                                                <span  className="gr-category-checkmark"></span>
                                            </label> 
                                        </td>
                                        <td className = "d-none d-md-block col-md-2 gr-item-text side-padding">{ item.orderChangeStatus }</td>
                                        <td className = "d-sm-none col-2 col-sm-2 gr-item-text">{item.orderChangeStatus === "-"? item.orderChangeStatus : item.orderChangeStatus && item.orderChangeStatus.match(/\b(\w)/g).join("")}</td>    
                                        <td className = "col-md-1 col-2 col-sm-2 gr-item-text">{ parseInt(item.totalBalanceOnHandQty) >=0 ? item.totalBalanceOnHandQty : 0 }</td>
                                        <td className = " col-1 col-sm-1 col-md-1 gr-item-text  side-padding cusOnOrderTble">{item.onOrder}</td>
                                        <td className = "col-2 col-sm-2 col-md-2 gr-item-text side-padding no-top-bottom-padding cusQnty">
                                            <input 
                                                autoComplete="off" 
                                                className= "gr-quantity"
                                                disabled = { readOnly } 
                                                style = {{ color: item.isUserModifiedItemOrderQty ? "#ec2526" : item.isRecalculated ? "#287cba" : "#4a4a4a" }} 
                                                name = "untransmittedOrderQty" 
                                                value = {item.untransmittedOrderQty + ""} 
                                                type="number"
                                                maxLength="4"
                                                onCopy={(e) => {e.preventDefault();}} 
                                                onPaste={(e) => {e.preventDefault();}}
                                                ref={`${NON_DAILY}-${catIndex}-${itemIndex}`}
                                                onKeyDown={(e) => { this.preventdefaultKeys(e) }}
                                                id={`${NON_DAILY}-${catIndex}-${itemIndex}`}
                                                onChange = {(e)=>this.handleOrderQuantityForItemsWithCat(e, catIndex, itemIndex,NON_DAILY)} 
                                                onKeyPress = {(e)=> { if(e.key === "Enter"){ this.validateOrderQuantityForItemsWithCat(catIndex,itemIndex,grData,NON_DAILY,true,true)}}}
                                                onBlur = {()=> { if( item.valueChange ){this.validateOrderQuantityForItemsWithCat(catIndex,itemIndex, grData,NON_DAILY,true,false)}}}
                                                onFocus = {(e)=>{ this.alignItem(`${NON_DAILY}-${catIndex}-${itemIndex}`); this.handleFocus(e);}}
                                                ></input>
                                        </td>
                                        </tr>
                                    </tbody>
                                );
                            })}
                        </table>
                    );
                })}

                { (flagArray.includes(statusFlag)  || flagArray.includes(balanceOnHandFlag) || flagArray.includes(onOrderFlag) || flagArray.includes(quantityFlag)) && grDroppdown === NON_DAILY && grData && grData.length > 0 && grData.map((item, itemIndex)=> {
                    return(
                        <table key = {itemIndex}>
                            <tbody key = { itemIndex }>
                                <tr className = "row gr-cat-row header-row">
                                    <td className = "col-5 col-sm-5 col-md-5 gr-item-text text-left">
                                        <label  id = {`gr-recap--item-${itemIndex}`} className="gr-category-checkbox"> {item.itemName}
                                            { item.itemPromotionStatus ?
                                                <span className="promo gr-promo-padding" style={{ color: this.getPromoTextAndColor(item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(item.itemPromotionStatus).text}</span> : ''
                                            }
                                            <input disabled = { item.orderChangeStatus === APPROVED_STATUS || readOnly ? true: false } type="checkbox" onClick = {()=> THIS.onChangeChildChkBoxForItems(itemIndex, grData, NON_DAILY, true)} checked = { item.isSelectedByUser ? item.isSelectedByUser : false }  name= {`gr-recap--item-${itemIndex}`} onChange = {()=> THIS.render()} />
                                            <span className="gr-category-checkmark"></span>
                                        </label> 
                                    </td>
                                    <td className = "d-none d-md-block col-md-2 gr-item-text side-padding">{ item.orderChangeStatus }</td>
                                    <td className = "d-sm-none col-2 col-sm-2 gr-item-text">{item.orderChangeStatus === "-"? item.orderChangeStatus : item.orderChangeStatus && item.orderChangeStatus.match(/\b(\w)/g).join("")}</td>    
                                    <td className = "col-md-1 col-2 col-sm-2 gr-item-text">{parseInt(item.totalBalanceOnHandQty) >=0 ? item.totalBalanceOnHandQty : 0 }</td>
                                    <td className = " col-1 col-sm-1 col-md-1 gr-item-text  side-padding cusOnOrderTble">{item.onOrder}</td>
                                    <td className = "col-2 col-sm-2 col-md-2 gr-item-text side-padding no-top-bottom-padding cusQnty">
                                        <input 
                                            autoComplete="off" 
                                            className= "gr-quantity"
                                            disabled = { readOnly }  
                                            style = {{ color: item.isUserModifiedItemOrderQty ? "#ec2526" : item.isRecalculated ? "#287cba" : "#4a4a4a" }} 
                                            name = "untransmittedOrderQty" 
                                            value = { item.untransmittedOrderQty + ""} 
                                            type="number" 
                                            maxLength="4"
                                            onCopy={(e) => {e.preventDefault();}} 
                                            onPaste={(e) => {e.preventDefault();}}
                                            onKeyDown={(e) => { this.preventdefaultKeys(e)}} 
                                            ref={`${NON_DAILY}-${itemIndex}`}
                                            id={`${NON_DAILY}-${itemIndex}`}   
                                            onChange = {(e)=>this.handleOrderQuantityForItems(e, itemIndex,NON_DAILY)}
                                            onKeyPress = {(e)=> { if(e.key === "Enter"){ this.validateOrderQuantityForItems( itemIndex, grData ,NON_DAILY,true, true)}}}
                                            onBlur = {()=> { if( item.valueChange ){this.validateOrderQuantityForItems(itemIndex, grData, NON_DAILY,true, false)}}}
                                            onFocus = {(e)=>{ this.alignItem(`${NON_DAILY}-${itemIndex}`); this.handleFocus(e);}}
                                        ></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    );
                })}

                { !flagArray.includes(statusFlag) && !flagArray.includes(balanceOnHandFlag) && !flagArray.includes(onOrderFlag) && !flagArray.includes(quantityFlag) && grDroppdown === VENDOR_STRING &&  grVendorList  && grVendorList.length > 0 && grVendorList.map( (category,catIndex)=> {
                    return(
                        <table key = {catIndex}>
                            <tbody className='container'>
                            <tr className = "row gr-cat-row header-row gr-gr-category-table">
                                    <td className = "col-8 col-sm-8 col-md-9 gr-cat-text text-left nonDaily-stripe">
                                        <label id = {`gr-recap-cat-${catIndex}`} className="gr-group-checkbox"> {category.name}
                                            <input disabled = { readOnly } type="checkbox" onClick = {()=> THIS.onChangeParentChkBox(catIndex, grVendorList, grDroppdown)} checked = { category.isSelectedByUser ? category.isSelectedByUser : false }  name= {`single-day-cat-${catIndex}`} value={`s-${catIndex}`} onChange = {()=> THIS.render()} />
                                            <span className="gr-group-checkmark"></span>
                                        </label>
                                    </td>
                                    <td className = "col-2 col-sm-2 col-md-2 cat-header-text side-padding">
                                    </td>
                                    <td className = "col-2 col-sm-2 col-md-1 cat-header-text"> <i onClick = {()=> this.categoryCollapse(catIndex,VENDOR_STRING)} className={ category.hasOwnProperty("isExpanded") && category.isExpanded === false ? 'fa fa-angle-down gr-cat-arrow2': 'fa fa-angle-up gr-cat-arrow2'}></i></td>
                                </tr>
                            </tbody>
                            {  ( category.hasOwnProperty("isExpanded") ? category.isExpanded : true ) && category && category.items && category.items.length > 0 && category.items.map((item,itemIndex)=>{
                                return(
                                    <tbody key = { itemIndex }>
                                        <tr className = "row gr-cat-row header-row">
                                        <td className = "col-5 col-sm-5 col-md-5 gr-item-text text-left">
                                            <label  id = {`gr-recap-cat-${catIndex}-item-${itemIndex}`} className="gr-category-checkbox"> {item.itemName}
                                                { item.itemPromotionStatus ?
                                                    <span className="promo gr-promo-padding" style={{ color: this.getPromoTextAndColor(item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(item.itemPromotionStatus).text}</span> : ''
                                                }
                                                <input disabled = { item.orderChangeStatus === APPROVED_STATUS || readOnly ? true: false } type="checkbox" onClick = {()=> THIS.onChangeChildChkBoxWithCat( catIndex, itemIndex, grVendorList, VENDOR_STRING)} checked = { item.isSelectedByUser ? item.isSelectedByUser : false }  name= {`gr-recap-cat-${catIndex}-item-${itemIndex}`} onChange = {()=> THIS.render()} />
                                                <span className="gr-category-checkmark"></span>
                                            </label> 
                                        </td>
                                        <td className = "d-none d-md-block col-md-2 gr-item-text side-padding">{ item.orderChangeStatus }</td>
                                        <td className = "d-sm-none col-2 col-sm-2 gr-item-text">{item.orderChangeStatus === "-"? item.orderChangeStatus : item.orderChangeStatus && item.orderChangeStatus.match(/\b(\w)/g).join("")}</td>    
                                        <td className = "col-md-1 col-2 col-sm-2 gr-item-text">{parseInt(item.totalBalanceOnHandQty) >=0 ? item.totalBalanceOnHandQty : 0 }</td>
                                        <td className = " col-1 col-sm-1 col-md-1 gr-item-text  side-padding cusOnOrderTble">{item.onOrder}</td>
                                        <td className = "col-2 col-sm-2 col-md-2 gr-item-text side-padding no-top-bottom-padding cusQnty">
                                            <input 
                                                autoComplete="off" 
                                                className= "gr-quantity" 
                                                disabled = { readOnly } 
                                                style = {{ color: item.isUserModifiedItemOrderQty ? "#ec2526" : item.isRecalculated ? "#287cba" : "#4a4a4a" }} 
                                                name = "untransmittedOrderQty" 
                                                value = { item.untransmittedOrderQty + "" } 
                                                type="number"
                                                onCopy={(e) => {e.preventDefault();}} 
                                                onPaste={(e) => {e.preventDefault();}}
                                                onKeyDown={(e) => { this.preventdefaultKeys(e) }} 
                                                maxLength="4" 
                                                ref={`${VENDOR_STRING}-${catIndex}-${itemIndex}`}
                                                id={`${VENDOR_STRING}-${catIndex}-${itemIndex}`}      
                                                onChange = {(e)=>this.handleOrderQuantityForItemsWithCat(e, catIndex, itemIndex , VENDOR_STRING)}
                                                onKeyPress = {(e)=> { if(e.key === "Enter"){ this.validateOrderQuantityForItemsWithCat(catIndex,itemIndex,grVendorList,VENDOR_STRING,true,true)}}}
                                                onBlur = {()=> { if( item.valueChange ){ this.validateOrderQuantityForItemsWithCat(catIndex,itemIndex, grVendorList,VENDOR_STRING,true,false)}}} 
                                                onFocus = {(e)=>{ this.alignItem(`${VENDOR_STRING}-${catIndex}-${itemIndex}`); this.handleFocus(e);}}
                                                ></input>
                                        </td>
                                        </tr>
                                    </tbody>
                                );
                            })}
                        </table>
                    );
                })}

                { (flagArray.includes(statusFlag)  || flagArray.includes(balanceOnHandFlag) || flagArray.includes(onOrderFlag) || flagArray.includes(quantityFlag)) && grDroppdown === VENDOR_STRING && grVendorList && grVendorList.length > 0 && grVendorList.map((item, itemIndex)=> {
                    return(
                        <table key = {itemIndex}>
                            <tbody key = { itemIndex }>
                                <tr className = "row gr-cat-row header-row">
                                    <td className = "col-5 col-sm-5 col-md-5 gr-item-text text-left">
                                        <label  id = {`gr-recap--item-${itemIndex}`} className="gr-category-checkbox"> {item.itemName}
                                            { item.itemPromotionStatus ?
                                                <span className="promo gr-promo-padding" style={{ color: this.getPromoTextAndColor(item.itemPromotionStatus).color }}>{this.getPromoTextAndColor(item.itemPromotionStatus).text}</span> : ''
                                            }
                                            <input disabled = { item.orderChangeStatus === APPROVED_STATUS || readOnly ? true: false }  type="checkbox" onClick = {()=> THIS.onChangeChildChkBoxForItems(itemIndex, grVendorList, VENDOR_STRING, true)} checked = { item.isSelectedByUser ? item.isSelectedByUser : false }  name= {`gr-recap--item-${itemIndex}`} onChange = {()=> THIS.render()} />
                                            <span className="gr-category-checkmark"></span>
                                        </label> 
                                    </td>
                                    <td className = "d-none d-md-block col-md-2 gr-item-text side-padding">{ item.orderChangeStatus }</td>
                                    <td className = "d-sm-none col-2 col-sm-2 gr-item-text">{item.orderChangeStatus === "-"? item.orderChangeStatus : item.orderChangeStatus && item.orderChangeStatus.match(/\b(\w)/g).join("")}</td>    
                                    <td className = "col-md-1 col-2 col-sm-2 gr-item-text">{parseInt(item.totalBalanceOnHandQty) >=0 ? item.totalBalanceOnHandQty : 0 }</td>
                                    <td className = " col-1 col-sm-1 col-md-1 gr-item-text  side-padding cusOnOrderTble">{item.onOrder}</td>
                                    <td className = "col-2 col-sm-2 col-md-2 gr-item-text side-padding no-top-bottom-padding cusQnty">
                                        <input 
                                            autoComplete="off" 
                                            className= "gr-quantity"
                                            disabled = { readOnly }  
                                            style = {{ color: item.isUserModifiedItemOrderQty ? "#ec2526" : item.isRecalculated ? "#287cba" : "#4a4a4a" }} 
                                            name = "untransmittedOrderQty" 
                                            value = { item.untransmittedOrderQty + ""} 
                                            type="number" 
                                            maxLength="4"
                                            onCopy={(e) => {e.preventDefault();}} 
                                            onPaste={(e) => {e.preventDefault();}}
                                            onKeyDown={(e) => { this.preventdefaultKeys(e) }}
                                            ref={`${VENDOR_STRING}-${itemIndex}`}
                                            id={`${VENDOR_STRING}-${itemIndex}`}        
                                            onChange = {(e)=>this.handleOrderQuantityForItems(e, itemIndex,VENDOR_STRING)}
                                            onKeyPress = {(e)=> { if(e.key === "Enter"){ this.validateOrderQuantityForItems( itemIndex, grVendorList ,VENDOR_STRING,true,true)}}}
                                            onBlur = {()=> { if( item.valueChange ) {this.validateOrderQuantityForItems(itemIndex, grVendorList, VENDOR_STRING,true,false)}}}
                                            onFocus = {(e)=>{ this.alignItem(`${VENDOR_STRING}-${itemIndex}`); this.handleFocus(e);}}
                                            >
                                        </input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    );
                })}
            </div>
            {showModal && 
                <MessageBox 
                    msgTitle="" 
                    msgBody={msgBoxBody}
                    className={"message-box"} 
                    initialModalState={false}
                    orderMinMax={true}
                    index={itmMsgIndex}
                    cIndex={catIndex}
                    modalAction = {this.MinMaxModalAction}
                />
            }

            { grPageMessageBox && 
                <MessageBox 
                    msgTitle="Approval Needed" 
                    msgBody={msgBoxBody}
                    className={"message-box"} 
                    initialModalState={false}
                    orderMinMax={false}
                    grPage = {true} 
                    modalAction = {this.modalAction}
                    history = {this.props.history} 
                />
            }

            { grOnHomeMessageBox && 
                <MessageBox 
                    msgTitle="Approval Needed" 
                    msgBody={msgBoxBody}
                    className={"message-box"} 
                    initialModalState={false}
                    orderMinMax={false}
                    grPageOnHome = {true} 
                    modalAction = {this.modalActionOnHome}
                    history = {this.props.history} 
                />
            }

            {showLDUModal && 
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
                    cIndex={catIndex}
                    modalAction = {this.LduModalAction}
                    lduMinOrderQntyChk={this.lduMinOrderQntyChk}
                    lduMaxOrderQntyChk={this.lduMaxOrderQntyChk}/>}

            { showSavedQntyModal && 
                <MessageBox 
                    msgTitle="" 
                    msgBody={SavedQntyBody}
                    className={"message-box-ldu"} 
                    initialModalState={false}
                    orderMinMax={false}
                    LDUBox={false}
                    savedQntyModal={true}
                    previousSelectionVal={previousSelectionVal}
                    defaultSelectionVal={defaultSelectionVal}
                    index={itmMsgIndex}
                    cIndex={catIndex}
                    modalAction = {this.savedQntyModalAction}
                    previousSelectionChk={this.previousSelectionChk}
                    defaultSelectionChk={this.defaultSelectionChk}/>
            }
            { /*Item Details Spinner Component*/}
                {onSubmitContainerSpinner &&
                    <div className="item-detail-spinner-component">
                        <div className="item-detail-spinner">
                            <SpinnerComponent displaySpinner={onSubmitContainerSpinner} />
                        </div>
                    </div>
                }

                  {onRender &&
                    <div className="item-detail-spinner-component">
                        <div className="item-detail-spinner">
                            <SpinnerComponent displaySpinner={onRender} />
                        </div>
                    </div>
                }
        </div>  
        );
    }
  }
const mapStateToProps = state => 
  {
    return ({
      grData: state.ordering.getGrRecapData.GR_RECAP && state.ordering.getGrRecapData.GR_RECAP.results ? state.ordering.getGrRecapData.GR_RECAP.results : [],
      grVendorList: state.ordering.getGrRecapData.GR_VENDOR_LIST && state.ordering.getGrRecapData.GR_VENDOR_LIST.results ? state.ordering.getGrRecapData.GR_VENDOR_LIST.results : {CDC: [], DSD: []},
      grStatus: state.ordering && state.ordering.getGRStatus && state.ordering.getGRStatus.payload
    });
}

export default connect(
    mapStateToProps
  )(withRouter(GrTable))