import React, { Component } from 'react';
import { connect } from 'react-redux';
import './launch.css';
import { LoginReducer } from '../../actions';
import Axios from 'axios';
import SpinnerComponent from '../shared/SpinnerComponent';
import { UNAUTHORIZED_TITLE, UNAUTHORIZED_MSG } from '../utility/constants';
import { withRouter } from 'react-router-dom';

class Launch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rToken: this.props.match.params.token,
            displayLoadingSpinner: true
        }
    }

    componentDidMount() {
        let launchToken = this.state.rToken;
        this.props.dispatch(LoginReducer({}));
        //console.log("launch loaded");

        Axios.get('/7boss/order/auth/launch/' + launchToken)
            .then(res => {
                const token = res.data;
                //console.log('Response ------->', res);
                this.setState({ displayLoadingSpinner: false });
                this.props.dispatch(LoginReducer(token));
                this.props.history.push({ pathname: '/home'});
                // window.location.replace(`/7boss/home`);
            })
            .catch((error) => {
                //console.log("error in launch---->>>",error);
                this.setState({ displayLoadingSpinner: false });
                this.props.history.push({ pathname: '/message', state: { title: UNAUTHORIZED_TITLE, body: UNAUTHORIZED_MSG } });
            });
    }

    render() {
        const { displayLoadingSpinner } = this.state;

        return (
            <div className="launch-spinner" >
                <SpinnerComponent displaySpinner={displayLoadingSpinner} />
            </div>
        )
    }
}

export default connect(
    null
)(withRouter(Launch))