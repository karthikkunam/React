import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ErrorNotFound.css'

  class ErrorNotFound extends Component {

    // constructor(props){
    //     super(props);
    //     /* Added to reset the default image on login page*/
    //     //document.querySelector("body").style.backgroundImage='none';
    // }
    render() {
        return (
         
            <div>
                <div id="notfound">
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>4<span>0</span>4</h1>
                    </div>
                     <div>
                     <Link to={`/`} >The page you are looking does not exist. Please click to redirect to home page</Link>
                     </div>
                </div>
                </div>
            </div>
            
        );
    }
}


const mapStateToProps = state => 
  {
    return ({
      login: state.login
    }
  );
}

export default  connect(
  mapStateToProps
)((ErrorNotFound))