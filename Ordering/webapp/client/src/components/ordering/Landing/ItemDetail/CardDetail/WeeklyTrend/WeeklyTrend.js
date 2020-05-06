import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './WeeklyTrend.css'
import DateHelper, { datesToString, formatDateToMMDDYYYY } from '../../../../../utility/DateHelper';
import { MOMENT_TIMEZONE, DEFAULT_TIME_ZONE } from '../../../../../utility/constants';
import moment from 'moment-timezone';
import { storeDetails } from '../../../../../../lib/storeDetails';
const storeTimeZone = MOMENT_TIMEZONE(storeDetails() && storeDetails().timeZone) || DEFAULT_TIME_ZONE;

export class WeeklyTrend extends Component {

  constructor(props) {
    super(props);
    this.state = {
      NotificationDate: DateHelper(),
      question: { expire: '', ordreDaySell: '', foreCastSell: '' },
      ordreDaySell: false,
      forecastSell: false,
      nonDailyforeCastTrend: false,
      weekly1: false,
      weekly2: false,
      weather: []
    }
  }

  componentDidMount() {
    this.setState({
      NotificationDate: DateHelper(),
      selectedQuestion: this.props.selectedQuestion,
      OrderingCycleType: this.props.OrderingCycleType,
      weekly1: this.props.hasOwnProperty("weekly1") ? this.props.weekly1 : true,
      weekly2: this.props.hasOwnProperty("weekly2") ? this.props.weekly2 : true,
      weather: this.props.weather
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      weather: newProps.weather
    })
    if (newProps.question) {
      this.setState({
        question: newProps.question,
        weekly1: newProps.hasOwnProperty("weekly1") ? newProps.weekly1 : true,
        weekly2: newProps.hasOwnProperty("weekly2") ? newProps.weekly2 : true
      })
    }
    if (newProps.highlight) {
      this.setState({
        highlight: newProps.highlight,
        itmId: newProps.highlight.itmId,
        ordreDaySell: newProps.highlight.ordreDaySell,
        forecastSell: newProps.highlight.forecastSell,
        nonDailyforeCastTrend: newProps.highlight.nonDailyforeCastTrend
      })
    }
  }

  sortArrayOfDates(arr) { 
    arr.forEach(item => { 

    }); 
  }

  chkItemTrendPeriod(Item, reviewFinalize) {
    if (reviewFinalize) {
      return datesToString(Item && Item.forecast[0].date);
    } else {
      if (this.state.OrderingCycleType) {
        if (this.state.OrderingCycleType === 'MULTI_DAY' && this.props.reviewFinalizePage) {
          return datesToString(formatDateToMMDDYYYY(Item.deliveryDate));
        }

        if (this.state.OrderingCycleType === 'SINGLE_DAY') {
          return datesToString(formatDateToMMDDYYYY(Item.deliveryDate));
        }

        if (this.state.OrderingCycleType === 'NON_DAILY' && Item.forecast[0] && Item.forecast[0].date) {
          return datesToString(Item.forecast[0].date);
        }
      }
    }
  }

  toDate(dates) {
    // + (Item.forecast.deliveryDay.length - itemIndex-1)
    if (Array.isArray(dates)) {
      //return moment(dates[0], 'YYYY-MM-DD').format('MM/DD');
      return moment(dates[0]).format('MM/DD');
    } else {
      //return moment(dates, 'YYYY-MM-DD').format('MM/DD');
      return moment(dates).format('MM/DD');
    }
  }

  getImage(date, weather) {
    let weatherDataforGivenDate = weather.find(obj => moment(obj.datetime_ISO).utc().format("YYYY-MM-DD") === moment(date).utc().format("YYYY-MM-DD"));
    return weatherDataforGivenDate && weatherDataforGivenDate.icon ? weatherDataforGivenDate.icon : "clear.png";
  }

  getTemp(date, weather) {
    let weatherDataforGivenDate = weather.find(obj => moment(obj.datetime_ISO).utc().format("YYYY-MM-DD") === moment(date).utc().format("YYYY-MM-DD"));
    return `${weatherDataforGivenDate && weatherDataforGivenDate.max_temp_F ? weatherDataforGivenDate.max_temp_F : '-'}/${weatherDataforGivenDate && weatherDataforGivenDate.max_temp_F ? weatherDataforGivenDate.min_temp_F : '-'}`
  }

