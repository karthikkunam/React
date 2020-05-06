import React from 'react'
import Routes from '../routes'
import './App.css';
// import '../components/ordering/OrderingHome.css'
import { connect } from 'react-redux';
import { messageData } from '../actions';
import { UNAUTHORIZED_TITLE, UNAUTHORIZED_MSG } from '../components/utility/constants';
import SpinnerComponent from '../components/shared/SpinnerComponent';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.props.dispatch(messageData({
      title: UNAUTHORIZED_TITLE, body: UNAUTHORIZED_MSG
    }));
  }


  componentWillMount() {
    if (window && window.location && window.location.href && window.location.href.indexOf('7boss/launch')) {
      let url = window.location.href;
      if (url.indexOf('/7boss/order/') < 0) {
        window.location.href = url.replace('/7boss/', '/7boss/order/');
      }
    }
  }

  render() {
    return (
      <div className = "full-height">
        {window && window.location && window.location.href && window.location.href.indexOf('/7boss/order/') > 0 ?
          <Routes message={{ title: UNAUTHORIZED_TITLE, body: UNAUTHORIZED_MSG }} /> :
          <div className="item-detail-spinner-component">
            <div className="app-spinner">
              <SpinnerComponent displaySpinner={true} />
            </div>
          </div>
        }

      </div>
    )
  }
}

export default connect(
  null
)((App))