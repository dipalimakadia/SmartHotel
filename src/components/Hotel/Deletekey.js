import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Sidebar from '../layout/Sidebar';
import moment from 'moment';
import firebase from 'firebase';

 class Deletekey extends Component {
   state = {
       mobile: '',
       userKeyData: [],
       hasError: false,
       alertType: '',
       errorMsg: '',
       logged_user_id: ''
   };

   componentDidMount() {
       this.authListener();
   }
   /**
   * Authentication Data assignment
   */
   authListener() {
       firebase.auth().onAuthStateChanged(user => {
           if (user) {
               this.setState({logged_user_id:user.uid})
           }
       });
   }
   /**
   * Mobile no. change state
   */
   handleChange(event) {
       this.setState({mobile: event.target.value})
   }
   /**
   * Search Operation
   */
   handleSubmit = (event) => {
     event.preventDefault();
     const mobileNumber = this.state.mobile;
     const that = this;
     if(!mobileNumber){
       alert("Please enter mobile number!");
     }else{
       const { firestore } = this.props;
       const queryResult=[];
       const them = this;


       const UserRef = firestore.collection("Users").where("UserMobile", "==", mobileNumber);
    UserRef.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

          const userdata = doc.data();
          const name = userdata.UserName;
            // doc.data() is never undefined for query doc snapshots
            console.log(name);
            them.setState ({name});
        }); 
        
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });




       const docRef = firestore.collection("UserKeys").where("Mobile", "==", mobileNumber);
       docRef.get()
       .then(function(querySnapshot) {
               querySnapshot.forEach(function(doc) {
                   if(doc.id){
                     const userData = doc.data();
                     if(!userData.Deleted){
                       queryResult.push({
                            mobile: userData.Mobile,
                            startDate: userData.StartDate,
                            endDate: userData.EndDate,
                            id: doc.id
                        });
                     }
                   }
               });
               that.setState({userKeyData: queryResult});
       })
       .catch(function(error) {
           console.log("Error getting documents: ", error);
       });

     }
   }
   /**
   * Delete Operation
   */
   onDeleteClick  = (event) => {
       if(window.confirm("Are you really want to Delete this key?")){
         const userKeyId = event.target.id;
         const { firestore } = this.props;
         const deletionDate = moment().format("YYYY-MM-DD HH:mm:ss");
         firestore.collection("UserKeys").doc(userKeyId).update({Deleted: true});
         firestore.collection("UserKeys").doc(userKeyId).update({DeletionDate:deletionDate});
         firestore.collection("UserKeys").doc(userKeyId).update({DeletedBy:this.state.logged_user_id});

         this.setState({ hasError: true });
         this.setState({errorMsg: "The Key Deleted Successfully!"});
         this.setState({alertType: "alert alert-success"});

         this.handleSubmit(event);
       }
   }
   render() {
        const erclassName = this.state.hasError ? '' : 'hide';
        const alertTypeCls = this.state.alertType;

       

        return (
          <div className="page-container row-fluid">
               <Sidebar/>
               <div className="page-content custom-position-right">
                 <div className="container-fluid">
                   <div className="row-fluid">
                     <div className="span12">
                       <h3 className="page-title">
                         Delete Keys
                         <br/>
                         <small>Delete key by Mobile Number </small>
                       </h3>
                     </div>
                   </div>
                   <hr></hr>
                   <div className={erclassName}>
                      <div className={alertTypeCls}>
                        <span>{this.state.errorMsg}</span>
                      </div>
                   </div>
                   <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="mobile">Mobile</label>
                                <input type="text" className="form-control" name="mobile" value={this.state.mobile} onChange={this.handleChange.bind(this)}/>
                            </div>
                        </div>
                        <button type="button" name="delete_key" className="btn btn-primary" onClick={this.handleSubmit}>Search Key</button>
                  </form>
                  <hr></hr>
                  <table className="table">
                    <thead>
                      <tr><th>Name: {this.state.name}</th></tr>
                      <br/>
                      <tr>
                        <th>Mobile</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.state.userKeyData.map(userKey =>(
                           <tr key={userKey.id}>
                             <td>{userKey.mobile}</td>
                             <td>{userKey.startDate}</td>
                             <td>{userKey.endDate}</td>
                             <td><button   onClick={this.onDeleteClick}  id={`${userKey.id}`} className="btn btn-danger">Delete</button></td>
                           </tr>
                        ))}
                    </tbody>
                  </table>
                 </div>
               </div>
           </div>
          )
    }
}

Deletekey.propTypes = {
    firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(),
)(Deletekey);
