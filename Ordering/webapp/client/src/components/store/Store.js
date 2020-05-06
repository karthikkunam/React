import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
 import './Store.css';
import { storeSelectedReducer, storeSelectedFunction} from '../../actions'
import { storeSearchAndSort } from '../../lib/storeSearch'


// import Payroll from '../../assets/images/payroll.png';
// import Payroll_white from '../../assets/images/payroll_white.png';
// import Gasoline from '../../assets/images/gas.png';
// import Gasoline_white from '../../assets/images/gas_white.png';
// import Inventory from '../../assets/images/inventory.png';
// import Inventory_white from '../../assets/images/inventory_white.png';
// import Cash from '../../assets/images/cash_mgmt.png';
// import Cash_white from '../../assets/images/cash_mgmt-white.png';
// import Assortment from '../../assets/images/assortment.png';
// import Assortment_white from '../../assets/images/assortment_white.png';
// import stores from '../../assets/mocks/stores';
import OrderingWhiteBg from '../../assets/images/ordering_white.png';
import OrderingBlackBg from '../../assets/images/ordering.png'
import 'react-web-tabs/dist/react-web-tabs.css';
// import Select from 'react-select';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import SelectStore from '../../components/shared/select';
// import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
export class Store extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      storeProfileDetails: [],
      isOpen: false,
      selectedOption: {
        data: [] ,
        key:  0,
        label: '',
        value: '',  
      },
      storeSelectedIndex: 0,
      storeSelectedData: [],
      preparedString:null,
      hoverOverIndex: -1,
    }
    /* Added to reset the default image on login page*/
    document.querySelector("body").style.backgroundImage='none';

    this.options = [
      { value: 'Ordering', label: 'Ordering' },
      { value: 'Payroll', label: 'Payroll' },
      { value: 'Cash', label: 'Cash' }
    ];

    this.storeFunction = [
      {Icon:OrderingBlackBg, textDesktop:'Ordering', MouseOverIcon: OrderingWhiteBg ,textMobile: 'Ordering',URL: '/Ordering'},
      // {Icon:Inventory,textDesktop:'Inventory Management', MouseOverIcon: Inventory_white, textMobile: 'Inventory',URL: '/Inventory'},
      // {Icon:Payroll,textDesktop:'Payroll', MouseOverIcon: Payroll_white, textMobile: 'Payroll',URL: '/Payroll'},
      // {Icon:Assortment,textDesktop:'Product Assortment', MouseOverIcon: Assortment_white, textMobile: 'Assorting',URL: '/Product-Assortment'},
      // {Icon:Cash,textDesktop:'Cash Management', textMobile: 'Cash', MouseOverIcon:Cash_white, URL: '/Cash-Management'},
      // {Icon:Gasoline,textDesktop:'Gasoline Management', MouseOverIcon:Gasoline_white, textMobile: 'Gas',URL: '/Gasoline-Management'}
    ]; 
  
  }

  constructFinalString = () => {
    return this.state && this.state.storeData && this.state.storeData.map(function(data,index) {
      return {
        value: data.storeId,
        label: `Store ${data.storeId} ${data.storeNickName ? data.storeNickName : ''}`,
        key: index,
        data: data
      }    
   });
  }

  storeSelected = (data,index) => {
    this.props.dispatch(storeSelectedReducer({index: index, data: data}));
    // this.props.history.push(`store/${id}`);
  }

  handleChange = (selectedOption) => {
    if(selectedOption){
      this.setState({ selectedOption });
      this.props.dispatch(storeSelectedReducer({index: selectedOption.key, data: selectedOption.data}));
    } else {
      this.setState({ selectedOption: {
        data: [] ,
        key:  0,
        label: '',
        value: '',
      }});
    }
  }

  componentDidMount(){
    this.setState ({ 
      storeData: this.props.storeProfileDetails,
      selectedOption: this.props.selectedOption,
      loginData: this.props.payload,
      storeSelectedIndex : this.props.storeSelectedIndex,
      storeSelectedData : this.props.storeSelectedData
     })
  }

  componentWillReceiveProps(newProps) {
    this.setState({ 
      storeData: newProps.storeProfileDetails,
      storeSelectedIndex : newProps.storeSelectedIndex,
      storeSelectedData : newProps.storeSelectedData,
      loginData: newProps.loginData,
      selectedOption: newProps.selectedOption      
    })
  }

  renderStoreInfo=(data)=>{
    return (
      <div>
        <span className = "store-info-store-nickname">Store {data.storeId}</span>
        <span className = "store-info-store-id">{data.storeNickName ? data.storeNickName: ''}, </span>
        <span className = "store-info-store-address">
          {data.address && <span>{data.address.streetAddress}, {data.address.city}, {data.address.state}, {data.address.zip}</span> }
        </span>
      </div>
    )
  }

  onStoreFunctionSelect=(displayName, index, data)=>{
    this.props.dispatch(storeSelectedFunction({selectedFunction: displayName,index: index, data: data}));
    this.props.history.push(`/${displayName}`);
  }

  onClickPrevious= () => {
    this.props.history.push(`/store-profile`);
  }

  search = (value,data) => {
    if(value){
      const searched = storeSearchAndSort(data,value);
      this.setState({ storeData: searched})
    }
    else {
      this.setState({ storeData: this.props.storeProfileDetails})
    }
  }

  renderOptions = (data) => {
    const { selectedOption } = this.state;
    const options = this.constructFinalString()

    return (
      <div className="Container-padding">
        <div className="">
          <div className="Store-Function">STORE FUNCTION</div>
        </div>
        <div className="hide-for-desktop">
          <div className = "store-search-mob" >
            <SelectStore menuIsOpen = {true}  val={selectedOption} data={options} handleChange={this.handleChange} onInputChange ={(e) => this.search(e,this.props.storeProfileDetails)}/>
          </div>
        </div>
      <div>
        <div className="hide-for-mobile">
        {this.renderStoreInfo(this.state.storeSelectedData)}
        </div> 
      </div>
      <div className="row">
      
        {this.storeFunction.map((data,index) => {
        return (
              <div key={index} className="col-md-4 col-sm-6 col-5 store-func-box" id = {`store-function-${index}`} >
                <div key={index} className="card mt-4 Rectangle" 
                  onMouseEnter={() => { this.setState({ hoverOverIndex: index })}}
                  onMouseLeave={() => { this.setState({ hoverOverIndex: -1 })}}
                  onClick = {() => {this.onStoreFunctionSelect(data.textDesktop, index, this.state.storeSelectedData)}}
                >
                <div className = "store-image-div">
                  <img className="Store-Function-image img-fluid" src={ this.state.hoverOverIndex === index ?data.MouseOverIcon: data.Icon} alt="{data.Icon}"/>
                </div>
                  <div className="Store-Function-body">
                    <p className="Store-Function-desktop">{data.textDesktop}</p>
                    <p className="Store-Function-mobile">{data.textMobile}</p>
                  </div>
                </div>
              </div>
        )
      })  
        }      
      </div>
      <div className="store-fn-prev ordering-prev">
                  <button type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious}>PREVIOUS</button>
                </div>
      </div>
    )
  }

  renderTabs =() => {
    return (
      <TabList>
          <div className = "Store-Search-function d-none d-md-block" >
            <SelectStore menuIsOpen = {this.state && this.state.storeData && this.state.storeData.length === 0 ? true: false }  onInputChange ={(e) => this.search(e,this.props.storeProfileDetails)} />
          </div> 
          <div className="Store-list">
        {this.state && this.state.storeData && this.state.storeData.map((data, index)=> {
          return(
            <Tab  key={index} tabFor={`vertical-tab-${index}`} onClick = {() => this.storeSelected(data,index)}>
              <div className = "background-store-page" style = {{ backgroundColor: this.state.storeSelectedData && this.state.storeSelectedData.storeId === data.storeId ? "white": "#e5e5e5" }}>
                <div className="Store-Nickname-Store-page" >
                  <div className="Store-Nickname-Store-page1" >
                    Store {data.storeId}
                  </div>
                  <div className="Store-Nickname-Store-page2" >
                  {data.storeNickName ? data.storeNickName : ''}
                  </div>
                </div>
                { this.state && this.state.storeData && this.state.storeData.length !== index +1 ?
                  <div className="line-spacing"></div>
                : ''}
              </div>
            </Tab>
          )})
        }
        </div>
      </TabList>
    )
  }

  render() {
    if ( this.state && this.state.storeData && this.state.storeData.length > 1 && this.state.loginData && !this.state.loginData.isMultiStoreOwner ) {
      this.setState({ 
        storeData: this.state.storeData.splice(1)
      });
    }
    this.props.dispatch(storeSelectedFunction({selectedFunction: "ordering",index: 0, data: this.state.storeSelectedData}));
    this.props.history.push('/home');

    return (
      <div className="Store-Panel">
        { this.state && this.state.storeData &&
          <Tabs defaultTab = {`vertical-tab-${ this.state.storeSelectedIndex}`} vertical className="vertical-tabs">
            {this.renderTabs()}
            {this.state && this.state.storeSelectedData  &&
                <TabPanel key={this.state.storeSelectedIndex} tabId={`vertical-tab-${this.state.storeSelectedIndex}`}>
                  {this.renderOptions(this.state.storeSelectedData)}
                </TabPanel>
            }    
          </Tabs>
        }
        
      </div>
      
    )
  }
}

const mapStateToProps = state => 
  {  
    return ({
      loginData: state.login.loginData.payload,
      storeProfileDetails: state && state.stores && state.stores.getStoreProfile && state.stores.getStoreProfile.payload && state.stores.getStoreProfile.payload.body,
      storeSelectedIndex : state.stores.storeSelected.payload.index,
      storeSelectedData : state.stores.storeSelected.payload.data,
      selectedOption: {
        data: state.stores.storeSelected.payload.data,
        key: state.stores.storeSelected.payload.index,
        label: state.stores.storeSelected.payload.data ? `Store ${state.stores.storeSelected.payload.data.storeId} ${state.stores.storeSelected.payload.data.storeNickName ? state.stores.storeSelected.payload.data.storeNickName: '' } `: '',
        value: state.stores.storeSelected.payload.data ? state.stores.storeSelected.payload.data.storeId: '',

      }
    });
}
export default connect(
  mapStateToProps
)(withRouter(Store))
