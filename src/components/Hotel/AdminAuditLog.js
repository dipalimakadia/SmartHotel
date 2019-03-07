import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Sidebar from '../layout/Sidebar';

 class AdminAuditLog extends Component {
  state = {
      mobile: '',
      queryResult: []
  };



handleChange(event) {
    this.setState({mobile: event.target.value})
}

onDeleteClick  = (event) => {

 const { firestore } = this.props;

 firestore.collection("UserKeys").where("Deleted", "==", false)
   .get()
   .then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
         console.log(doc.id, " => ", doc.data());
//           // Build doc ref from doc.id*/
          firestore.collection("UserKeys").doc(doc.id).update({Deleted: true});
       });

  })

}


handleSubmit = (event) => {
  event.preventDefault();
  const mobileNumber = this.state.mobile;

  if(!mobileNumber){
    alert("Please enter mobile number!");
  }else{
    const { firestore } = this.props;
    const queryResult=[];
    const that = this;
    const docRef = firestore.collection("AdminUsers").where("AdminUserMobile", "==", mobileNumber );
    docRef.get()
    .then(function(querySnapshot) {
          var countData = querySnapshot.size;
          if(countData !== 0){
            querySnapshot.forEach(function(doc) {
                if(doc.id){
                  var userData = doc.data();
                  const UserFkey = userData.UserFkey;

                  const docRef = firestore.collection("UserKeys").where("GeneratedBy", "==", UserFkey );
                  docRef.get()
                  .then(function(queryLogSnapshot) {
                        var countLogData = queryLogSnapshot.size;
                        if(countLogData !== 0){
                          queryLogSnapshot.forEach(function(docReflog) {
                              if(docReflog.id){
                                var logData = docReflog.data();
                                if(logData.Deleted){

                                }

                              }
                          });

                          that.setState({queryResult:queryResult});
                        }else{
                          alert("Mobile number not registered yet!");
                        }
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
                }
            });

            that.setState({queryResult:queryResult});
          }else{
            alert("Mobile number not registered yet!");
          }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  }
}

  render() {
    const queryResul = this.state.queryResult;

    return (
      <div className="page-container row-fluid">
           <Sidebar/>
           <div className="page-content custom-position-right">
             <div className="container-fluid">
               <div className="row-fluid">
                 <div className="span12">
                   <h3 className="page-title">
                     Admin Audit Log
                     <br/>
                     <small>Admin Audit Log Here </small>
                   </h3>
                 </div>
               </div>
               <hr></hr>
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
                  <tr>
                    <th>Mobile</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                   <th> Action</th>
                  </tr>
                </thead>
                <tbody>
                {queryResul.map(result =>(
                  <tr key={result.id}>
                    <td>{result.Mobile}</td>
                    <td>{result.StartDate}</td>
                    <td>{result.EndDate}</td>

                   <td> <button   onClick={this.onDeleteClick}  id={`${result.id}`} className="btn btn-danger">Delete</button> </td>
                  </tr>

                ))}

                </tbody>
              </table>
             </div>
           </div>
       </div>
      );

}

}


AdminAuditLog.propTypes = {
  firestore: PropTypes.object.isRequired
};

export default compose(
firestoreConnect(),
)( AdminAuditLog );
