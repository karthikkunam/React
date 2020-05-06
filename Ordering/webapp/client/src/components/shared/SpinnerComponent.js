import React, { Component } from 'react';
import { Spinner } from 'reactstrap';

export class SpinnerComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            displaySpinner :false
        }
    }


    componentDidMount(){

        this.setState({ displaySpinner: this.props.displaySpinner})
    }

    componentWillReceiveProps(newProps){
        this.setState({ displaySpinner : newProps.displaySpinner})
    }

    render() {
        const { displaySpinner } = this.state;
        return (
        <div>
            { displaySpinner && 
                <div>
                    <Spinner type="grow" style={{ color : "#f37607" }} />
                    <Spinner type="grow" style={{ color : "#ef081e" }}/>
                    <Spinner type="grow" style = {{ color: "#008060"}} />
                </div>
            }
        </div>
        );
    }
}

export default SpinnerComponent;