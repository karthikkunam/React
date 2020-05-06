import React, { Component } from 'react'
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Items from '../../../../../../assets/mocks/OrderingDetail'
import './DailyTrend.css'

export class DailyTrend extends Component {
  constructor(props){
      super(props);
      this.state = {
          Items: Items,
          weather: []
      }
    }

  componentWillMount() {
    this.setState({
      OrderingCycleType: this.props.OrderingCycleType,
      weather: this.props.weather
    })
  }

  componentWillReceiveProps(newProps){
    this.setState({
      weather: newProps.weather
    })
  }
  getImage(date,weather){
    let weatherDataforGivenDate = weather.find(obj => moment(obj.datetime_ISO).utc().format("YYYY-MM-DD") === moment(date).utc().format("YYYY-MM-DD"));
    return weatherDataforGivenDate && weatherDataforGivenDate.icon ? weatherDataforGivenDate.icon: "clear.png";
  }

  getTemp(date,weather){
    let weatherDataforGivenDate = weather.find(obj => moment(obj.datetime_ISO).utc().format("YYYY-MM-DD") === moment(date).utc().format("YYYY-MM-DD"));
    return `${weatherDataforGivenDate && weatherDataforGivenDate.max_temp_F ? weatherDataforGivenDate.max_temp_F: '-'}/${weatherDataforGivenDate && weatherDataforGivenDate.max_temp_F ? weatherDataforGivenDate.min_temp_F: '-'}`
  }

  render() {
      const {Item} = this.props;
      const { weather } = this.state;

    return (
      <div className={this.props.OrderingCycleType === 'MULTI_DAY' && window.innerWidth < 768 ? 'daily-mg-left rowX' : ''}>
          <table  className={this.props.OrderingCycleType === 'MULTI_DAY' ? this.props.reviewFinalizePage ? 'daily-table-multi review-page-multi' : 'daily-table-multi': this.props.reviewFinalizePage ? 'daily-table review-page' : 'daily-table'  }>
            <thead>
                <tr className = "d-none d-md-block align-center-daily">
                    <th className="daily-header">{this.props.reviewFinalizePage ? "Last 10 Days" : "Daily Trend" }</th>
                </tr>
            </thead>
             <tbody>
                    {Item && Item.daily && Item.daily.slice(0).sort((a, b) => new moment(Array.isArray(a.date) ? a.date[0] :a.date).format('YYYYMMDD') - new moment(Array.isArray(b.date) ? b.date[0] : b.date).format('YYYYMMDD')).map((data,itemIndex)=>{
                         
                        return(
                            <tr className="item-row-daily" key = {itemIndex} style={{"float": "left"}}>
                                <td className={this.props.OrderingCycleType === 'MULTI_DAY' && !this.props.reviewFinalizePage ? 'Multiday-resize' : ''}>
                                    <div className="item-row-daily-header"><div><img className = "weather-images" style = {{ "opacity": this.getTemp(data.date,weather) !== '-/-'? 1: 0.3 }} id="img" src={require(`../../../../../../assets/weather_images/${(Array.isArray(data.date)) ? this.getImage(data.date[0],weather) : this.getImage(data.date,weather)}`)} alt="NA"/></div></div>
                                    <div className="item-row-daily-body"><div>{data.date? moment(data.date).format("MM/DD"): '-'}</div></div>
                                    <div className="item-row-daily-body"><div>{weather && weather.length > 0 ? this.getTemp(data.date,weather) : '-'}</div></div>
                                    <div className="item-row-daily-body"><div>{data.DELIVERIES ? (data.DELIVERIES !== data.QTY ? data.DELIVERIES + '*' : data.DELIVERIES) : '-'}</div></div>
                                    <div className="item-row-daily-body"><div>{data.SALE?<span className="salesStyle">{data.SALE}</span>: '-'}</div></div>
                                    <div className="item-row-daily-body"><div>{data.WO? data.WO: '-'}</div></div>
                                    {
                                      !this.props.reviewFinalizePage && 
                                      <div className="item-row-daily-body"><div>{data.OUT_OF_STOCK ? <span className="outOfStockStyle">{data.OUT_OF_STOCK}</span>: '-'}</div></div>
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
  }
}

const mapStateToProps = state => 
  {
    return ({
      weather: state.weather && state.weather.getWeatherReducer ? state.weather.getWeatherReducer : [],
    });
}
export default connect(
  mapStateToProps
)(withRouter(DailyTrend))