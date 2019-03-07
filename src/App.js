import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {UserIsAuthenticated, UserIsNotAuthenticated} from './helpers/auth';

import { Provider } from 'react-redux';
import store from './store';

import AppNavbar from './components/layout/AppNavbar';
import Dashhboard from './components/layout/Dashboard';
import Generatekey from './components/Hotel/Generatekey';
import Deletekey from './components/Hotel/Deletekey';
import AdminAuditLog from './components/Hotel/AdminAuditLog';
import UserAccessLog from './components/Hotel/UserAccessLog';
import Login from './components/auth/Login';



import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
      <div className="App">
      <AppNavbar />
      <div>
        <Switch>
           <Route exact path="/" component ={UserIsAuthenticated(Dashhboard)}/>
           <Route exact path="/generatekey" component = {UserIsAuthenticated(Generatekey)} />
           <Route exact path="/deletekey" component ={UserIsAuthenticated(Deletekey)} />
           <Route exact path="/AdminAuditLog" component ={UserIsAuthenticated(AdminAuditLog)} />
           <Route exact path="/UserAccessLog" component ={UserIsAuthenticated(UserAccessLog)} />
           <Route exact path="/login" component ={UserIsNotAuthenticated(Login)}/>
           />
           </Switch>
      </div>
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
