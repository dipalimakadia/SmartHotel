import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {compose } from 'redux';
import {connect} from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';


class AppNavbar extends Component {
   state = {
     isAuthenticated: false
   }

   static getDerivedStateFromProps(props, state){
     const { auth } = props;

     if(auth.uid){
       return { isAuthenticated: true}

     } else {
      return {isAuthenticated: false}
   }
  }

  onLogoutClick = (e) => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();

  };


  render() {
    const {isAuthenticated} = this.state;

    return (
      <span>
      {isAuthenticated ? (
      <div className="header navbar navbar-inverse navbar-fixed-top">
          <div className="navbar-inner">
            <div className="container-fluid">
              <a className="brand" href="/">
              <img src="assets/images/mbt-logo.png" alt="logo" />
              </a>
              <a href="javascript:;" className="btn-navbar collapsed" data-toggle="collapse" data-target=".nav-collapse">
              <img src="assets/img/menu-toggler.png" alt="" />
              </a>
              <ul className="nav pull-right">
                <li><a href="#" className="nav-link"
                  onClick={this.onLogoutClick} >
                  <i className="icon-signout"></i> Logout
                 </a></li>
              </ul>
            </div>
          </div>
        </div>
        ): null }
        </span>


    );
  }
}
AppNavbar.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth,
    settings: state.settings
  }))
)(AppNavbar);
