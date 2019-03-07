import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Sidebar from '../layout/Sidebar';

 class AdminAuditLog extends Component {
  state = {
      mobile: '',
      logDetails: []
  };



handleChange(event) {
    this.setState({mobile: event.target.value})
}

handleSubmit = (event) => {
  event.preventDefault();
  const mobileNumber = this.state.mobile;

  if(!mobileNumber){
    alert("Please enter mobile number!");
  }else{
    const { firestore } = this.props;
    const queryResult=[];
    var that = this;
    const docRef = firestore.collection("UserLogs").where("UserMobile", "==", mobileNumber );
    docRef.get()
    .then(function(querySnapshot) {
          var countData = querySnapshot.size;
          if(countData !== 0){
            querySnapshot.forEach(function(doc) {
                if(doc.id){
                  var userData = doc.data();
                  queryResult.push({
                     id: doc.id,
                     UserMobile: userData.UserMobile,
                     OperationTime: userData.OperationTime,
                     Operation: userData.Operation,

                   });
                }
            });
            console.log(queryResult);
            that.setState({logDetails:queryResult});
            console.log(that.state.logDetails);
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
    //const queryResul = this.state.queryResult;

    return (
      <div className="page-container row-fluid">
           <Sidebar/>
           <div className="page-content custom-position-right">
             <div className="container-fluid">
               <div className="row-fluid">
                 <div className="span12">
                   <h3 className="page-title">
                     User Access Log
                     <br/>
                     <small>User Actions Log Here </small>
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
                    <th>Operation Date</th>
                   <th>Operation</th>
                  </tr>
                </thead>
                <tbody>
                    {this.state.logDetails.map(result =>(
                      <tr key={result.id}>
                        <td>{result.UserMobile}</td>
                        <td>{result.OperationTime}</td>
                        <td>{result.Operation}</td>
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