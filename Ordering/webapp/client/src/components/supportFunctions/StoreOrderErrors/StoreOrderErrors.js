import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import * as moment from 'moment-timezone';
import SideNavBar from '../../shared/SideNavBar';
import './StoreOrderErrors.css';
import '../../ordering/OrderingHome.css';
import '../common/supportFunctions.css';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import '../../dayPicker/CustomDayPicker.css';
import '../../dayPicker/CustomDayPicker';
import SpinnerComponent from '../../shared/SpinnerComponent';
import CustomDayPicker from '../../dayPicker/CustomDayPicker';
import StoreOrderErrorsPDF from '../../printPdf/StoreOrderErrorPDF';
import { storeDetails } from '../../../lib/storeDetails';
import { getStoreOrderErrorData } from '../../../actions/index';
import { formatDateToMMDDYYYY } from '../../utility/DateHelper';
import { MOMENT_TIMEZONE } from '../../utility/constants';

export class StoreOrderErrors extends React.Component {

  constructor(props){
    super(props);
    this.getFormatedDate = this.getFormatedDate.bind(this); 
    this.state = {
      loginData: [],
      selectedDay : new Date(),   
      initialDay :  new Date(),
      StoreOrderErrors: {},
      columns: [{
        dataField: 'itemId',
        text: 'Item Num',
        spinner: true,
        sort: true,
        headerTitle: true,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%',
        },
        headerClasses: 'error-table-column-header bold',
        classes: 'error-table-column-data',
        sortCaret: (order, column) => {
          if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
          else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
          else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
          return null;
        }
      },
      {
        dataField: 'itemShortName',
        text: 'Item Description',
        sort: true,
        headerTitle: (column, colIndex) => `this is custom title for ${column.text}`,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '20%',
        },
        title: true,
        headerClasses: 'error-table-column-header',
        formatter: this.textformatter,
        classes: 'error-table-column-data',
        sortCaret: (order, column) => {
          if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
          else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
          else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
          return null;
        }
      }, {
        dataField: 'storeOrderTypeCode',
        text: 'Ord Type',
        sort: true,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
        sortCaret: (order, column) => {
          if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
          else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
          else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
          return null;
        }
      },{
        dataField: 'expectedDeliveryDate',
        text: 'Deliv.Date',
        sort: true,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
        formatter: this.dateFormatter,
        sortCaret: (order, column) => {
          if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
          else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
          else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
          return null;
        }
      },
      {
        dataField: 'deliveryNumber',
        text: 'Deliv.Num',
        sort: true,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
        sortCaret: (order, column) => {
          if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
          else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
          else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
          return null;
        }
      },
      {
        dataField: 'adjustedItemOrderQuantity',
        text: 'Adj. Qty',
        sort: true,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: '10%'        
        },
        headerClasses: 'error-table-column-header',
        classes: 'error-table-column-data',
        sortCaret: (order, column) => {
          if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
          else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
          else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
          return null;
        }
      },{
        dataField: 'userFriendlyOrderErrorText',
        text: 'Error Description',
        sort: true,
        title: true,
        headerStyle: {
          border: "solid 1px #d3d3d3",
          backgroundColor: "#f1f1f1",
          width: "20%"        
        },
        headerClasses: 'error-table-column-header',
        formatter: this.errorDescriptionFormatter,
        classes: 'error-table-column-data-cursor',
        sortCaret: (order, column) => {
          if (!order) return (<span>&nbsp;&nbsp;<i className="fa fa-sort"></i></span>);
          else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-asc"></i></span>);
          else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fa fa-sort-desc"></i></span>);
          return null;
        }
      }]  
    }
    
    /* Added to reset the default image on login page*/
    document.querySelector("body").style.backgroundImage='none';
    this.onDayClickComplete = this.onDayClickComplete.bind(this);     
  }

  onDayClickComplete(selectedDay){
    const { loginData } = this.state;
    this.props.dispatch(getStoreOrderErrorData( loginData.storeId, selectedDay));
    this.setState({ spinner: true, selectedDay: selectedDay });
  }

   dateFormatter= (cell, row)=> {
    const YMD_DASH = "MM/DD/YYYY";
    const expectedDeliveryDate = formatDateToMMDDYYYY(cell);
    const TIME_ZONE = (storeDetails() && storeDetails().timeZone) ? MOMENT_TIMEZONE(storeDetails().timeZone) : 'UTC';
    if (row) {
      return (
        <span>
          { moment.tz(expectedDeliveryDate, TIME_ZONE).format(YMD_DASH)}
        </span>
      );
    }
    return (
      <span></span>
    ); 
  }

  textformatter= (cell, row)=> {
    if (cell) {
      return (
        <span>
          {cell.length > 35 ? cell.substring(0, 35) + "..." : cell}
        </span>
      );
    }
    return (
      <span></span>
    ); 
  }

  errorDescriptionFormatter= (cell, row)=> {
    if (row) {
      return (
        <span>
          {cell.length > 35 ? cell.substring(0, 35) + "..." : cell}
          {/* { moment.tz(cell, TIME_ZONE).format(YMD_DASH)} */}
        </span>
      );
    }
    return (
      <span></span>
    ); 
  }

  componentDidMount(){
    this.setState({
      loginData: this.props.loginData,
      StoreOrderErrors: this.props.StoreOrderErrors,
      spinner: true
    },()=>{
      const { loginData, selectedDay} = this.state;
      this.props.dispatch(getStoreOrderErrorData( loginData.storeId, selectedDay));
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
        loginData: newProps.loginData,
        StoreOrderErrors: newProps.StoreOrderErrors,
        spinner: false
      })
  }

  ifLessThan10AppendZero = (value) =>{
    if(value < 10){
        return ("0" + value);
    }
    return value;
  }

  getFormatedDate (date, format, locale) {
    let  weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";    

    let formatedDate =  (this.ifLessThan10AppendZero(date.getMonth() +  1))  +"/" 
    + (this.ifLessThan10AppendZero(date.getDate())) + "/" 
    + date.getFullYear() + 
     "," + weekdays[date.getDay()] ;  

    return formatedDate;
  }  
  
  // beforeDate = () => {
  //   var currentDate = new Date();
  //   currentDate.setDate(currentDate.getDate() - 7);
  //   return currentDate;
  // }
  modifiersStyles = {
    selectedDay: {
      color: 'white',
      backgroundColor: '#107f62',
    }     
  };

  handleDayClick = (day, modifiers = {}, { selected }) => {     
    if (modifiers.disabled) {
      return;
    }   
    this.setState({
      selectedDay: selected ? undefined : day,
      isDayClicked: true,  
      changedDateValue : day       
    },()=>{
      this.props.dispatch(getStoreOrderErrorData( this.state.loginData.storeId, this.state.selectedDay));
    });
  } 

  renderTop(){
    const { loginData } = this.state;
    const storeDetailsId = loginData && loginData.token && storeDetails() && storeDetails().storeId;
    const storeDetilasUser = loginData && loginData.token && storeDetails() && storeDetails().userId;
    // const storeDetilasUser = loginData && loginData.token && storeDetails() && storeDetails().fullName;
    return(
      <div className = "StoreOrderErrors SupportFunctions row no-side-padding">
        <div className = "col-md-3">
          <StoreOrderErrorsPDF className = "print-pdf" 
          storeId={storeDetailsId ? storeDetails().storeId : ''} 
          // employeeId={storeDetilasUser ? storeDetails().fullName : ''} 
          employeeId={storeDetilasUser ? storeDetails().userId : ''}
          selectedDay={this.state.selectedDay} 
          rejectedOrders={this.state.StoreOrderErrors.rejectedOrders || []}
          modifiedOrders={this.state.StoreOrderErrors.modifiedOrders || []}
          >
            PRINT REPORT
          </StoreOrderErrorsPDF>
        </div>
        
          <div className ="col-md-7">
              <CustomDayPicker 
                  onDayClickComplete = {this.onDayClickComplete}
                  selectedDay = {this.state.selectedDay}
                  calenderDays = {7}  
              >
              </CustomDayPicker>
          </div>
           {/* <DayPickerInput id="day-picker"  
            formatDate={this.getFormatedDate}
            format="M/D/YYYY"                            
            parseDate={parseDate} 
            placeholder="MM/DD/YYYY"
            ref={el => (this.dayPicker = el)}                            
            value = {this.state.selectedDay}                                         
            inputProps={ { className : "date-picker-text-box",
                            readOnly: true
                        } }                            
            dayPickerProps={{                          
            selectedDays : this.state.selectedDay,
            onDayClick : this.handleDayClick.bind(this),                                               
            className : "date-picker-calender",                  
            disabledDays: {before: this.beforeDate(), after: this.state.initialDay},  
            modifiers :   {selectedDay :this.state.selectedDay},
            modifiersStyles :  this.modifiersStyles                 
            }} 
          />    */}
            {/* <span className="calender" ><i  className='fa fa-calendar-check-o calender' onClick={() => this.dayPicker.input.focus()}></i></span>    */}
             
      </div>
    )
  } 

  renderSpinner() {
    return (
      <div className="StoreOrderErrors store-order-spinner">
        <SpinnerComponent displaySpinner={true} /> 
      </div>
    )
  }

  renderTable(){
    const { StoreOrderErrors, columns, spinner } = this.state;
    const rowClasses = "error-table-row";
    return(
      <div className = "StoreOrderErrors" id="errors-container">
        <div className = "store-error-heading">
          REJECTED ORDERS:
        </div> 
        <BootstrapTable 
          keyField='itemId'
          data={ StoreOrderErrors.rejectedOrders ? StoreOrderErrors.rejectedOrders: [] } 
          columns={ columns } 
          rowClasses={ rowClasses }
          noDataIndication={ spinner ? this.renderSpinner(): 'No Data Available'}
          loading={ true }
          bootstrap4 = {true}
          id = "mapping_table"
        /> 
        <div className = "store-error-heading">
          MODIFIED ORDERS:
        </div>
        <BootstrapTable 
          keyField='itemId'
          data={ StoreOrderErrors.modifiedOrders ? StoreOrderErrors.modifiedOrders: [] } 
          columns={ columns } 
          rowClasses={ rowClasses }
          noDataIndication={ spinner ? this.renderSpinner(): 'No Data Available'}
          loading={ true }
          bootstrap4 = {true}
          id = "mapping_table"
          />
      </div>
    )
  }

  render() {
    return (
      <div className="full-height">
        <div className="full-height" style={{margin:"0"}}>
          <SideNavBar id="store-order-errors" val={this.state.selectedStoreFunction}>
          <div className="heading-desktop">
            <span className="ordering-heading">
              <span className="store-Info">STORE {this.state.loginData.storeId}</span>
              STORE ORDER ERRORS
            </span>               
          </div> 
          { this.renderTop()}
          { this.renderTable()}
          </SideNavBar>
        </div>
        <div className="ordering-prev store-order-error-footer">                      
          { <button 
              id="btn-next" 
              type="button" 
              className="btn btn-next d-none d-md-block d-lg-block" 
              onClick = {()=>{ this.props.history.push('/home')}}
              >DONE
            </button>
          }                                                    
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => 
  {
    return ({
      loginData: state.login.loginData.payload,
      StoreOrderErrors: state.storeFunctions && state.storeFunctions.storeOrderErrors && state.storeFunctions.storeOrderErrors.payload ? state.storeFunctions.storeOrderErrors.payload: {}
    });
}

export default connect(
  mapStateToProps
)(withRouter(StoreOrderErrors))