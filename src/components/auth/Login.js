import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {compose } from 'redux';
import {connect} from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { notifyUser } from '../../actions/notifyActions';

import '../../assets/css/login.css';
import { firestoreConnect } from 'react-redux-firebase';


class Login extends Component {
   state = {
       phone: '',
	     password: '',
       hasError: false,
       errorMsg: ''
   };

 handleClick= () => {

    const { firebase, firestore } = this.props;
    const { phone, password } = this.state;
		const email = phone+"@motesandbots.com";

    const that = this
 		var docRef = firestore.collection("AdminUsers").where("AdminUserMobile", "==", phone);
		docRef.where("AdminUserActive", "==", "Y")
		docRef.get()
		.then(function(querySnapshot) {
      var countData = querySnapshot.size;
      if(countData !== 0){
				firebase.login({
					email,
					password
				}).catch(function(error) {
          that.setState({ hasError: true });
          that.setState({errorMsg: "Invalid login credential!"});
        });
			}else{
        that.setState({ hasError: true });
        that.setState({errorMsg: "You are not authorised to Login"});
      }
		}).catch(function(error) {
        console.log("Error getting documents: ", error);
    });

   };

   onChange = e => this.setState({[e.target.name]: e.target.value });

   render() {
      var erclassName = this.state.hasError ? '' : 'hide';
      return (
          <div className="login login-overlay">
        		<div className="content content-login">
        			<form className="form-vertical login-form" >
        				<h3 className="form-title">Login to your account</h3>
                <div className={erclassName}>
          				<div className="alert alert-danger">
          					<span>{this.state.errorMsg}</span>
          				</div>
                </div>
        				<div className="control-group">
        					<label className="control-label visible-ie8 visible-ie9"  htmlFor="phone">Phone</label>
        					<div className="controls">
        						<div className="input-icon left">
        							<i className="icon-phone"></i>
        							<input className="m-wrap placeholder-no-fix form-control" type="text" autocomplete="off" placeholder="Mobile" name="phone" required
                                    value={this.state.phone}
                                    onChange={this.onChange}/>
        						</div>
        					</div>
        				</div>
        				<div className="control-group">
        					<label className="control-label visible-ie8 visible-ie9" htmlFor="password">Password</label>
        					<div className="controls">
        						<div className="input-icon left">
        							<i className="icon-lock"></i>
        							<input className="m-wrap placeholder-no-fix form-control" type="password" autocomplete="off" placeholder="Password" name="password" required
                                    value={this.state.password}
                                    onChange={this.onChange}/>
        						</div>
        					</div>
        				</div>
        				<div className="form-actions">

        					<button type="button" className="btn btn-primary pull-right form-control" onClick = {this.handleClick} >
        					Login <i className="m-icon-swapright m-icon-white"></i>
        					</button>
                  <label className="checkbox">
        					<input type="checkbox" name="remember" value="1"/> Remember me
        					</label>
        				</div>
        				
        			</form>
        		</div>
  		   </div>
      )
    }
}

Login.propTypes = {
	firebase: PropTypes.object.isRequired,
	firestore: PropTypes.object.isRequired,
    notify: PropTypes.object.isRequired,
    notifyUser: PropTypes.func.isRequired
};

export default compose(
	firebaseConnect(),
	firestoreConnect(),
    connect((state, props) => ({
       notify: state.notify
    }),
    { notifyUser }
    )
)(Login);
