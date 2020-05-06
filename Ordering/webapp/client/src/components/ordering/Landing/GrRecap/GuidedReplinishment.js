import React, { Component } from 'react';
import './GuidedReplenishment.css';
import '../../Landing/OrderingCategories.css';
import '../../OrderingHome.css';
import SideNavBar from '../../../shared/SideNavBar';
import Select from 'react-select';
import SpinnerComponent from '../../../shared/SpinnerComponent';
import { storeDetails } from '../../../../lib/storeDetails';
import GrTable from './GrTable'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getGRRecalculateVendorDetails, getRecalculateDataForGr, orderingSelectedLink } from '../../../../actions';
import { VENDOR_STRING, NON_DAILY } from '../../../../constants/ActionTypes'
import * as moment from 'moment-timezone';
import { validateRolesAndReadOnlyView } from '../../../utility/validateRolesAndReadOnlyView';
const CustomStyle = {
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#5476c8" : "#ffffff",
    color : state.isSelected ? "#ffffff" : "#2c2f35",
    fontSize: "14px",
    cursor: "pointer",
  }),
  menu: (base, state) => ({
    ...base,
    boxShadow: "0 7px 13px 0 rgba(0, 0, 0, 0.23)",
    backgroundColor: "#ffffff",
  })
}

class GuidedReplenishment extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedStoreFunction: null,
            submit: false,
             options : [
              { value: NON_DAILY, label: 'Non-Daily List' },
              // { value: 'daily', label: 'Daily List' }, NOT NEEDED FOR MVP
              { value: VENDOR_STRING, label: 'Vendor List' }
            ],
            grDroppdown: NON_DAILY,
            sortOptions : [
              { value: 'descriptionFlag', label: 'Sort by Item Descr.' },
              { value: 'statusFlag', label: 'Sort by Status' },
              { value: 'balanceOnHandFlag', label: 'Sort by BoH' },
              { value: 'onOrderFlag', label: 'Sort by OnO' },
              { value: 'quantityFlag', label: 'Sort by Quantity' }
            ],
            sortValue: '',
            loginData: '',
            previous: false,
            autoApprove: storeDetails() && storeDetails().isGRAutoApprove,
            timeZone: storeDetails() && storeDetails().timeZone,
            disableApproveButton: true,
            grRecapSpinner: false,
            grDataRecalculated: '',
            grVendorListRecalculated: '',
            onHome: false,
            readOnly: validateRolesAndReadOnlyView()
        }
    
        /* Added to reset the default image on login page*/
        this.disableApproveButtonFunction = this.disableApproveButtonFunction.bind(this);
        document.querySelector("body").style.backgroundImage='none';
      }

    componentDidMount(){
      const { autoApprove, readOnly } = this.state;
      this.props.dispatch(orderingSelectedLink({
        selectedLink: 'GR',
    }));
      this.setState({
        loginData: this.props.loginData,
        grDataRecalculated: this.props.grDataRecalculated,
        grVendorListRecalculated: this.props.grVendorListRecalculated,
        timeZone: storeDetails() && storeDetails().timeZone
      },()=>{
        //Auto-Recalculate between 9:00 - 9:50 StoreLocalTime
        const localTZ = this.getTimeZone(this.state.timeZone);
        const StoreLocalTime = moment.tz(localTZ).format("HH:mm");
        if((StoreLocalTime >= "09:00" && StoreLocalTime <= "09:50") && !autoApprove && !readOnly){
          this.recalculate();
        }
      })
    } 

    componentWillMount(){
      this.props.history.push({
        search: '?sort=nondaily-list'
      });
    }

    componentWillReceiveProps(newProps){
      this.setState({
        loginData: newProps.loginData,
        grDataRecalculated: newProps.grDataRecalculated,
        grVendorListRecalculated: newProps.grVendorListRecalculated,
        timeZone: storeDetails() && storeDetails().timeZone
      })    
    }

  onClickPrevious= ()=> {
    this.setState({ previous: true })
    // this.props.history.push('/landing');
  }
  
  getTimeZone = (key)=> {
    let timeZoneMap = { CST : "America/Chicago", EST: "America/New_York", PST: "America/Los_Angeles", MST: "America/Denver"}
    return timeZoneMap[key];
  }

  onSubmit = () =>{
    this.setState({ submit: false })
  }

  previousComplete = () =>{
    this.setState({ previous: false })
  }

  onApprove = ()=> {
    this.setState({ submit: true })
  }

  disableApproveButtonFunction(disableApproveButton){
    this.setState({disableApproveButton: disableApproveButton});
  }

  recalculate= ()=> {
    const { loginData, grDroppdown } = this.state;
    if(grDroppdown === NON_DAILY){
      this.props.dispatch(getRecalculateDataForGr(loginData.storeId));
    }else{
      this.props.dispatch(getGRRecalculateVendorDetails(loginData.storeId));
    }
    this.setState({grRecapSpinner: true})
  }

  grRecapStopSpinner = () => {
    this.setState({
      grRecapSpinner: false
    })
  }

  onHome = () => {
    this.setState({ onHome : true }, ()=>{
      this.setState({ onHome: false });
    });
  }

  cycleTypeChanged(e){
    this.setState({ grDroppdown: e.value });
    this.props.history.push({
      search: `?sort=${e.value === VENDOR_STRING ? 'vendor-list' : 'nondaily-list'}`
    });
  }

  sortChanged(e){
    this.setState({ sortValue: e.value })
  }

  isApproveDisabled = (readOnly, disableApproveButton) => {
    return readOnly || disableApproveButton
  }


    renderComponent(){
      const { options, autoApprove, submit, grDroppdown, previous, sortValue, grRecapSpinner, grDataRecalculated, grVendorListRecalculated, onHome, readOnly } = this.state; 
      return(
        <div>

        <div className="gr-fixed-header">
          <div className = "gr-heading header-gr-row">GUIDED REPLENISHMENT RECAP</div>
          <div className = "gr-last-recalculated">Last Recalculated at {grDroppdown === NON_DAILY ? grDataRecalculated: grVendorListRecalculated}</div>
          <div className = "gr-padding-div">
            <div className= "row header-gr-row">
              <div className= "d-none d-md-block col-md-3">
                  <Select
                    className = "gr-select" 
                    isSearchable={false}
                    options = {options}
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator: () => null
                    }}
                    onChange = {(e)=> this.cycleTypeChanged(e)}
                    defaultValue={{ value: NON_DAILY, label: 'Non-Daily List' }}
                    styles={CustomStyle}
                  />
              </div>
              <div className="promo-container-wrapper">
              { window.innerWidth > 768 && 
              
                <div className = " col-md-4 row align-center promo-container grProAlign">
                  <div className = " col md-2 ">
                    <div className = "system-edited-box">
                      <label className="System-Promo-On">System Edited</label>
                    </div>
                  </div>
                  <div className = " col md-2 ">
                    <div className = "user-edited-box">
                      <label className="User-Promo-On">User Edited</label>
                    </div>
                  </div>
                </div> 
              }

              <div className= "col-md-2 col-6 col-sm-6 align-center no-side-padding-gr grAlign">
                <span style = {{ fontWeight: "bold"}} className = "gr-auto-approve">Auto Approval:</span>
                <span className = "gr-on-off bold">{autoApprove ? "ON":"OFF" }</span>
              </div>
            </div>
              <div className= "col-md-3 col-6 col-sm-6 recalculateDiv">
                <button onClick={this.recalculate} disabled = { readOnly } className ="gr-recalculate">RECALCULATE</button>
                {grRecapSpinner &&
                  <div className="ordering-home-spinner">
                    <SpinnerComponent displaySpinner={grRecapSpinner} />    
                  </div>
                }
              </div>
            </div>
          
            <div className= "row header-gr-row d-sm-none">
              <div className= "col-6 col-sm-6">
                  <Select
                    className = "gr-select gr-margin-left" 
                    isSearchable={false}
                    options = {this.state.options}
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator: () => null
                    }}
                    onChange = {(e)=> this.cycleTypeChanged(e)}
                    defaultValue={{ value: NON_DAILY, label: 'Non-Daily List' }}
                    styles={CustomStyle}
                  />
              </div>

              <div className= "col-6 col-sm-6">
                  <Select
                    className = "gr-select" 
                    isSearchable={false}
                    options = {this.state.sortOptions}
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator: () => null
                    }}
                    onChange = {(e)=> this.sortChanged(e)}
                    defaultValue={{ value: '', label: 'Sort By' }}
                    styles={CustomStyle}
                  />
              </div>

            </div>
          
          </div>
        </div>

          <div className="gr-table">
            <GrTable 
              submit = { submit } 
              submitComplete = {this.onSubmit}  
              grDroppdown = { grDroppdown } 
              sortValue = { sortValue }
              previous = {previous}
              previousComplete = {this.previousComplete}
              disableApproveButtonFunction = { this.disableApproveButtonFunction }   
              grRecapStopSpinner ={this.grRecapStopSpinner}
              onHome = { onHome }
            />
            </div>
        </div>
      );
    }

    render() {
      const { loginData, disableApproveButton, readOnly } = this.state;
        return (
          <div className="full-height">
            <div className="full-height" style={{margin:"0"}}>
              <SideNavBar id="ordering-home" val={this.state.selectedStoreFunction} onHome = {this.onHome}>
              <div className="heading-desktop">
                <span className="ordering-heading">
                <span className="store-Info">STORE {loginData.storeId}</span>
                  ORDERING
                  </span>          
              </div>
                       
              <div className="heading-mobile">
                <div className="store-Info">Store # {loginData.storeId}</div>
                <div className="ordering-heading">ORDERING</div>
              </div>
              {this.renderComponent()}
              </SideNavBar>
              <div className="ordering-prev gr-prev">
                { this.state.selectedLink !== "Ordering" &&
                    <button id="btn-prev" type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious}>CLOSE</button>
                }

                { this.state.selectedLink !== 'ItemDetail' && this.state.selectedLink !== 'Review' &&
                <button id="btn-next" type="button" disabled = { this.isApproveDisabled(readOnly, disableApproveButton)} className="btn btn-next d-none d-md-block d-lg-block" onClick={this.onApprove} >APPROVE</button>
                }

              </div>
              <div className="ordering-con-mob">

                { this.state.selectedLink !== 'ItemDetail' && this.state.selectedLink !== 'Review' &&
                  <button id="btn-next-mob" type="button" disabled = { this.isApproveDisabled(readOnly, disableApproveButton)} className="btn btn-next-mob d-md-none d-lg-none d-sm-block gr-recap-mob" onClick={this.onApprove} >APPROVE</button>
                }

              </div> 
            </div>
          </div>  
        );
    }
  }
const mapStateToProps = state => 
  {
    return ({
      grDataRecalculated: state.ordering.getGrRecapData.GR_RECAP && state.ordering.getGrRecapData.GR_RECAP.recalculatedOn ? state.ordering.getGrRecapData.GR_RECAP.recalculatedOn : '',
      grVendorListRecalculated: state.ordering.getGrRecapData.GR_VENDOR_LIST && state.ordering.getGrRecapData.GR_VENDOR_LIST.recalculatedOn ? state.ordering.getGrRecapData.GR_VENDOR_LIST.recalculatedOn : '',
      loginData: state.login.loginData.payload,
    });
}

export default connect(
    mapStateToProps
  )(withRouter(GuidedReplenishment))