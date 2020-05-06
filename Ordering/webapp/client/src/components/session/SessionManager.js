import React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import createApiClient from '../../api/interceptor';
import { USER_ACTIVITY } from '../../constants/ActionTypes'
import { SESSION_EXPIRED, SESSION_EXPIRY_MSG, CLIENT_SESSION_TIMEOUT, APPLICATION_SESSION_TIMEOUT, TOKEN_REFRESH_TIME } from '../utility/constants';
import { LoginReducer, messageData, postOrderDetails, action } from '../../actions';

const SessionManager = (ComposedClass, optionalProps) => {
    class SessionComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                signoutTime: CLIENT_SESSION_TIMEOUT,
                saveTime: TOKEN_REFRESH_TIME,
                sessionTimeout: APPLICATION_SESSION_TIMEOUT,
                tokenRefreshTime: TOKEN_REFRESH_TIME
            };
        }

        componentDidMount() {
            //console.log('*******************Session manager loaded**************\n', moment().format("MM ddd, YYYY hh:mm:ss a"));
            const { loginData, modifiedItems, lastUserActivity } = this.props;
            //console.log("*******************Store Time Zone********************\n", localTZ, storeDetails() && storeDetails().timeZone)
            this.setState({
                loginData: loginData,
                modifiedItems: modifiedItems,
                lastUserActivity: lastUserActivity ? lastUserActivity : moment(),
            });
            this.events = [
                'load',
                'mousemove',
                'mousedown',
                'click',
                'scroll',
                'keypress'
            ];
            for (let i in this.events) {
                window.addEventListener(this.events[i], this.logLastActivity);
            }
            this.setTimeInterval();
        }

        componentWillReceiveProps(newProps) {
            this.setState({
                loginData: newProps.loginData,
                modifiedItems: newProps.modifiedItems
            }, () => {
                const { modifiedItems } = this.state;
                if (modifiedItems && Array.isArray(modifiedItems) && modifiedItems.length > 0) {
                    window.addEventListener('beforeunload', this.saveOrderingData, false);
                    if(!this.saveTimeInterval){
                        this.setIntervalForSave();
                    }
                }
            });
        }

        setTimeInterval = () => {
            //console.log("set timeinterval for extend or kill session\n", moment().format("MM ddd, YYYY hh:mm:ss a"));
            this.logoutTimeInterval = setInterval(this.extendOrKillUserSession, this.state.tokenRefreshTime);
        };

        getTimeZone(key){
            let timeZoneMap = { CST : "America/Chicago", EST: "America/New_York", PST: "America/Los_Angeles", MST: "America/Denver"}
            return timeZoneMap[key];
        }
    

        logLastActivity = () => {
            // this.lastActivityAt = moment();
            this.setState({ lastUserActivity: moment() })
        };

        setIntervalForSave = () => {
            //console.log("set timeinterval for save\n", moment().format("MM ddd, YYYY hh:mm:ss a"));
            this.saveTimeInterval = setInterval(this.saveOrderingData, this.state.saveTime);
        }

        handleBrowserClose = () => {
            this.props.dispatch(LoginReducer(false));
            this.saveOrderingData();
        }

        saveOrderingData = () => {
            let modifiedItems = this.state.modifiedItems;
            //console.log('***********modifiedItems**** no.of modified items: ', Array.isArray(modifiedItems) && modifiedItems.length);
            if (Array.isArray(modifiedItems) && modifiedItems.length > 0) {
                try {
                    this.props.dispatch(postOrderDetails(
                        {
                            Items: modifiedItems,
                            storeId: this.state.loginData.storeId
                        }));
                    clearInterval(this.saveTimeInterval);
                } catch (err) {
                    console.log(err);
                    clearInterval(this.saveTimeInterval);
                }
            }
        }

        extendOrKillUserSession = async () => {
            try {
                const { lastUserActivity, signoutTime, tokenRefreshTime, loginData } = this.state;
                //console.log("--------last user activity", lastUserActivity);
                let currentTime = moment();
                //console.log("timediff", moment.duration(currentTime.diff(lastUserActivity)).asMilliseconds());
                //console.log("signoutTime", signoutTime);
                let timeDiff = moment.duration(currentTime.diff(lastUserActivity)).asMilliseconds();
                if (timeDiff > signoutTime) {
                    //Fulsh the session data to database and clear session data in the browser
                    this.props.dispatch(LoginReducer(false));
                    this.saveOrderingData();
                    //Route the user to message component
                    setTimeout(() => {
                        this.props.dispatch(messageData({
                            title: SESSION_EXPIRED, body: SESSION_EXPIRY_MSG
                        }));
                        this.props.history && this.props.history.push({ pathname: '/message', state: { title: SESSION_EXPIRED, body: SESSION_EXPIRY_MSG } });
                        //sessionStorage.setItem('redirectCounter', null);
                    }, 3000);
                    
                    //Clear the interval
                    clearInterval(this.logoutTimeInterval);
                    clearInterval(this.saveTimeInterval);
                    //Remove all the event listeners that are registered to window object.
                    for (let i in this.events) {
                        window.removeEventListener(this.events[i], this.logLastActivity);
                    }
                }

                if (timeDiff < tokenRefreshTime) {
                    //console.log('*******************get the refresh Token**************\n', moment().format("MM ddd, YYYY hh:mm:ss a"));
                    //Refresh the token
                    const refreshPayload = {
                        userId: loginData.userId,
                        storeId: loginData.storeId,
                        refreshToken: loginData.refreshToken
                    }
                    const refreshSessionToken = () => createApiClient('/7boss/order/auth/refresh/token');
                    let response = await refreshSessionToken().post('', refreshPayload);
                    let refreshedPayload = loginData;
                    if(response && response.data && response.data.body){
                        refreshedPayload.token = response.data.body;
                        this.props.dispatch(action({ type: USER_ACTIVITY, data: lastUserActivity }))
                        this.props.dispatch(LoginReducer(refreshedPayload));
                    } else {
                        //Route the user to message component
                        this.props.dispatch(LoginReducer(false));
                        this.props.history && this.props.history.push({ pathname: '/message', state: { title: SESSION_EXPIRED, body: SESSION_EXPIRY_MSG } });
                        //sessionStorage.setItem('redirectCounter', null);
                        //Clear the interval
                        clearInterval(this.logoutTimeInterval);
                        clearInterval(this.saveTimeInterval);
                        //Remove all the event listeners that are registered to window object.
                        for (let i in this.events) {
                            window.removeEventListener(this.events[i], this.logLastActivity);
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        };

        componentWillUnmount() {
            //console.log("is this clearing time interval ?");
            if (this.logoutTimeInterval) {
                console.log("clear logoutTimeInterval?");
                clearInterval(this.logoutTimeInterval);
            }
            if (this.saveTimeInterval) {
                console.log("clear saveTimeInterval?");
                clearInterval(this.saveTimeInterval);
            }
            this.saveOrderingData();
        }

        render() {
            return (
                    <ComposedClass {...this.props} />
            );
        }
    }

    function mapStateToProps(state) {
        return ({
            loginData: state.login.loginData.payload,
            modifiedItems: state.ordering.modifiedItems,
            lastUserActivity: state.session.lastUserActivity.payload
        });
    }

    return connect(mapStateToProps)(SessionComponent);
}

export default SessionManager;