  displayTrend() {
    const { weather } = this.state;
    const { Item } = this.props;
    if (Item && Item.forecast) {
      let forecast = Item.forecast;
      if (Array.isArray(forecast)) {
        return (
          <div active={this.props.reviewFinalizePage ? "true" : "false"} className={this.props.OrderingCycleType === 'NON_DAILY' ? this.state.highlight && (this.state.itmId === Item.itemId) && this.state.highlight.nonDailyforeCastTrend ? 'weekly-wrapper body-background box-highlight' : 'weekly-wrapper body-background' : this.state.highlight && (this.state.itmId === Item.itemId) && this.state.highlight.nonDailyforeCastTrend ? 'weekly-wrapper body-background box-highlight' : 'weekly-wrapper body-background'}>
            <table id="weekly" className={this.props.OrderingCycleType === 'NON_DAILY' ? this.props.reviewFinalizePage ? 'non-daily-weekly body-background-non-daily review-page-weekly' : 'non-daily-weekly body-background-non-daily' : this.props.reviewFinalizePage ? 'weekly-table review-page-weekly' : 'weekly-table'}>
              <thead>
                <tr>
                  <th className="weekly-header">{this.chkItemTrendPeriod(Item, this.props.reviewFinalizePage)} Trend</th>
                </tr>
              </thead>
              <tbody>
                {/**Removed sort for daily & non-daily weekly trend  */}
                {
                  forecast.sort((a, b) => new moment(Array.isArray(a.date) ? a.date[0] :a.date).format('YYYYMMDD') - new moment(Array.isArray(b.date) ? b.date[0] : b.date).format('YYYYMMDD')).map((data, itemIndex) => {
                    return (
                      <tr className={(this.props.OrderingCycleType === 'SINGLE_DAY' && window.innerWidth <= 768) ? 'item-row-weekly add-daily-trend-mg' : (this.props.OrderingCycleType === 'NON_DAILY' && window.innerWidth <= 768) ? 'item-row-weekly add-daily-trend-mg-non-daily' : 'item-row-weekly'} key={itemIndex} style={{ "float": "left" }}>
                        <td>
                          <div className="item-row-daily-header"><div><img className="weather-images" style={{ "opacity": (Array.isArray(data.date)) ? this.getTemp(data.date[data.date.length-1], weather) !== '-/-' ? 1 : 0.3 : this.getTemp(data.date, weather) !== '-/-' ? 1 : 0.3 }} id="img" src={require(`../../../../../../assets/weather_images/${(Array.isArray(data.date)) ? this.getImage(data.date[0], weather) : this.getImage(data.date, weather)}`)} alt="NA" /></div></div>
                          <div className="item-row-daily-body"><div>{data.date ? (Array.isArray(data.date) ? 'FP' + (Item.forecast.length - itemIndex) : moment(data.date).tz(storeTimeZone).format("MM/DD")) : '-'}</div></div>
                          <div className="item-row-daily-body"><div>{weather && weather.length > 0 ? (Array.isArray(data.date)) ? this.getTemp(data.date[data.date.length-1], weather) : this.getTemp(data.date, weather) : '-'}</div></div>
                          <div className="item-row-daily-body"><div>{data.DELIVERIES ? (data.DELIVERIES !== data.QTY ? data.DELIVERIES + '*' : data.DELIVERIES) : '-'}</div></div>
                          <div className="item-row-daily-body"><div>{data.SALE ? <span className="salesStyle">{data.SALE}</span> : '-'}</div></div>
                          <div className="item-row-daily-body"><div>{data.WO ? data.WO : '-'}</div></div>
                          {
                            !this.props.reviewFinalizePage &&
                            <div className="item-row-daily-body"><div>{data.OUT_OF_STOCK ? <span className="outOfStockStyle">{data.OUT_OF_STOCK}</span> : '-'}</div></div>
                          }
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        )
      } else if (forecast instanceof Object) {
        return (
          <div className="row">
            <div className={this.props.OrderingCycleType === 'MULTI_DAY' ? this.state.highlight && (this.state.itmId === Item.itemId) && this.state.highlight.ordreDaySell ? 'weekly-wrapper col-md-6 box-highlight' : 'weekly-wrapper col-md-6' : this.state.highlight && (this.state.itmId === Item.itemId) && this.state.highlight.ordreDaySell ? 'weekly-wrapper body-background col-md-6 box-highlight' : 'weekly-wrapper body-background col-md-6'}>
              <table id="weekly" className={window.innerWidth <= 768 && this.props.OrderingCycleType !== "SINGLE_DAY" ? 'weekly-table body-background-multi add-mg-trend' : 'weekly-table body-background-multi'}>
                <thead>
                  <tr>
                    <th className="weekly-header"> {datesToString(this.state.question.ordreDaySell)} Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.weekly1 &&
                    forecast.sellDay.sort((a, b) => new moment(Array.isArray(a.date) ? a.date[0] :a.date).format('YYYYMMDD') - new moment(Array.isArray(b.date) ? b.date[0] : b.date).format('YYYYMMDD')).map((data, itemIndex) => {
                      return (
                        <tr className="item-row-weekly" key={itemIndex} style={{ "float": "left" }}>
                          <td>
                            <div className="item-row-daily-header"><div><img className="weather-images" style={{ "opacity": (Array.isArray(data.date)) ? this.getTemp(data.date[data.date.length-1], weather) !== '-/-' ? 1 : 0.3 : this.getTemp(data.date, weather) !== '-/-' ? 1 : 0.3 }} id="img" src={require(`../../../../../../assets/weather_images/${(Array.isArray(data.date)) ? this.getImage(data.date[0], weather) : this.getImage(data.date, weather)}`)} alt="NA" /></div></div>
                            <div className="item-row-daily-body"><div>{data.date ? (
                              itemIndex !== forecast.sellDay.length - 1 ?
                                this.toDate(data.date) : moment(data.date, 'YYYY-MM-DD').format('MM/DD'))
                              : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{weather && weather.length > 0 ? (Array.isArray(data.date)) ? this.getTemp(data.date[data.date.length-1], weather) : this.getTemp(data.date, weather) : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.DELIVERIES ? (data.DELIVERIES !== data.QTY ? data.DELIVERIES + '*' : data.DELIVERIES) : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.SALE ? <span className="salesStyle">{data.SALE}</span> : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.WO ? data.WO : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.OUT_OF_STOCK ? <span className="outOfStockStyle">{data.OUT_OF_STOCK}</span> : '-'}</div></div>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
            <div className={this.props.OrderingCycleType === 'MULTI_DAY' ? this.state.highlight && (this.state.itmId === Item.itemId) && this.state.highlight.forecastSell ? 'weekly-wrapper col-md-6 box-highlight' : 'weekly-wrapper col-md-6' : this.state.highlight && (this.state.itmId === Item.itemId) && this.state.highlight.forecastSell ? 'weekly-wrapper body-background col-md-6 box-highlight' : 'weekly-wrapper body-background col-md-6'}>
              <table id="weekly" className={window.innerWidth <= 768 && this.props.OrderingCycleType !== "SINGLE_DAY" ? 'weekly-table body-background-multi-trend add-mg-trend' : 'weekly-table body-background-multi-trend'}>
                <thead>
                  <tr>
                    <th className="weekly-header">{forecast.deliveryDay.length > 0 && datesToString(this.state.question.forecastSell)} Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.weekly2 &&
                    forecast.deliveryDay.sort((a, b) => new moment(Array.isArray(a.date) ? a.date[0] :a.date).format('YYYYMMDD') - new moment(Array.isArray(b.date) ? b.date[0] : b.date).format('YYYYMMDD')).map((data, itemIndex) => {
                      return (
                        <tr className="item-row-weekly" key={itemIndex} style={{ "float": "left" }}>
                          <td>
                            <div className="item-row-daily-header"><div><img className="weather-images" style={{ "opacity": (Array.isArray(data.date)) ? this.getTemp(data.date[data.date.length-1], weather) !== '-/-' ? 1 : 0.3 : this.getTemp(data.date, weather) !== '-/-' ? 1 : 0.3 }} id="img" src={require(`../../../../../../assets/weather_images/${(Array.isArray(data.date)) ? this.getImage(data.date[0], weather) : this.getImage(data.date, weather)}`)} alt="NA" /></div></div>
                            <div className="item-row-daily-body"><div>{data.date ? (
                              itemIndex !== forecast.deliveryDay.length - 1 ?
                                this.toDate(data.date) : moment(data.date, 'YYYY-MM-DD').format('MM/DD'))
                              : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{weather && weather.length > 0 ? (Array.isArray(data.date)) ? this.getTemp(data.date[data.date.length-1], weather) : this.getTemp(data.date, weather) : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.DELIVERIES ? (data.DELIVERIES !== data.QTY ? data.DELIVERIES + '*' : data.DELIVERIES) : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.SALE ? <span className="salesStyle">{data.SALE}</span> : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.WO ? data.WO : '-'}</div></div>
                            <div className="item-row-daily-body"><div>{data.OUT_OF_STOCK ? <span className="outOfStockStyle">{data.OUT_OF_STOCK}</span> : '-'}</div></div>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div >
        )
      }
    }
  }

  render() {
    return (
      <div className={(this.props.OrderingCycleType === 'NON_DAILY' && window.innerWidth <= 768) ? 'mg-left-weekly-non-daily' : ''}>
        {this.displayTrend()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return ({
    weather: state.weather && state.weather.getWeatherReducer ? state.weather.getWeatherReducer : [],
  });
}
export default connect(
  mapStateToProps
)(withRouter(WeeklyTrend))
