import React from 'react'
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import {LoginReducer} from '../../actions'
import './Login.css'

export class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      userId: '',
      password: '',
      invalidUser:false,
      invalidPassword:false,
      noData: false
    };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.usersInfo = [
      {userId:'40',password:'711290', isMultiStoreOwner: true},
      {userId:'41',password:'711291', isMultiStoreOwner: false},
      {userId:'42',password:'711292', isMultiStoreOwner: true}
    ]; 

    // if(window.innerWidth < 768){
    //   document.querySelector("body").style.backgroundImage="url("+ require('../../assets/images/7-11-home.png') +")";
    // }else{
    //   document.querySelector("body").style.backgroundImage="url("+ require('../../assets/images/group-2.png') +")";
    // }
  }
  
  handleValidation(){
    const userId = this.state.userId;
    const password = this.state.password;
     if(((userId && userId.length)) && (password && password.length)){
         return true;
        }else{
          this.setState({noData:true});
        }
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.handleValidation()){
        this.usersInfo.forEach((userInfo)=>{
          if((userInfo.userId === this.state.userId) && (userInfo.password === this.state.password)){
              this.props.dispatch(LoginReducer({ id: this.state.userId, isMultiStoreOwner: userInfo.isMultiStoreOwner, storeId: 36312 }));
              this.props.history.push('/home');
            }else{
              this.setState({error: true});
          }
        });
      } 
  }

  handleChange(event){
    this.setState({noData:false});
    this.setState({error: false});
    const {name, value} = event.target
    this.setState({[name]: value})
    
  }

  render() {
    return (
     <div className="container-fluild">
       <div className="wrapper center-block form-centered">
        <div id="formContent">
          <form id="login-form" className="form-styling" onSubmit={(e) => this.handleSubmit(e)}>
            <div className="form-group">
              <input type="text" autoComplete="off" id="userId" value = {this.state.id} onChange={(e) => {this.handleChange(e)}} name="userId" placeholder="User ID"/>
              {/* {this.state.invalidUser && <div className="error-msg">UserID must be numeric and limited to 4 characters</div>} */}

              <input type="password" autoComplete="off" id="password" value = { this.state.password } name="password" onChange={(e) => {this.handleChange(e)}} placeholder="Password" />
              {/* {this.state.invalidPassword && <div className="error-msg">Password is required</div>} */}
            </div>
            <div style={{'height': '35px'}}>
              {this.state.error ? <div className="error-msg">You entered an incorrect User ID or Password</div> : <div/>}
              {this.state.noData ? <div className="error-msg">Please enter User ID and Password</div> : <div/> }
            </div>
            <input type="submit" className="login-submit" value="LOGIN" />
          </form>
          {/* <div id="formFooter">
            <a className="underlineHover" href="#">Forgot Password?</a>
          </div> */}
        </div>
      </div>
     </div>
    )
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
)(withRouter(Login))

