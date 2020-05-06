import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {getWeather} from '../../actions';
import moment from 'moment';
import './WeatherDetails.css';
/**TO Do: Static Assests */
import sunny from '../../assets/images/sunny@3x.png';
import storm from '../../assets/images/storm@3x.png';
import snow from '../../assets/images/snow@3x.png';
import rain from '../../assets/images/rain@3x.png';
import cloudy from '../../assets/images/cloudy@3x.png';

export class WeatherDetails extends Component {
    constructor(props){
        super(props)
        this.state = {
            StoreZipCode: 75063,
            weeklyForecast: [],
            last4WeekForecast: ['02/16','02/23','03/02','03/09'],
            Weather7Days:['53/60','35/40','44/39','46/23','55/27','78/58','61/53','60/54'],
            WeatherLast4Sat: ['53/60','53/60','53/60','53/60'],
            WeatherApIData: '',
            ImageIcon: [sunny,storm,snow,rain,cloudy,snow,rain,cloudy],
            ImageIconSat: [sunny,storm,snow,rain]
        }
      this.props.dispatch(getWeather(this.state.StoreZipCode));
    
        // let styles = {
        //     forecastBox: {
        //         padding:'15px'
        //     }
        // }
    }

    componentDidMount(){
       this.setState({WeatherApIData: this.props.weatherInfo})
       this.generateDays(7);
    }

    generateDays = (val) =>{
        const weekDayArr = [];
        let lastSat;
      
        if(val === 7){
            for(let i=7;i>=0;i--){
                weekDayArr.push(moment().subtract(i, 'day').format('MM/DD'))
            }
            this.setState({weeklyForecast: weekDayArr})
        }else if(val === 4){
           lastSat = moment().startOf('isoWeek').subtract(2, 'day');
        }else{
        }
    }

    // componentWillReceiveProps(nextProps){
    //     console.log("componentWillReceiveProps::",nextProps.weatherInfo.icon_url)
    //         this.setState({ImageIcon: this.state.ImageIcon.push(nextProps.weatherInfo.icon_url)})
    // }

   

    render() {
        // const styles = {
        //     forecastBox: {
        //         padding:'15px'
        //     }
        // }
        return (
        <div>
           <div className="">
           <div className="row" style={{"margin-left": "-64px"}}>
                    <div className="col-md-7 last-7-days weather-info" style={{}}>
                    <table className="table">
                        <thead>
                            <tr>
                             <td colspan="8"><p className="Last-7-Days mb-0">Last 7 Days</p></td> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">Weather</th>
                            {
                                    this.state.ImageIcon.map(function(data, index){
                                        return(
                                          <td><img style={{"width": "100%"}} id="img" src= {data}   alt = "Shape-Copy-66"/></td>  
                                        )
                                    })
                                }
                            </tr>
                            <tr>
                            <th scope="row">Date/Day</th>
                                {
                                    this.state.weeklyForecast.map(function(data, index){
                                        return(
                                          <td>{data}</td>  
                                        )
                                    })
                                }
                            </tr>
                            <tr>
                            <th scope="row">Temp</th>
                            {
                                    this.state.Weather7Days.map(function(data,index){
                                        return(
                                            <td>{data}</td>
                                        )
                                    })
                                }
                            </tr>
                        </tbody>
                        </table>
                    </div>
                   
                    <div className="col-md-4 last-7-days" style={{"margin-left": "16px"}}>
                    <table className="table">
                    <td colspan="7"><p className="Last-4-Sat mb-0">Last 4 Sat</p></td> 
                        <tbody>
                        <tr>
                            <th scope="row"></th>
                            {
                                    this.state.ImageIconSat.map(function(data, index){
                                        return(
                                          <td><img style={{"width": "78%"}} id="img" src= {data}   alt = "Shape-Copy-66"/></td>  
                                        )
                                    })
                                }
                            </tr>
                            <tr>
                            <th scope="row"></th>
                                {
                                    this.state.last4WeekForecast.map(function(data, index){
                                        return(
                                          <td>{data}</td>  
                                        )
                                    })
                                }
                            </tr>
                            <tr>
                            <th scope="row"></th>
                                {
                                    this.state.WeatherLast4Sat.map(function(data,index){
                                        return(
                                            <td>{data}</td>
                                        )
                                    })
                                }
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
           </div>
        </div>
        )
    }
}


const mapStateToProps = state => 
{  
  return ({
      weatherInfo : state.weather.getWeatherReducer

    
  });
}
export default connect(
mapStateToProps
)(withRouter(WeatherDetails))