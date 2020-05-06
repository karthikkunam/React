import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SINGLE_DAY, MULTI_DAY, NON_DAILY } from '../../constants/ActionTypes';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import './ReportingCycleType.css';
import 'react-day-picker/lib/style.css';
import dateHelper, { convertStringToDate } from '../utility/DateHelper';
import { parseDate } from 'react-day-picker/moment';

class ReportingCycleType extends Component {
  constructor(props) {
    super(props);
    this.getFormatedDate = this.getFormatedDate.bind(this);
    this.beforeDate = this.beforeDate.bind(this);
    this.state = {
      selectedDay: (this.props.location.state && this.props.location.state.selectedDay) ? this.props.location.state.selectedDay : convertStringToDate(dateHelper().orderBatchDate),
      initialDay: convertStringToDate(dateHelper().orderBatchDate),
      isDayClicked: true,
      orderCycles: [SINGLE_DAY, MULTI_DAY, NON_DAILY],
      orderByVendor: false
    }
  }

  onChange(e) {
    const orderCycles = this.state.orderCycles
    let index;
    if (e.target.checked) {
      orderCycles.push(e.target.value)
    } else {
      index = orderCycles.indexOf(e.target.value)
      orderCycles.splice(index, 1)
    }
    this.setState({ orderCycles: orderCycles })
    this.props.orderCycles(orderCycles)
  }

  isDisabled = () => {
    return !this.state.orderCycles.includes(NON_DAILY)
  }

  getFormatedDate = (date, format, locale) => {
    let weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";

    let formatedDate = (this.ifLessThan10AppendZero(date.getMonth() + 1)) + "/"
      + (this.ifLessThan10AppendZero(date.getDate())) + "/"
      + date.getFullYear() +
      "," + weekdays[date.getDay()];

    return formatedDate;
  }

  ifLessThan10AppendZero = (value) => {
    if (value < 10) {
      return ("0" + value);
    }
    return value;
  }

  modifiersStyles = {
    selectedDay: {
      color: 'white',
      backgroundColor: '#107f62',
    }
  };

  beforeDate = () => {
    var currentDate = convertStringToDate(dateHelper().orderBatchDate);
    currentDate.setDate(currentDate.getDate() - 60);
    return currentDate;
  }

   checkDatesEquality ( date1, date2 ) {
    return (date1.getFullYear() === date2.getFullYear()) &&
           (date1.getMonth() === date2.getMonth()) &&
           (date1.getDate() === date2.getDate());
}

  handleDayClick = (day, modifiers = {}, { selected }) => {
    const { selectedDay } = this.state;
    if (modifiers.disabled) {
      return;
    }

    if( !this.checkDatesEquality( day, selectedDay) ){
      this.setState({
        selectedDay: selected ? undefined : day,
        isDayClicked: true,
        changedDateValue: day
      }, () => {
        this.props.selectedDay(this.state.selectedDay);
      });      
    }
  }

  onClickOrderByVendor = () => {
    if (this.state.orderCycles.includes(NON_DAILY)) {
      this.setState({ orderByVendor: !this.state.orderByVendor },()=>{
        const { orderByVendor } = this.state;
        this.props.orderByVendor( orderByVendor );
        this.props.history.push({
          search: `?sort=${orderByVendor ? 'viewbyvendor' : 'viewbygroup'}`
        });
      })
    }
  }

  componentWillMount(){
    this.props.history.push({
      search: '?sort=viewbygroup'
    });
  }

  render() {
    const { orderCycles } = this.state;
    return (
      <div className="reportingCycleType">
        <div className="row cycles">
          <div className="col-md-3 vendor-row" >
            <div className="form-inline date-picker-text-div nopadding ">
              <DayPickerInput id="day-picker"
                formatDate={this.getFormatedDate}
                format="M/D/YYYY"
                parseDate={parseDate}
                placeholder="MM/DD/YYYY"
                ref={el => (this.dayPicker = el)}
                value={this.state.selectedDay}
                inputProps={{
                  className: "date-picker-text-box",
                  readOnly: true
                }}
                dayPickerProps={{
                  selectedDays: this.state.selectedDay,
                  onDayClick: this.handleDayClick.bind(this),
                  className: "date-picker-calender",
                  disabledDays: { before: this.beforeDate(), after: this.state.initialDay },
                  modifiers: { selectedDay: this.state.selectedDay },
                  modifiersStyles: this.modifiersStyles
                }}
              />
              <span className="calender" ><i className='fa fa-calendar-check-o calender' onClick={() => this.dayPicker.input.focus()}></i></span>
            </div>
          </div>
          <div className="col-md-9 row vendor-row">
            <div className="col-md-3 vendor-row">
              <button id="view-by-vendor"
                type="button"
                className="btn btn-view-by-vendor btn_view_by_vendor_state"
                onClick={this.onClickOrderByVendor}
                disabled={!orderCycles.includes(NON_DAILY)}
              >
                {this.state.orderByVendor ? 'VIEW BY GROUP' : "VIEW BY VENDOR"}
              </button>
            </div>
            <div className="col-md-3 vendor-row">
              <div className="card-block box p-2 coloring-stripe-Singleday">
                <div className="cycleType">
                  <label className="cat-container" > Daily
                      <input type="checkbox"
                      name={SINGLE_DAY}
                      value={SINGLE_DAY}
                      onChange={this.onChange.bind(this)}
                      checked={orderCycles && orderCycles.includes(SINGLE_DAY)}
                    />
                    <span className="cat-checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-3 vendor-row">
              <div className="card-block box p-2 coloring-stripe-Multiday">
                <div className="cycleType">
                  <label className="cat-container"> Multi Day
                    <input
                      type="checkbox"
                      name={MULTI_DAY}
                      value={MULTI_DAY}
                      onChange={this.onChange.bind(this)}
                      checked={orderCycles && orderCycles.includes(MULTI_DAY)}
                    />
                    <span className="cat-checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-3 vendor-row">
              <div className="card-block box p-2 coloring-stripe-Nondaily">
                <div className="cycleType">
                  <label className="cat-container"> Non-daily
                    <input
                      type="checkbox"
                      name={NON_DAILY}
                      value={NON_DAILY}
                      onChange={this.onChange.bind(this)}
                      checked={orderCycles && orderCycles.includes(NON_DAILY)}
                    />
                    <span className="cat-checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default connect(
  null
)(withRouter(ReportingCycleType))
