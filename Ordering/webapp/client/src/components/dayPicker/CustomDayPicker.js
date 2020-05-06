import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { parseDate } from 'react-day-picker/moment';
import dateHelper, { convertStringToDate } from '../utility/DateHelper';
import {concat} from 'lodash';


class CustomDayPicker extends Component {
  constructor(props) {
    super(props);
    this.getFormatedDate = this.getFormatedDate.bind(this);
    this.beforeDate = this.beforeDate.bind(this);
    this.state = {
      selectedDay: convertStringToDate(dateHelper().orderBatchDate),
      initialDay: convertStringToDate(dateHelper().orderBatchDate),
      isDayClicked: true,
      calenderDays: 60,
      disabledDays: [],
      beforeDate: null,
      afterDate: new Date(),
      disabledate: []
    }
    this.selectedDay = this.selectedDay.bind(this);
  }

  componentWillMount() {
    this.setState({
      selectedDay: this.props.selectedDay ? this.props.selectedDay : convertStringToDate(dateHelper().orderBatchDate),
      calenderDays: this.props.calenderDays ? this.props.calenderDays : 60,
      disabledDays: this.props.disabledDays
    },()=>{
      this.beforeDate()
    })
  }


  componentWillReceiveProps(newProps) {
    this.setState({
        selectedDay: newProps.selectedDay ? newProps.selectedDay : convertStringToDate(dateHelper().orderBatchDate),
        disabledDays: newProps.disabledDays
      },
      () => {
        this.loadDate();
      });
  }

  loadDate = () => {
    const { disabledDays } = this.state;
    if (disabledDays) {
      this.setState({
        afterDate: disabledDays[0].after ? disabledDays[0].after : new Date(),
        beforeDate: disabledDays[0].before,
        disabledate: disabledDays[0].disabledate
      })
    }
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
    currentDate.setDate(currentDate.getDate() - this.state.calenderDays);
    this.setState({ beforeDate: currentDate })
  }

  selectedDay(selectedDay) {
    this.setState({ selectedDay: selectedDay });
  }

  checkDatesEquality ( date1, date2 ) {
    return (date1.getFullYear() === date2.getFullYear()) &&
           (date1.getMonth() === date2.getMonth()) &&
           (date1.getDate() === date2.getDate());
  } 

  handleDayClick = (day, modifiers = {}, { selected }) => {
    const { selectedDay } = this.state
    if (modifiers.disabled) {
      return;
    }

    if( !this.checkDatesEquality( day, selectedDay) ){
      this.setState({
        selectedDay: selected ? undefined : day,
        isDayClicked: true,
        changedDateValue: day
      }, () => {
        this.selectedDay(selectedDay);
        this.props.onDayClickComplete(day);      
      });
    }
  }

  render() {
    const {beforeDate, afterDate, disabledate}= this.state;
    return (
      <div className="row customDayPicker">
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
              month:this.state.selectedDay,
              selectedDays: this.state.selectedDay,
              onDayClick: this.handleDayClick.bind(this),
              className: "date-picker-calender",
              disabledDays: concat( disabledate, [{before: beforeDate, after: afterDate}]),
              modifiers: { selectedDay: this.state.selectedDay },
              modifiersStyles: this.modifiersStyles
            }}
          />
          <span className="calender" ><i className='fa fa-calendar-check-o calender' onClick={() => this.dayPicker.input.focus()}></i></span>
        </div>
      </div>
    );
  }
}

export default connect(
)(withRouter(CustomDayPicker))