import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './home.css';
import { storeSelectedReducer } from '../../actions'
import { storeSearchAndSort } from '../../lib/storeSearch'
// import stores from '../../assets/mocks/stores';

export class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      storeProfileDetails: [],
      pageData: [],
      mobData: [],
      storeData: [],
      isOpen: false,
      loginData: [],
      options: [],
      error: false,
      errorMsg: null,
      storeSearch: '',
      storeSelectedData: [],
      selectedOption: {
        data: [] ,
        key:  0,
        label: '',
        value: '',
    
      }
    }
    
    /* Added to reset the default image on login page*/
    document.querySelector("body").style.backgroundImage='none';
  }

  storeSelected = (data,index,id) => {
    this.props.dispatch(storeSelectedReducer({index: index, data: data}));
    this.props.history.push(`store-function/${id}`);
  }

  prepareOptions = () => {
    return this.state && this.state.mobData && this.state.mobData.map(function(data,index) {
      return {
        value: data.storeId,
        label: `Store ${data.storeId} ${ data.storeNickName? data.storeNickName: '' }`,
        key: index,
        data: data
      }    
   });
  }
 
  componentDidMount(){
    window.addEventListener("beforeunload", this.onClickPrevious);
    this.setState ({ 
      storeData: this.props.storeProfileDetails,
      pageData: this.props.storeProfileDetails,
      mobData: this.props.storeProfileDetails,
      loginData: this.props.loginData,
      selectedOption: this.props.selectedOption,
      storeSelectedData: this.props.storeSelectedData
     }, ()=>{
      // if(!this.props.storeProfileDetails){
      //   this.props.dispatch(getStoreProfileDetails());
      // }
     })
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onClickPrevious);
  }

  handleChange = (selectedOption) => {
    if(selectedOption){
      this.setState({ selectedOption });
      this.props.dispatch(storeSelectedReducer({index: selectedOption.key, data: selectedOption.data}));
      this.props.history.push(`store-function/${selectedOption.data.storeId}`);
    }else {
      this.setState({ selectedOption: {
        data: [] ,
        key:  0,
        label: '',
        value: '',
      }});
    }
  }

  search = (value,data) => {
    if(value){
      const searched = storeSearchAndSort(data,value);
      this.setState({ storeData: searched, storeSearch : value})
    }
    else {
      this.setState({ storeData: this.state.pageData, storeSearch : value})
    }
  }

  mobSearch = (value,data) => {
    if(value){
      const searched = storeSearchAndSort(data,value);
      this.setState({ mobData: searched, storeSearch : value})
    }
  }

  onClickPrevious= () => {
    this.props.history.push(`/logout`);
  }

  componentWillReceiveProps(newProps) {
    if( newProps && newProps.storeProfileDetails ){
      this.setState({ 
        storeData: newProps.storeProfileDetails,
        pageData: newProps.storeProfileDetails,
        mobData:  newProps.storeProfileDetails,
        loginData: newProps.loginData,
        selectedOption: newProps.selectedOption,
        storeSelectedData: this.props.storeSelectedData
      })
    }else{
      this.setState({
        error: true, 
        errorMsg: newProps.errorMessage || "Network Error", 
        loginData: newProps.loginData, 
        storeData: []
      })
    }
  }
  handlePropagation = e => {
    e.stopPropagation();
    // this.props.onClick();
  }
  render() {
    // const { mobData } = this.state;
    // if( this.state && this.state.storeData && this.state.storeData.length > 0 && this.state.loginData && !this.state.loginData.isMultiStoreOwner ){
    //   this.props.dispatch(storeSelectedReducer({index: 0, data: this.state.storeData[0] }));
    //   this.props.history.push( `store-function/${this.state.storeData[0].storeId}`);
    // }

    return (
      <div onClick={this.handlePropagation} >
         {/* { this.state.error && <ErrorHandler errorMessage={this.state.errorMsg}/>}
        { this.state && !this.state.error  &&
          <div className="row home-padding">
            <div className = "d-none d-md-block col-md-3"></div>
            <div  className="Store-Selection col-md-6 col-xs-12">STORE SELECTION</div>
            <div className = "Store-Search-home d-none d-md-block col-md-3" >
              <SelectStore  menuIsOpen = { this.state && this.state.storeData && this.state.storeData.length === 0 ? true: false } storeSearch = {this.state.storeSearch}  onInputChange ={(e) => this.search(e,this.state.pageData)} />
            </div>        
            <div className = "Store-Search-mob d-block d-md-none col-md-4" >
              <SelectStore  
                data={this.prepareOptions(mobData)} 
                onInputChange ={(e) => this.mobSearch(e,this.state.pageData)}
                handleChange={this.handleChange} 
                menuIsOpen = {true}
                storeSearch = {this.state.storeSearch}
              />
            </div>
            
            <div className="container store-selection-cards mob-container">
              <div className="row">
                {this.state && this.state.storeData && this.state.storeData.map((data,index)=> {
                  return(
                    <div key={index} className="col-md-4 col-sm-6 col-6" >
                      <div className="card mt-4" id ="Rectangle" onClick = {() => this.storeSelected(data,index,data.storeId)} >
                          <div className="Store-Nickname-Store" >
                          Store {data.storeId}
                          </div>
                          <div className="Store-Nickname-Store" >
                          {data.storeNickName ? data.storeNickName: ''}
                          </div>
                          <div className = "Street-Address-City" >
                            {data.address && <p className="Street-Address-City d-none d-md-block">{data.address.streetAddress}, {data.address.city}, {data.address.state}, {data.address.zip}</p> }
                          </div>
                      </div>
                    </div>
                    )
                  })} 
              </div>
            </div>
          </div>
        }
        <div className="store-listing-prev">
          <button id="btn-prev" type="button" className="btn btn-previous d-none d-sm-block" onClick={this.onClickPrevious}>PREVIOUS</button>
        </div> */}
      </div>
    )
  }
}
const mapStateToProps = state => 
  {
    return ({
      loginData: state.login.loginData.payload,
      storeProfileDetails: state && state.stores && state.stores.getStoreProfile && state.stores.getStoreProfile.payload && state.stores.getStoreProfile.payload.body,
      errorMessage: state.stores.errorMessage.payload,
      storeSelectedData: state.stores.storeSelected.payload ? state.stores.storeSelected.payload.data: [] ,
      selectedOption: {
        data: state.stores.storeSelected.payload ? state.stores.storeSelected.payload.data: [] ,
        key: state.stores.storeSelected.payload ? state.stores.storeSelected.payload.index: 0,
        label: state.stores.storeSelected.payload && state.stores.storeSelected.payload.data ? `Store ${state.stores.storeSelected.payload.data.storeId} ${state.stores.storeSelected.payload.data.storeNickName ? state.stores.storeSelected.payload.data.storeNickName: '' } `: '',
        value: state.stores.storeSelected.payload  && state.stores.storeSelected.payload.data ? state.stores.storeSelected.payload.data.storeId: '',
      },
    });
}

Home.defaultProps = {
  selectedOption: {
    data: [] ,
    key:  0,
    label: '',
    value: '',

  }
}

export default connect(
  mapStateToProps
)(withRouter(Home))