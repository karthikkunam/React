import React from 'react';
import './ErrorHandler.css';


export class ErrorHandler extends React.Component {
  // constructor(props){
  //   super(props);
  // }

  render() {
    return (
            <div>
                <div style={{"padding": "5px"}}>
                    <div className ="alert alert-danger" role="alert">
                            <p>There is an error in your request. Please contact IT support team.</p>
                     <hr/>
                            <p class="mb-0">{this.props.errorMessage.toString() || "Network Error"}.</p>
                    </div>
                </div>
             </div>
    );
  }
}



export default ErrorHandler;
