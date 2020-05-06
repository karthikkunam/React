import React, { Component } from 'react';
import { persistStore } from 'redux-persist';
import { connect } from 'react-redux';
import {LoginReducer} from '../../actions';

export class Logout extends Component {

    constructor(props){
        super(props);
        persistStore(this.props).purge();
        this.props.dispatch(LoginReducer(false));
        window.location.reload();
    }
    render() {
        return (
            <div/>
        );
    }
}

const mapStateToProps = state => 
  {
    return ({
      loginData: state.login.loginData.payload
    }
    );
}

export default  connect(
  mapStateToProps
)((Logout))