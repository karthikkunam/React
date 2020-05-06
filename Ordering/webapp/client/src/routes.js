import React, { Component, Suspense } from 'react'
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Home,
  Logout,
  Ordering,
  OrderingDetail,
  ReviewFinalize,
  GuidedReplenishment,
  ReportingDetail,
  ReportingDetailMultiDay,
  ReportingDetailGR,
  ReportingDetailNonDaily,
  DsdOrderByVendor,
  DsdOrderDetails,
  StoreOrderErrors,
  TransmitDeliveryCalender,
  Reporting,
  IspHome,
  Message,
  MessageBox,
  Header,
  Launch
} from './importAllUsedComponents';

import Store from '../src/components/store/Store'
import SpinnerComponent from '../src/components/shared/SpinnerComponent';

import * as moment from 'moment-timezone';
import { getOrderDatePromise } from '../src/components/utility/getOrderDate';
import { storeDetails } from './lib/storeDetails';

export class routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      showModal10Min: false,
      msgBoxBody: '',
      loginData: '',
      showModal5Min: false,
      showModal10MinWindow: false,
      dispatchHome: '',
      showModal: false,
      timeZone: storeDetails() && storeDetails().timeZone,
      environment: storeDetails() && storeDetails().environment
    };

    this.orderCloseModal = this.orderCloseModal.bind(this);
    this.orderCloseModal5Min = this.orderCloseModal5Min.bind(this);
    this.redirectToISPHomeModal = this.redirectToISPHomeModal.bind(this);
    this.modalActionOrder10MinCutOff = this.modalActionOrder10MinCutOff.bind(this);
    this.checkForPopUps = this.checkForPopUps.bind(this);
  }

  getTimeZone = (key) => {
    let timeZoneMap = { CST: "America/Chicago", EST: "America/New_York", PST: "America/Los_Angeles", MST: "America/Denver" }
    return timeZoneMap[key];
  }

  componentDidMount() {
    this.setState({
      timeZone: storeDetails() && storeDetails().timeZone,
      environment: storeDetails() && storeDetails().environment
    })
  }

  checkForPopUps() {
    const THIS = this;
    clearInterval(THIS.closeIntervalBefore10Mins);
    clearInterval(THIS.closeIntervalBefore5Mins);
    clearInterval(THIS.redirectToISPHome);

    getOrderDatePromise(new Date()).then(function (orderDate) {
      let localTZ = THIS.getTimeZone(THIS.state.timeZone);
      let StoreLocalTime = moment.tz(localTZ).format("HH:mm");
      const orderCutOffTime = moment.tz({
        hours: 10,
        minute: 0,
      }, localTZ);
      const remainingTime = orderCutOffTime.diff(moment.tz(localTZ), 'minutes');

      THIS.closeIntervalBefore10Mins = setInterval(function () {
        let StoreLocalTime = moment.tz(localTZ).format("HH:mm");
        //Time check for last 10 mins
        if (StoreLocalTime === "09:50" && parseInt(sessionStorage.getItem('counter10Mins')) === 0) {
          THIS.setState({
            showModal10Min: true,
            msgBoxBody: `Current order window for ${moment(orderDate).format('MM/DD/YYYY')} will be closed in 10 mins.`
          });
          sessionStorage.setItem('counter10Mins', 1);
        }
      }, 1000);

      THIS.closeIntervalBefore5Mins = setInterval(function () {
        let StoreLocalTime = moment.tz(localTZ).format("HH:mm");
        //Time check for last 5 mins
        if (StoreLocalTime === "09:55" && parseInt(sessionStorage.getItem('counter5Mins')) === 0) {
          THIS.setState({
            showModal5Min: true,
            msgBoxBody: `Current order window for ${moment(orderDate).format('MM/DD/YYYY')} will be closed in 5 mins.`
          });
          sessionStorage.setItem('counter5Mins', 1);
        }
      }, 1000);

      let count = sessionStorage.getItem('redirectCounter');
      THIS.redirectToISPHome = setInterval(function () {
        let StoreLocalTime = moment.tz(localTZ).format("HH:mm");
        //Time check for 9:59
        //console.log("StoreLocalTime------>", StoreLocalTime, localTZ, storeDetails() && storeDetails().timeZone, StoreLocalTime === "09:59");
        if ((StoreLocalTime >= "09:59" && StoreLocalTime <= "10:04") && count == null && parseInt(sessionStorage.getItem('homeCounter')) === 0) {
          sessionStorage.setItem('redirectCounter', 1);
          THIS.setState({
            showModal: true,
            msgBoxBodyRedirect: `Ordering temporarily unavailable. Try again later.`,
          });
        }
      }, 1000);

      //THIS.closeIntervalBeforeOrderCutOff = setInterval(function(){
      //let StoreLocalTime = moment.tz(localTZ).format("HH:mm");
      //Time check for window 9:50 - 9:59
      if ((StoreLocalTime > "09:50" && StoreLocalTime < "09:59") && parseInt(sessionStorage.getItem('orderCutOffCounter')) === 0) {
        THIS.setState({
          showModal10MinWindow: true,
          msgBoxBodyOrderCutOffRemaining: `Current order window for ${moment(orderDate).format('MM/DD/YYYY')} will be closed in ${remainingTime} mins.`
        });
        sessionStorage.setItem('orderCutOffCounter', 1);
      }
      //}, 1000);   
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      message: newProps.message,
      timeZone: storeDetails() && storeDetails().timeZone,
      environment: storeDetails() && storeDetails().environment
    }, () => {
      this.checkForPopUps();
      this.disableErrorMsgs();
    });
  }

  disableErrorMsgs() {
    let environment = this.state.environment;
    if (environment === 'qa' || environment === 'uat') {
      console.log = console.warn = console.error = () => { };
    }
  }

  orderCloseModal = (showModal10Min) => {
    this.setState({ showModal10Min: showModal10Min });
    clearInterval(this.closeIntervalBefore10Mins);
  }

  orderCloseModal5Min = (showModal5Min) => {
    this.setState({ showModal5Min: showModal5Min, showModal10Min: false });
    clearInterval(this.closeIntervalBefore5Mins);
  }

  modalActionOrder10MinCutOff = (showModal10MinWindow) => {
    this.setState({ showModal10MinWindow: showModal10MinWindow, showModal10Min: false, showModal5Min: false });
  }

  modalActionRedirect = (showModal) => {
    this.setState({ showModal: showModal, showModal10MinWindow: false });
    if (!showModal) {
      sessionStorage.setItem('homeCounter', 1);
      window.location.href = 'home';
    }
  }

  redirectToISPHomeModal = () => {
    clearInterval(this.redirectToISPHome);
  }

  spinner(){
    return(
      <div className="item-detail-spinner-component">
        <div className="item-detail-spinner">
          <SpinnerComponent displaySpinner={true} />
        </div>
      </div>
    );
  }

  render() {
    const { showModal10Min, showModal5Min, msgBoxBody, msgBoxBodyRedirect, showModal, showModal10MinWindow, msgBoxBodyOrderCutOffRemaining } = this.state;
    return (
      <BrowserRouter basename="/7boss/order">
      <Suspense fallback={this.spinner()}>

        <div className="app-container sidenav-tablist" >
          <div className="app-fixed">
            <Header isOpen={this.state.isOpen} />
            <div className="full-height">
              {this.props.loginData && showModal10Min &&
                <MessageBox
                  msgTitle=""
                  msgBody={msgBoxBody}
                  className={"message-box-ordering-unavailable"}
                  initialModalState={false}
                  homePage={true}
                  modalAction={this.orderCloseModal} />}

              {this.props.loginData && showModal5Min &&
                <MessageBox
                  msgTitle=""
                  msgBody={msgBoxBody}
                  className={"message-box-ordering-unavailable"}
                  initialModalState={false}
                  homePage={true}
                  modalAction={this.orderCloseModal5Min} />}

              {this.props.loginData && showModal &&
                <MessageBox
                  msgTitle=""
                  msgBody={msgBoxBodyRedirect}
                  className={"message-box-ordering-unavailable"}
                  initialModalState={false}
                  modalAction={this.modalActionRedirect}
                  homePage={true} />}

              {this.props.loginData && showModal10MinWindow &&
                <MessageBox
                  msgTitle=""
                  msgBody={msgBoxBodyOrderCutOffRemaining}
                  className={"message-box-ordering-unavailable"}
                  initialModalState={false}
                  modalAction={this.modalActionOrder10MinCutOff}
                  homePage={true} />}
            </div>
          </div>
          {this.props.loginData && !(window.location && window.location.pathname.includes('/launch/')) ?
            <Switch>
              <Route path="/store-function/:id" component={Store} />
              <Route exact path="/store-profile" component={Home} isOpen={this.state.isOpen} />
              <Route exact path="/home" component={IspHome} />
              <Route exact path="/report" component={Reporting} />
              <Route exact path="/report/singleday" component={ReportingDetail} />
              <Route exact path="/report/multiday" component={ReportingDetailMultiDay} />
              <Route exact path="/report/nondaily" component={ReportingDetailNonDaily} />
              <Route exact path="/report/gr" component={ReportingDetailGR} />
              <Route path="/landing" component={Ordering} />
              <Route exact path="/placeorder/:OrderingCycleType" component={OrderingDetail} />
              <Route exact path="/placeorder/:OrderingCycleType/reviewfinalize" component={ReviewFinalize} />
              <Route path="/GR" component={GuidedReplenishment} />
              <Route path="/logout" component={Logout} />
              <Route path="/supportfunctions/storeordererrors" component={StoreOrderErrors} />
              <Route path="/supportfunctions/dsd-order-by-vendor" component={DsdOrderByVendor} />
              <Route path="/supportfunctions/dsdorderDetails" component={DsdOrderDetails} />
              <Route path="/supportfunctions/transmitdeliverycalendar" component={TransmitDeliveryCalender} />
              <Route path="/message" render={(props) => <Message message={this.props.message}{...props} />} />
              <Redirect from='/' to='/home' />
              {/* <Redirect from='/launch' to='/home'/> */}
            </Switch>
            :
            <Switch>
              <Route path="/launch/:token" component={Launch} />
              <Route exact path="/message" render={(props) => <Message message={this.props.message}{...props} />} />
              {this.props.loginData &&
                <Route exact path="/home" component={IspHome} />
              }
              <Redirect from='*' to='/message' />
            </Switch>
          }
        </div>
        {/* <Footer /> */}
        </Suspense>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  return ({
    loginData: state.login && state.login.loginData.payload,
    dispatchHome: state.login && state.login.dispatchProps && state.login.dispatchProps.payload
  }
  );
}

export default connect(
  mapStateToProps
)((routes))

