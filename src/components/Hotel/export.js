import React, { Component } from 'react'; 
import PropTypes from 'prop-types';
import {compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Sidebar from '../layout/Sidebar';
import * as firebaseAdmin from 'firebase-admin';
import {firestoreExport} from 'node-firestore-import-export';

class ExportData extends Component {
  state = {
      mobile: '',
      logDetails: []
  };

handleSubmit = (event) => {
  const { firebaseAdmin } = this.props;
  const collectionRef = firebaseAdmin.firestore().collection('Users');
  var myJSON = JSON.stringify(collectionRef);

  firestoreExport(myJSON)
    .then(data=>console.log(data));
}

  render() {
    //const queryResul = this.state.queryResult;

    return (
      <div className="page-container row-fluid">
           <Sidebar/>
           <div className="page-content custom-position-right">
             <div className="container-fluid">
               <div className="row-fluid">
                 <div className="span12">
                   <h3 className="page-title">
                     Export Database
                     <br/>
                     <small>Export complete database</small>
                   </h3>
                 </div>
               </div>
               <hr></hr>
               <form>
                    <button type="button" name="export_key" className="btn btn-primary" onClick={this.handleSubmit}>Export Database</button>
              </form>
              <hr></hr>
             </div>
           </div>
       </div>
      );

}

}


ExportData.propTypes = {
  firestore: PropTypes.object.isRequired,
  firebaseAdmin: PropTypes.object.isRequired
};

export default compose(
firestoreConnect(),
)( ExportData );














import * as firebase from 'firebase-admin';
import {firestoreExport} from 'node-firestore-import-export';


firebase.initializeApp({
  apiKey: "AIzaSyD7vRWGur12k9MK7vRfa-glWcERDoVweD0",
  authDomain: "hotel-management-demo-73b23.firebaseapp.com",
  databaseURL: "https://hotel-management-demo-73b23.firebaseio.com",
  projectId: "hotel-management-demo-73b23",
  storageBucket: "hotel-management-demo-73b23.appspot.com",
  messagingSenderId: "183834401739"                
});


const collectionRef = firebase.firestore().collection('Users');
 
var myJSON = JSON.stringify(collectionRef);

firestoreExport(myJSON)
    .then(data=>
      console.log(data));
