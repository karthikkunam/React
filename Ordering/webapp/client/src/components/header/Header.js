import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Collapse,
  Navbar,
  Nav,
  NavItem
} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { LoginReducer } from '../../actions'
import './Header.css';
import { singleDay, multiDay, nonDaily } from '../../constants/ActionTypes';
// import * as constants from '../../constants/ActionTypes';
import headerLogo from '../../assets/images/header-logo.png';
import path from '../../assets/images/path.png';
import { UNSAVED_MSG_TITLE, UNSAVED_MSG_BODY } from '../utility/constants';
import shape_2 from '../../assets/images/shape_2.png';
import MessageBox from '../shared/MessageBox';
// import { orderingSelectedLink } from '../../actions';
import {PDFDocument} from './../../lib/printPdf/index';
import { storeDetails } from '../../lib/storeDetails'


export class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this)
    this.state = {
      isOpen: false,
      loginData: '',
      storeId: storeDetails() && storeDetails().storeId,
      selectedLink:'Ordering',
      orderRemainingItems: false,
      ItemDetailData: this.props.ItemDetailData,
      totalItemCount: '',
      msgTitle: '',
      msgBody: '',
      msgBoxBody: '',
      showModal: false, 
      toggleSideNavActions: false    
    };
  };

  componentDidMount(){
    this.setState ({
      loginData: this.props.loginData,
      selectedLink: this.props.selectedLink,
      orderRemainingItems: this.props.orderRemainingItems,
      checkCategories: this.props.checkCategories,
      OrderingCycleType: this.props.OrderingCycleType,
      ItemDetailData: this.props.ItemDetailData

     })
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  logout(){
    console.log("clicked on logout");
    this.props.dispatch(LoginReducer(false));

  }
  onClickPrevious = () => {
    // const { selectedLink, ItemDetailData, orderRemainingItems, checkCategories, OrderingCycleType } = this.state;
    const { selectedLink } = this.state;


    if( selectedLink === "GR" ){
      this.props.history.push( `/landing`);
    }

    if (this.state.selectedLink === 'ItemDetail') {
      this.setState({ 
        showModal: true,
        ...this.getBodyTitle()
      });    
    } else if (this.state.selectedLink === 'Review') {
      // if(ItemDetailData[constants[OrderingCycleType]].itemAggregates ===0 && orderRemainingItems){
      //     switch (OrderingCycleType){
      //         case singleDay:
      //             this.props.history.push('/landing');
      //             break;
      //         case multiDay:
      //             if(checkCategories[0]){
      //                 this.props.dispatch(currentOrderCycle({
      //                     orderCycleType: singleDay
      //                     }));
      //                     this.props.history.push('singleDay/reviewfinalize');
      //             }else {
      //                 this.props.history.push('/landing');
      //             }
      //             break;
  
      //         case nonDaily: 
      //         if(checkCategories[1]){
      //             this.props.dispatch(currentOrderCycle({
      //                 orderCycleType: multiDay
      //               }));
      //               this.props.history.push('multiDay/reviewfinalize');
      //         } else if(checkCategories[0]){
      //             this.props.dispatch(currentOrderCycle({
      //                 orderCycleType: singleDay
      //               }));
      //               this.props.history.push('singleDay/reviewfinalize');
      //         }else {
      //             this.props.history.push('/landing');
      //             }            
      //         break;
  
      //         default:
      //             this.props.history.push('/landing');
      //             break;
      //     } 
       
      // else {
           this.props.history.push('/placeorder');
      // }
    
    }
  }

  modalAction = (showModal) => {
    this.setState({showModal: showModal},()=>{
       setTimeout(() => {
            let defaultButton = document.getElementById("btn-stay-on-ordering");
            if (defaultButton) {
                defaultButton.focus();
            }
        }, 100);
    })
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
  getBodyTitle() {
    let userSelectedItems = [];
    let emptyList = [];
    const { currentOrderCycleType, itemsByOrderCycle } = this.props;
    if (currentOrderCycleType === singleDay) {
      itemsByOrderCycle[singleDay].forEach(function (data) {
        if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
          emptyList.push(data);
        } else {
            if(!data.isStoreOrderBlocked){
                userSelectedItems.push(data);
            }
        }
      });
    } else if (currentOrderCycleType === multiDay) {
      itemsByOrderCycle[multiDay].forEach(function (data) {
        if ((data.untransmittedOrderQty === undefined || data.untransmittedOrderQty === null || data.untransmittedOrderQty === "") && !data.isStoreOrderBlocked) {
          emptyList.push(data);
        } else {
            if(!data.isStoreOrderBlocked){
                userSelectedItems.push(data);
            }
        }
      });
    } else if (currentOrderCycleType === nonDaily) {
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

  printScreen(){
    PDFDocument.printScreen();
  }

  toggle() {
    this.props.parentCallback(!this.state.isOpen);
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { loginData, selectedLink, showModal, msgTitle, msgBody, toggleSideNavActions } = this.state;

    return (
      <div className = "header">
        <Navbar id = "ml-auto2" className = "col-sm-12" expand="md">
        <Navbar id = "ml-auto2" className = "col-sm-1 col-2 col-md-8" light  expand="md">
          <span className = "logo-container">
            <span className= "image-container">
              <img id="header-logo" src= {headerLogo}   alt = "headerLogo"/>
            </span>
              <span className = "Eleven---Back-Offi"><b>7BOSS (Back Office Store System)</b></span>
            </span>
        </Navbar>
        <Navbar className = 'd-md-none d-lg-none col-sm-11 col-10'>
          <span >
            <span className= "image-container">
              { selectedLink === 'ItemDetail' &&
                <i className = "fa fa-angle-left cat-arrow3" onClick={()=>this.onClickPrevious()}></i>
              }
              { selectedLink === 'Review' &&
                <i className = "fa fa-angle-left cat-arrow3" onClick={()=>this.onClickPrevious()}></i>
              }
              { selectedLink === 'GR' &&
                <i className = "fa fa-angle-left cat-arrow3" onClick={()=>this.onClickPrevious()}></i>
              }
            </span>
              { loginData && loginData.token && storeDetails() && storeDetails().storeId ? <span className = "Store-Details"><b>Ordering &#8209; Store { storeDetails().storeId }</b></span> : ''}
            </span>
          </Navbar>
        { !loginData ?
          <Navbar id = "ml-auto" className = 'employee-name d-md-block col-6 col-md-4'  expand="md">
                <div style = {{align: "right"}}>
                  {/* <img id="Shape3" src= {shape_3}   alt = "shape_3"/> 
                  <span className = "Employee-Name" >Employee Name</span> */}
                </div>
          </Navbar>
        :
          <Navbar id = "ml-auto" className = 'employee-name d-none d-md-block col-md-4'  expand="md">
                <div style = {{align: "right"}}>
                <Collapse style = {{align: "right"}} isOpen={false} navbar>
              { this.state && !this.state.loginData ?
                <Nav className="ml-auto"  navbar>
                  <NavItem>
                  <img id="Path" src= {path}   alt = "Path"/>
                  </NavItem>
                  {/* <NavItem>
                  <img id="Shape" src= {shape}   alt = "shape"/>
                  </NavItem> */}
                  <NavItem onClick={()=> this.printScreen()}>
                  <img id="Shape2" src= {shape_2}   alt = "shape_2"/>
                  </NavItem>
                  {/* <NavItem>
                  <img id="Shape-Copy-66" src= {Shape_Copy_66}   alt = "Shape-Copy-66"/>
                  </NavItem> */}
                </Nav>
              :
                <Nav className="ml-auto"  navbar>
                  {/* <NavItem>
                  <img id="Path" src= {path_login}   alt = "Path"/>
                  </NavItem> */}
                  {/* <NavItem>
                  <img id="Shape" src= {shape}   alt = "shape"/>
                  </NavItem> */}
                  <NavItem onClick={()=> this.printScreen()}>
                  <img id="Shape2" src= {shape_2}   alt = "shape_2"/>
                  </NavItem>
                  {/* <NavItem>
                  <img id="Shape-Copy-66" src= {Shape_Copy_66_login}   alt = "Shape-Copy-66"/>
                  </NavItem> */}
                </Nav>
              }
            </Collapse>
                  {loginData && loginData.token && storeDetails() && storeDetails().fullName ?
                <span className = "Employee-Name" >Hi { storeDetails().fullName}</span> : ""
                  }
                </div>
          </Navbar>
        }
        </Navbar>
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
      </div>
    );
  }
}

Header.propTypes = {
  parentCallback: PropTypes.func,
  isOpen: PropTypes.bool
};

Header.defaultProps = {
  isOpen: false,
  parentCallback: () => {}
};

const mapStateToProps = state =>
  {
    return ({
      loginData: state.login.loginData.payload,
      itemsByOrderCycle: state.ordering.getItemDetailsForSelectedCategory && state.ordering.getItemDetailsForSelectedCategory ? state.ordering.getItemDetailsForSelectedCategory : {},
      currentOrderCycleType: state.ordering && state.ordering.currentOrderCycleType && state.ordering.currentOrderCycleType.payload && state.ordering.currentOrderCycleType.payload.orderCycleType ? state.ordering.currentOrderCycleType.payload.orderCycleType : {},
      selectedLink: state.ordering.orderingSelectedLink && state.ordering.orderingSelectedLink.payload && state.ordering.orderingSelectedLink.payload.selectedLink ? state.ordering.orderingSelectedLink.payload.selectedLink : 'Ordering',
      orderRemainingItems : state.ordering.orderingRemainingItems && state.ordering.orderingRemainingItems.payload ? state.ordering.orderingRemainingItems.payload.orderRemainingItems : true,
      checkCategories : state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.checkCategories ? state.ordering.orderingContiueButton.payload.checkCategories: [],
      OrderingCycleType: state.ordering && state.ordering.currentOrderCycleType && state.ordering.currentOrderCycleType.payload && state.ordering.currentOrderCycleType.payload.orderCycleType ? state.ordering.currentOrderCycleType.payload.orderCycleType : {},
      ItemDetailData : state.ordering.orderingContiueButton && state.ordering.orderingContiueButton.payload && state.ordering.orderingContiueButton.payload.ItemDetailData ? state.ordering.orderingContiueButton.payload.ItemDetailData: {},
    }
    );
}


export default  connect(
  mapStateToProps
)(withRouter(Header))
