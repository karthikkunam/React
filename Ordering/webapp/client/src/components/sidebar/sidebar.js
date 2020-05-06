import React, { Component } from 'react'
import { Navbar, NavbarToggler } from 'reactstrap';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import path from '../../assets/images/path.png';
import shape from '../../assets/images/shape.png';
import shape_2 from '../../assets/images/shape_2.png';
import shape_3 from '../../assets/images/shape_3.png';
import Shape_Copy_66 from '../../assets/images/shape-copy-66.png';
import path_login from '../../assets/images/path_login.png';
import shape_3_login from '../../assets/images/shape_3_login.png';
import Shape_Copy_66_login from '../../assets/images/shape-copy-66-login.png';
import './sidebar.css'


export class SidebarExampleDimmed extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = { isOpen: this.props.isOpen  }

  };

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  toggle() {
    this.props.parentCallback(!this.state.isOpen);
    this.setState({
        isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="sidebar-container">
         <div id="mysidebar" style = {{ width: this.state.isOpen ? window.innerWidth / 2 : "0px", display: this.state.isOpen ? "block" : "none"}} className="sidebar">
            <Navbar color = "white" className = "col-6 col-md-9" light  expand="md">
                <NavbarToggler id = "sidebar-toggler" onClick={this.toggle} />
            </Navbar>

            { this.state && this.state.loginData ? 
              <div>
                <div>
                  <img id="Shape3" src= {shape_3_login}   alt = "shape_3"/>
                  <span className = "Profile-Copy"> Profile </span>
                </div>
                <hr/>
                <div>
                    <img id="Shape-Copy-66" src= {Shape_Copy_66_login}   alt = "Shape-Copy-66"/>
                    <span className = "Configuration-Copy"> Configuration </span>
                </div>
                <hr/>
                <div>
                  <img id="Path" src= {path_login}   alt = "Path"/>
                  <span className = "-Hub-Copy"> 7 Hub </span>
                </div>
                <hr/>
                <div>
                  <img id="Shape2" src= {shape_2}   alt = "shape_2"/>
                  <span className = "Print-Screen-Copy"> Print Screen </span>
                </div>
                <hr/>
                <div>
                  <img id="Shape" src= {shape}   alt = "shape"/>
                  <span className = "Help-Copy"> Help </span>
                </div>
              </div>
            : 
              <div>
                <div>
                  <img id="Shape3" src= {shape_3}   alt = "shape_3"/>
                  <span className = "Profile-Copy"> Profile </span>
                </div>
                <hr/>
                <div>
                    <img id="Shape-Copy-66" src= {Shape_Copy_66}   alt = "Shape-Copy-66"/>
                    <span className = "Configuration-Copy"> Configuration </span>
                </div>
                <hr/>
                <div>
                  <img id="Path" src= {path}   alt = "Path"/>
                  <span className = "-Hub-Copy"> 7 Hub </span>
                </div>
                <hr/>
                <div>
                  <img id="Shape2" src= {shape_2}   alt = "shape_2"/>
                  <span className = "Print-Screen-Copy"> Print Screen </span>
                </div>
                <hr/>
                <div>
                  <img id="Shape" src= {shape}   alt = "shape"/>
                  <span className = "Help-Copy"> Help </span>
                </div>
              </div>
            }
      </div>
           <div style = {{ display: this.state.isOpen ? "block" : "none"}} className="sidebar-overlay"></div>
      </div>
   
    )
  }
}

const mapStateToProps = state => 
  {
    return ({
      loginData: state.login.loginData.payload,
    }
    );
}

SidebarExampleDimmed.propTypes = {
    parentCallback: PropTypes.func,
  };
  
  SidebarExampleDimmed.defaultProps = {
    isOpen: false,
    parentCallback: () => {}
  };
  

export default  connect(
  mapStateToProps
)((SidebarExampleDimmed))