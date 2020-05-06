import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './IspHome.css';
import '../ordering/OrderingHome';
import SideNavBar from '../../components/shared/SideNavBar';
import { storeDetails } from '../../lib/storeDetails';
import { action } from '../../actions';
import OrderingBlackBg from '../../assets/images/rain-copy.png';
import OrderingWhiteBg from '../../assets/images/rain-copy2.png';
import ReportingWhiteBg from '../../assets/images/reporting1.png';
import ReportingBlackBg from '../../assets/images/reporting2.png';
import StoreFunctionWhiteBg from '../../assets/images/support_functions1.png';
import StoreFunctionBlackBg from '../../assets/images/support_functions2.png';
import MessageBox from '../../components/shared/MessageBox';
import { HOME, AVAILABILITY_CHECK, HISTORY } from '../../constants/ActionTypes';
import SpinnerComponent from '../../components/shared/SpinnerComponent';

export class IspHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderingHoverIndex: 0,
      reportingHoverIndex: 0,
      StoreFunctionHoverIndex: 0,
      storeProfileDetails: [],
      pageData: [],
      mobData: [],
      storeData: [],
      isOpen: false,
      loginData: [],
      msgBoxBody: '',
      showModal: false,
      options: [],
      error: false,
      errorMsg: null,
      storeSearch: '',
      storeSelectedData: [],
      displayISPSpinner: false,
      availabilityStatusCheck: '',
      deviceType: storeDetails() && storeDetails().deviceType,
      selectedOption: {
        data: [],
        key: 0,
        label: '',
        value: '',
      },
      orderingAvailabilityPayload: '',
    };
    /* Added to reset the default image on login page*/
    document.querySelector('body').style.backgroundImage = 'none';
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onClickPrevious);
    this.setState(
      {
        storeData: this.props.storeProfileDetails,
        pageData: this.props.storeProfileDetails,
        mobData: this.props.storeProfileDetails,
        loginData: this.props.loginData,
        selectedOption: this.props.selectedOption,
        storeSelectedData: this.props.storeSelectedData,
        orderingAvailabilityPayload: this.props.orderingAvailabilityPayload,
        availabilityStatusCheck: this.props.availabilityStatusCheck,
        showModal: false,
      },
      () => {
        this.props.dispatch(action({ type: HOME }));
        this.props.dispatch(
          action({ type: HISTORY, data: this.props.history })
        );
        if (
          this.state.deviceType === '7MD' &&
          (this.state.deviceType !== 'remoteAccess' ||
            this.state.deviceType !== 'ISP')
        ) {
          this.props.history.push('/landing');
        }
      }
    );
  }

  homeRedirect(e) {
    const name = e.target.getAttribute('name');
    const { loginData } = this.state;
    if (name === 'landing' && loginData) {
      //this.setState({ displayISPSpinner: true });
      //this.props.dispatch(getSystemAvailabilityStatus(loginData.storeId, this.props.history))
      this.props.history.push(`${name}`);
    }
    if (name !== 'landing') {
      this.props.history.push(`${name}`);
    }
  }

  modalAction = (showModal) => {
    this.setState({ showModal: showModal, availabilityStatusCheck: '' });
  };

  componentWillReceiveProps(newProps) {
    if (newProps && newProps.storeProfileDetails) {
      this.setState({
        storeData: newProps.storeProfileDetails,
        pageData: newProps.storeProfileDetails,
        mobData: newProps.storeProfileDetails,
        loginData: newProps.loginData,
        selectedOption: newProps.selectedOption,
        storeSelectedData: this.props.storeSelectedData,
        orderingAvailabilityPayload: newProps.orderingAvailabilityPayload,
        availabilityStatusCheck: newProps.availabilityStatusCheck,
      });
    } else {
      let sysChkOldProps = this.state.availabilityStatusCheck;
      let sysChkNewProps = newProps.availabilityStatusCheck;
      this.setState(
        {
          error: true,
          loginData: newProps.loginData,
          storeData: [],
          orderingAvailabilityPayload: newProps.orderingAvailabilityPayload,
        },
        () => {
          const { showModal } = this.state;
          //console.log(sysChkNewProps === 'SYSTEM_DOWN_FOR_MAINTENANCE', showModal, sysChkOldProps, sysChkNewProps);
          if (
            sysChkNewProps === 'SYSTEM_DOWN_FOR_MAINTENANCE' &&
            sysChkOldProps !== sysChkNewProps
          ) {
            this.setState({
              displayISPSpinner: false,
              showModal: !showModal,
              msgBoxBody: `Ordering temporarily unavailable. Try again later.`,
              availabilityStatusCheck: '',
            });
            this.props.dispatch(
              action({ type: AVAILABILITY_CHECK, payload: 'SYSTEM_AVAILABLE' })
            );
          }
        }
      );
    }
  }

  render() {
    const { msgBoxBody, showModal, displayISPSpinner, loginData } = this.state;
    return (
      <div className='full-height'>
        <div className='app-container-background' style={{ margin: '0' }}>
          <SideNavBar id='ordering-home' val={this.state.selectedStoreFunction}>
            <div className='heading-desktop'>
              <span className='ordering-heading'>
                <span className='store-Info'>
                  STORE{' '}
                  {loginData &&
                  loginData.token &&
                  storeDetails() &&
                  storeDetails().storeId
                    ? storeDetails().storeId
                    : ''}
                </span>
                ORDERING
              </span>
            </div>
            <div className='isp-options row'>
              <div className='col-md-4 '>
                <div
                  className='isp-box'
                  name='landing'
                  onClick={(e) => {
                    this.homeRedirect(e);
                  }}
                  onMouseEnter={() => {
                    this.setState({ orderingHoverIndex: 1 });
                  }}
                  onMouseLeave={() => {
                    this.setState({ orderingHoverIndex: 0 });
                  }}
                >
                  <img
                    name='landing'
                    className='isp-home-img-ordering'
                    src={
                      this.state.orderingHoverIndex === 1
                        ? OrderingWhiteBg
                        : OrderingBlackBg
                    }
                    alt='{ordering}'
                  />
                </div>
                <div className='isp-content-heading isp-options-content'>
                  PLACE ORDER
                </div>
                <div className='isp-content'>
                  Create, submit and/or approve your orders.
                </div>
              </div>
              <div className='col-md-4 '>
                <div
                  className='isp-box'
                  name='report'
                  onClick={(e) => {
                    this.homeRedirect(e);
                  }}
                  onMouseEnter={() => {
                    this.setState({ reportingHoverIndex: 1 });
                  }}
                  onMouseLeave={() => {
                    this.setState({ reportingHoverIndex: 0 });
                  }}
                >
                  <img
                    name='report'
                    className='isp-home-img-reporting'
                    src={
                      this.state.reportingHoverIndex === 1
                        ? ReportingWhiteBg
                        : ReportingBlackBg
                    }
                    alt='{reporting}'
                  />
                </div>
                <div className='isp-content-heading isp-options-content'>
                  REPORTING
                </div>
                <div className='isp-content'>
                  Review your past ordering data up to 60 days.
                </div>
              </div>
              <div
                className='col-md-4 isp-container-store-function'
                // onMouseEnter={() => { this.setState({ StoreFunctionHoverIndex: 1 })}}
                // onMouseLeave={() => { this.setState({ StoreFunctionHoverIndex: 0 })}}
              >
                <div
                  className='isp-box-store-function'
                  name='store-function'
                  onClick={() =>
                    this.setState({
                      StoreFunctionHoverIndex:
                        this.state.StoreFunctionHoverIndex !== 2 ? 2 : 1,
                    })
                  }
                  onMouseEnter={() => {
                    this.setState({
                      StoreFunctionHoverIndex:
                        this.state.StoreFunctionHoverIndex !== 2 ? 1 : 2,
                    });
                  }}
                  onMouseLeave={() => {
                    this.setState({
                      StoreFunctionHoverIndex:
                        this.state.StoreFunctionHoverIndex !== 2 ? 0 : 2,
                    });
                  }}
                  style={{
                    backgroundColor: this.state.StoreFunctionHoverIndex
                      ? '#008060'
                      : '#ffffff',
                  }}
                >
                  <img
                    name='store-function'
                    className='isp-home-img-store-function'
                    src={
                      this.state.StoreFunctionHoverIndex > 0
                        ? StoreFunctionWhiteBg
                        : StoreFunctionBlackBg
                    }
                    alt='{ordering}'
                  />
                </div>
                {this.state.StoreFunctionHoverIndex === 2 && (
                  <div>
                    <button
                      className='isp-home-store-function-nav add-margin-isp'
                      name='supportfunctions/storeordererrors'
                      onClick={(e) => {
                        this.homeRedirect(e);
                      }}
                    >
                      STORE ORDER ERRORS
                    </button>
                    <button
                      className='isp-home-store-function-nav'
                      name='supportfunctions/dsd-order-by-vendor'
                      onClick={(e) => {
                        this.homeRedirect(e);
                      }}
                    >
                      DSD ORDER BY VENDOR
                    </button>
                    <button
                      className='isp-home-store-function-nav isp-padding'
                      name='supportfunctions/transmitdeliverycalendar'
                      onClick={(e) => {
                        this.homeRedirect(e);
                      }}
                    >
                      TRANSMIT DELIVERY CALENDAR
                    </button>
                  </div>
                )}
                <div className='isp-content-heading isp-options-content isp-width'>
                  SUPPORT FUNCTIONS
                </div>
                <div className='isp-content'>
                  Access tools to assist with ordering needs.
                </div>
              </div>
            </div>
            {displayISPSpinner && (
              <div className='ISP-Overlay'>
                <div className='ISP-Spinner'>
                  <SpinnerComponent displaySpinner={displayISPSpinner} />
                </div>
              </div>
            )}
          </SideNavBar>
        </div>

        {showModal && (
          <MessageBox
            msgTitle=''
            msgBody={msgBoxBody}
            className={'message-box-ordering-unavailable'}
            initialModalState={false}
            modalAction={this.modalAction}
            homePage={true}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loginData: state.login.loginData.payload,
    storeProfileDetails:
      state &&
      state.stores &&
      state.stores.getStoreProfile &&
      state.stores.getStoreProfile.payload &&
      state.stores.getStoreProfile.payload.body,
    storeSelectedData: state.stores.storeSelected.payload
      ? state.stores.storeSelected.payload.data
      : [],
    selectedOption: {
      data: state.stores.storeSelected.payload
        ? state.stores.storeSelected.payload.data
        : [],
      key: state.stores.storeSelected.payload
        ? state.stores.storeSelected.payload.index
        : 0,
      label:
        state.stores.storeSelected.payload &&
        state.stores.storeSelected.payload.data
          ? `Store ${state.stores.storeSelected.payload.data.storeId} ${
              state.stores.storeSelected.payload.data.storeNickName
                ? state.stores.storeSelected.payload.data.storeNickName
                : ''
            } `
          : '',
      value:
        state.stores.storeSelected.payload &&
        state.stores.storeSelected.payload.data
          ? state.stores.storeSelected.payload.data.storeId
          : '',
    },
    availabilityStatusCheck:
      state.ordering &&
      state.ordering.getAvailabilityCheck &&
      state.ordering.getAvailabilityCheck.payload,
    orderingAvailabilityPayload:
      state.ordering &&
      state.ordering.getSystemStatus &&
      state.ordering.getSystemStatus.payload &&
      state.ordering.getSystemStatus.payload.data &&
      state.ordering.getSystemStatus.payload.data.body
        ? state.ordering.getSystemStatus.payload.data.body[0]
        : {},
  };
};

IspHome.defaultProps = {
  selectedOption: {
    data: [],
    key: 0,
    label: '',
    value: '',
  },
};

export default connect(mapStateToProps)(withRouter(IspHome));
