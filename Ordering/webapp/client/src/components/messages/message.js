import React, { Component } from 'react';
import { connect } from 'react-redux';
import { orderingSelectedLink } from '../../actions/index'
// import { SAVE_TIME_INTERVAL } from '../utility/constants'
import './message.css';
// import * as moment from 'moment';


class Message extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    let message = this.props.location.state ? this.props.location.state : this.props.message;
    this.setState({
      title: message ? message.title : "",
      body: message ? message.body : ""
    });
    this.props.dispatch(orderingSelectedLink({
      selectedLink: 'Message',
  }));
    // this.setTimeInterval();

  }

//   setTimeInterval = () => {
//     console.log("set timeinterval for unautorized or session expired\n", moment().format("MM ddd, YYYY hh:mm:ss a"));
//     this.logoutTimeInterval = setInterval(this.closeWindow, SAVE_TIME_INTERVAL);
// };

  componentWillReceiveProps(newProps){
    if(newProps && newProps.title && newProps.body){
      this.setState({
        title: newProps.title,
        body: newProps.body
      })
    }
  }

  closeWindow() {
    window.open("about:blank", "_self");
    window.close();
  }
  render() {
    return (
      <div className="vertical-center">
        <div className="container">
          <div className="message-title">{this.state.title}</div>
          <div className="message-body" dangerouslySetInnerHTML={{__html: this.state.body}}></div>
        {/* <div className="button-container"> 
        {
          this.state.title === "Unauthorized" ?
          <button type='button' className='message-btn' onClick={this.closeWindow}>Close</button> 
          : null
        }
        </div> */}
      </div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return ({
    body : state.session.messageData && state.session.messageData.payload && state.session.messageData.payload.body ? state.session.messageData.payload.body : "",
    title : state.session.messageData && state.session.messageData.payload && state.session.messageData.payload.title ? state.session.messageData.payload.title : "",
  }
  );
}

export default connect(
  mapStateToProps
)((Message))
