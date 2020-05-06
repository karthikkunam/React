import React, { Component } from 'react';
import Toggle from 'react-toggle';
import './Toggle.css';

export class ToggleButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            isSelected:true,
            disabled: false
        }
    }
    onToggle = () => {
        this.setState ({ isSelected: !this.state.isSelected },()=>{
            this.props.toggler(this.state.isSelected)
        })
    }

    componentDidMount(){

        this.setState({ isSelected: this.props.isSelected})
    }

    componentWillReceiveProps(newProps){
        this.setState({ isSelected : newProps.isSelected, disabled : newProps.disabled})
    }

    render() {
        return (
        <span>
            { this.props.toggleText && this.props.toggleText[0] &&
                <span className = "toggle-text" >{this.props.toggleText[0]}</span>
            }
            <span className = "table-margin"></span>
            <label>
                <Toggle
                    checked={this.state.isSelected}
                    disabled={this.state.disabled}
                    onChange={this.onToggle} />
            </label>
            <span className = "table-margin"></span>
            { this.props.toggleText && this.props.toggleText[1] &&
                <span className = "toggle-text"  >{this.props.toggleText[1]}</span>
            }   
        </span>
        );
    }
}

export default ToggleButton;