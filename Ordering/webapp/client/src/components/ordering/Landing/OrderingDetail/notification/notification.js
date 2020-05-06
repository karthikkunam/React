import React, { Component } from 'react';
import './notification.css'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { datesToString, formatDateToMMDDYYYY } from '../../../../utility/DateHelper';
import { DEFAULT_TIME_ZONE, DAY_DATE_FORMAT, DATE_PERIOD_SEPARATOR } from '../../../../utility/constants';
import { subtractDays, addDays } from '../../../../utility/DateFormatter';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this); 
        this.state = {
            OrderingCycleType: '',
            Item: {},
            isToggleOn: true
        }
    }

    handleClick() {
		this.setState(function(prevState) {
			return {isToggleOn: !prevState.isToggleOn};
		});
	}

    componentDidMount() {
        this.setState({
            OrderingCycleType: this.props.OrderingCycleType,
            Item: this.props.Item
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            OrderingCycleType: newProps.OrderingCycleType,
            Item: newProps.Item
        })
    }

    getOrderSubmitNotificationText() {
        let item = this.props.Item ? this.props.Item : {};
        let dateString = datesToString(item.submitDate, false, { dayFormat: DAY_DATE_FORMAT, separator: DATE_PERIOD_SEPARATOR });
        let text = this.state.OrderingCycleType === 'SINGLE_DAY' ? 'This order will submit on ' : 'This order will transmit on ';
        text = text + dateString + ' at 10AM';
        return text;
    }

    getOrderdeliveryNotificationText() {
        let item = this.props.Item ? this.props.Item : {};
        const currentDeliveryDate = formatDateToMMDDYYYY(item.deliveryDate)
        let dateString = datesToString(currentDeliveryDate, false, { dayFormat: DAY_DATE_FORMAT, separator: DATE_PERIOD_SEPARATOR });
        let text = 'The order will be delivered by ' + dateString;
        return text;
    }

    getOrderForecastNotificationText() {
        let item = this.props.Item ? this.props.Item : {};
        let forecastFromDate = subtractDays(item.submitDate, 1, DEFAULT_TIME_ZONE);
        let fromDateString = datesToString(forecastFromDate, false, { dayFormat: DAY_DATE_FORMAT, separator: DATE_PERIOD_SEPARATOR });
        // forecast period is 4 then we are forecasting for 4 days  orderdate-1 + (forecastPeriod-1 days)
        let forecastToDate = addDays(forecastFromDate, item.forecastPeriod - 1, DEFAULT_TIME_ZONE);
        let toDateString = datesToString(forecastToDate, false, { dayFormat: DAY_DATE_FORMAT, separator: DATE_PERIOD_SEPARATOR });
        let dateSeperator = this.state.OrderingCycleType === 'NON_DAILY' ? ' - ' : ' & ';
        return 'You are forecasting for ' + fromDateString + dateSeperator + toDateString;
    }

    render() {
        return (
            <div>
                <span className="notificationBar-alert">
                    <i onClick={this.handleClick} className={ this.state.isToggleOn ? 'fa fa-exclamation-circle' : 'fa fa-times'}></i>
                </span>

                <div className={ this.state.isToggleOn ? 'row Notification-bar hide' : 'row Notification-bar show'}>
                    <div className={this.state.OrderingCycleType === 'SINGLE_DAY' || this.state.OrderingCycleType === 'MULTI_DAY' ?
                        'col-md-6 no-gutters border-right order-mb d-md-block' :
                        'col-md-4 no-gutters border-right order-mb d-md-block'}>
                        <Alert color="secondary notification-text">
                            {this.getOrderSubmitNotificationText()}
                        </Alert>
                    </div>
                    <div className={this.state.OrderingCycleType === 'SINGLE_DAY' || this.state.OrderingCycleType === 'MULTI_DAY' ?
                        'col-md-6 no-gutters border-right deliver-mb d-md-block' :
                        'col-md-4 no-gutters border-right order-mb deliver-mb d-md-block'}>
                        <Alert color="secondary notification-text">
                            {this.getOrderdeliveryNotificationText()}
                        </Alert>
                    </div>
                    {
                        this.state.OrderingCycleType === 'NON_DAILY' &&
                        <div className="col-md-4 no-gutters border-right deliver-mb d-md-block">
                            <Alert color="secondary notification-text">
                                {this.getOrderForecastNotificationText()}
                            </Alert>
                        </div>
                    }
                </div>
                {/* <div className="row Notification-bar col-md-none col-lg-none  d-md-none d-lg-none">
                    <div className="col-md-12 no-gutters border-right order-mb">
                        <Alert color="secondary notification-text">
                        Orders Submitted on {orderDay} {NotificationDate.orderTime.replace(/\b0/g, '')} will be delivered {deliveryDay} {NotificationDate.deliveryTime.replace(/\b0/g, '')}.
                        </Alert>
                    </div>
                </div> */}
            </div>
        )
    }
}

export default connect(
    null
)(withRouter(Notification))