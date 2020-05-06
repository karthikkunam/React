import React, { Component } from 'react'
import { Nav, NavItem,  NavLink } from 'reactstrap';
import './DisplayBar.css';
import DateHelper, { datesToString, formatDateToMMDDYYYY } from '../utility/DateHelper';

export default class DisplayBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedTab: 'weekly',
            NotificationDate: DateHelper(),
            Item: {},
            question: {expire: '', ordreDaySell: '', foreCastSell: ''},
         } 
    }
    
    componentDidMount(){
        this.setState({
            NotificationDate: DateHelper(),
            selectedTab: this.props.selectedTab,
            Item: this.props.Item,
            OrderingCycleType: this.props.OrderingCycleType
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ 
            selectedTab: newProps.selectedTab,
            Item: newProps.Item,
            OrderingCycleType: newProps.OrderingCycleType,
            question: newProps.question
        })
      }

      chkItemTrendPeriod(Item, reviewFinalize) {
        if (reviewFinalize) {
          return datesToString(Item && Item.forecast &&  Item.forecast[0].date);
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

        
    render() {
        // const { NotificationDate } = this.state;
        // let delivery = NotificationDate.deliveryTime;
        // let deliveryDay = moment(delivery).format('ddd');
        const { Item, OrderingCycleType, reviewFinalizePage } = this.props;        
        let forecast = Item && Item.forecast;
        return (
        <div className="display-bar">
            <Nav>
                {
                    (reviewFinalizePage || OrderingCycleType !== 'MULTI_DAY')&&
                        <NavItem className="nav-item-margin">
                        <NavLink href="#" onClick = {()=>{this.props.onTabChange('weekly')}}><span id="nav-displaybar">{this.chkItemTrendPeriod(Item, this.props.reviewFinalizePage)} Trend </span></NavLink>
                        {this.state.selectedTab === "weekly" && 
                            <div className = "display-bar-triangle-wrapper">
                                <div className="display-bar-triangle"></div>
                            </div>
                        }                   
                        </NavItem>
                }
                
                {
                    OrderingCycleType === 'MULTI_DAY' && !reviewFinalizePage &&
                    <NavItem className="nav-item-margin">
                        <NavLink href="#" onClick = {()=>{this.props.onTabChange('weekly1')}}><span id="nav-displaybar"> {datesToString(this.state.question && this.state.question.ordreDaySell, false, {dayFormat:'ddd', separator:'/'})} Trend</span></NavLink>
                        {this.state.selectedTab === "weekly1" && 
                            <div className = "display-bar-triangle-wrapper">
                                <div className="display-bar-triangle"></div>
                            </div>
                        }                   
                    </NavItem>
                }
                {
                    OrderingCycleType === 'MULTI_DAY' && !reviewFinalizePage &&
                    <NavItem className="nav-item-margin">
                        <NavLink href="#" onClick = {()=>{this.props.onTabChange('weekly2')}}><span id="nav-displaybar"> {forecast && forecast.deliveryDay && forecast.deliveryDay.length > 0 && datesToString(this.state.question && this.state.question.forecastSell, false, {dayFormat:'ddd', separator:'/'})} Trend</span></NavLink>
                        {this.state.selectedTab === "weekly2" && 
                            <div className = "display-bar-triangle-wrapper">
                                <div className="display-bar-triangle"></div>
                            </div>
                        }                   
                    </NavItem>
                }        
                <NavItem>
                    <NavLink href="#" onClick = {()=>{this.props.onTabChange('daily')}}><span id="nav-displaybar"> { reviewFinalizePage ? "Last 10 Days": "Daily Trend"}</span></NavLink>
                    {this.state.selectedTab === "daily" && 
                        <div className = "display-bar-triangle-wrapper">
                            <div className="display-bar-triangle"></div>
                        </div>
                    }
                </NavItem>
            </Nav>
        </div>
        )
    }
}
