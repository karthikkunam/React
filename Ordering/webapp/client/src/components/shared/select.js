import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

import './select.css';

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span id = "search-icon" className="fa fa-search form-control-feedback"></span>
      </components.DropdownIndicator>
    )
  );
};

export class SelectStore extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input: '',
      data: []
    }
  }

  noOptionsMessage() {
    return 'No Stores found';
  }

  onInputChange = (input) => {
    if(input || this.state.input.length === 1 ){
      this.setState({input: input},()=> {
        setTimeout(() => {
        this.props.onInputChange(this.state.input)
      }, 100); 
      });
    }
  }

  onBlur (e) {
    const input = e.target.value;
    setTimeout(() => {
      this.setState({input: input},()=> {
        this.props.onInputChange(this.state.input)
      });
    }, 1); 
    
  }

  componentWillReceiveProps(newProps) {
    this.setState({ 
      data: newProps.data
    })
  }


  render() {
    return (
      <Select 
        inputValue={this.state.input}
        name="storeSearch"
        className="basic-single"
        classNamePrefix="select"
        placeholder={this.props.placeholder ? this.props.placeholder : 'Store Search'}
        value={this.props.val.label ? this.props.val : 'Store Search'}
        components = {{DropdownIndicator}}
        onChange={this.props.handleChange}
        onInputChange={this.onInputChange}
        options={this.state.data}
        maxMenuHeight = {160}
        searchable = {false}
        menuIsOpen = {this.props.menuIsOpen && this.state.input? true: false}
        noOptionsMessage={ this.noOptionsMessage }
        onBlur={(e) => this.onBlur(e)}
        
      />
    );
  }
}

SelectStore.propTypes = {
  val: PropTypes.object,
  data: PropTypes.array,
  handleChange: PropTypes.func
}

SelectStore.defaultProps = {
  val: {},
  data: [],
  handleChange: () => {}
}

export default SelectStore;