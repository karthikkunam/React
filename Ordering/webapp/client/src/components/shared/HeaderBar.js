import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

export class HeaderBar extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        storeFunctionValues: []
      }
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.previous) {
            this.setState({
                storeFunctionValues: [...this.state.storeFunctionValues, nextProps.value]
            });
        } else {
            this.setState({ storeFunctionValues: this.state.storeFunctionValues.slice(0,-1) });
        }
    }

    handleClick = (index, data) => {
        this.setState({ storeFunctionValues: this.state.storeFunctionValues.slice(0, index) }, () => {
            this.props.parentCallback(index, data);
        });
    }

    render() {
        return (
            <div>
                <Breadcrumb>
                     {this.state.storeFunctionValues && this.state.storeFunctionValues.map((data,index) => {
                         return(
                            <BreadcrumbItem key={index} active={this.state.storeFunctionValues.length-1 === index}>
                                <a onClick={() => this.handleClick(index, data)}>{data}</a>
                            </BreadcrumbItem>
                         )
                     })
                     }
                </Breadcrumb>
            </div>
        );
    }
};

export default HeaderBar;