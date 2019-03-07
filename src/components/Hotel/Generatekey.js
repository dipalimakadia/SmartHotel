import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Sidebar from '../layout/Sidebar';
import moment from 'moment';
import "imrc-datetime-picker/dist/imrc-datetime-picker.css";
import {DatetimePickerTrigger} from 'imrc-datetime-picker';
import axios from 'axios';
import Select from 'react-select';
import firebase from 'firebase';


 class Generatekey extends Component {

    state = {
        mobile: '',
        from_date: moment(),
        to_date: moment(),
        room_id: '',
        ttAccessToken: '',
        lockId: '',
        ttClientId: '',
        roomDetails: [],
        hasError: false,
        alertType: '',
        errorMsg: '',
        logged_user_id: ''
    };
    componentDidMount() {
        this.getRoomDetails();
        this.authListener();
    }
    getRoomDetails(){
      const { firestore } = this.props;
      const roomDetails = [];

      const docRef = firestore.collection("Rooms");
      docRef.where("RoomActive", "==", true);
      docRef.get()
      .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if(doc.id){
                  var roomData = doc.data();
                  roomDetails.push({
                     label: roomData.RoomDescription + " - " + roomData.RoomNumber,
                     value: doc.id
                   });
                }
            });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
      this.setState({roomDetails: roomDetails});
    }
    authListener() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({logged_user_id:user.uid})
            }
        });
    }
    fromChange = from_date => this.setState({ from_date });
    toChange = to_date => this.setState({ to_date });
    onRoomChange = room_id => this.setState({ room_id });

    handleChange(event) {
        this.setState({mobile: event.target.value})
    }

    handleSubmit = (event) => {
      event.preventDefault();
      const mobileNumber = this.state.mobile;
      const room_id = this.state.room_id.value;
      const from_date = moment(this.state.from_date).format('YYYY-MM-DD HH:mm');
      const to_date = moment(this.state.to_date).format("YYYY-MM-DD HH:mm");
      const ttStartDate = 0;
      const ttEndDate = 0;
      const ttCreationDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const that = this

      if(!mobileNumber){
        that.setState({ hasError: true });
        that.setState({errorMsg: "Please enter mobile number!"});
        that.setState({alertType: "alert alert-danger"});
      }else{
        const { firestore } = this.props;

        if(!room_id){
          that.setState({ hasError: true });
          that.setState({errorMsg: "Please select a room!"});
          that.setState({alertType: "alert alert-danger"});
        }else{
            // Getting Room Deatils
            const roomRef = firestore.collection("Rooms");
            roomRef.doc(room_id);
            roomRef.get()
            .then(function(querySnapshot) {
                  querySnapshot.forEach(function(room) {
                        var roomData = room.data();
                        const ttClientId = roomData.LockClientId;
                        const lockId = roomData.LockId;
                        const ttAccessToken = roomData.LockAccessToken;
                        that.setState({ ttAccessToken });
                        that.setState({ lockId });
                        that.setState({ ttClientId });
                  });
            })
            .catch(function(error) {
              that.setState({ hasError: true });
              that.setState({errorMsg: "Room not available!"});
              that.setState({alertType: "alert alert-danger"});
            });

            // Getting User Deatils
            const docRef = firestore.collection("Users").where("UserMobile", "==", mobileNumber);
            docRef.get()
            .then(function(querySnapshot) {
                  var countData = querySnapshot.size;
                  if(countData !== 0){
                    querySnapshot.forEach(function(doc) {
                        if(doc.id){
                          const userData = doc.data();
                          const ttReceiverUsername = userData.TtName;

                          console.log(userData);
                          if(that.state.ttAccessToken != null && ttReceiverUsername != null){

                               axios.get('https://api.ttlock.com.cn/v3/key/send', {
                                      params: {
                                                clientId : that.state.ttClientId,
                                                accessToken : that.state.ttAccessToken,
                                                lockId : that.state.lockId,
                                                receiverUsername : ttReceiverUsername,
                                                startDate : ttStartDate,
                                                endDate : ttEndDate,
                                                date : moment().valueOf()
                                              }

                              })
                              .then(res => {
                                console.log(res);
                              })

                            // Adding data to User Key and Admin Log
                            const userKeyData = {
                                EndDate: to_date,
                                GenerationDate: ttCreationDate,
                                GeneratedBy: that.state.logged_user_id,
                                Mobile: mobileNumber,
                                StartDate: from_date,
                                TtAccessToken: that.state.ttAccessToken,
                                Deleted: false,
                                Expired: false
                            };

                            firestore.collection("UserKeys").doc().set(userKeyData);

                            that.setState({ hasError: true });
                            that.setState({errorMsg: "Key generated successfully!"});
                            that.setState({alertType: "alert alert-success"});

                            // if(userData.UserFKey != ''){
                            //     // Adding Audit for Admin
                            //     const adminAuditData = {
                            //         ActionOn: ttCreationDate,
                            //         AdminUserAction: 'Created',
                            //         AdminUserFKey: that.state.logged_user_id,
                            //         UserKey: userData.UserFKey
                            //     };
                            //     const adminAudit = firestore.collection("AdminAuditLog").doc().set(adminAuditData).then(function() {
                            //           that.setState({ hasError: true });
                            //           that.setState({errorMsg: "Key generated successfully!"});
                            //           that.setState({alertType: "alert alert-success"});
                            //     });
                            // }


                          }else{
                            that.setState({ hasError: true });
                            that.setState({errorMsg: "Some internal problem with registration!"});
                            that.setState({alertType: "alert alert-danger"});
                          }
                        }
                    });
                  }else{
                    that.setState({ hasError: true });
                    that.setState({errorMsg: "Mobile number not registered yet!"});
                    that.setState({alertType: "alert alert-danger"});
                  }
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            if(this.state.isQueryIDAvailable){
              alert("Query found!");
            }
        }

      }


    }
    render() {
        const roomDetails = this.state.roomDetails;
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
                           Generate Keys
                           <br/>
                           <small style= {{ color: 'green', fontSize: '50px'}}>Generate a new key by Mobile Number </small>
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
                                <div className="form-group col-md-6">
                                    <label htmlFor="room">Room</label>
                                    <Select options={roomDetails} onChange={this.onRoomChange} name="room_id"/>
                                </div>
                          </div>
                          <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="title">Start Date</label>
                                    <DatetimePickerTrigger
                                      moment={this.state.from_date}
                                      onChange={this.fromChange}
                                      showTimePicker={true}>
                                      <input type="text" className="form-control" value={this.state.from_date.format('YYYY-MM-DD HH:mm')} readOnly />
                                    </DatetimePickerTrigger>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="title">Start Date</label>
                                    <DatetimePickerTrigger
                                      moment={this.state.to_date}
                                      onChange={this.toChange}
                                      showTimePicker={true}>
                                      <input type="text" className="form-control" value={this.state.to_date.format('YYYY-MM-DD HH:mm')} readOnly />
                                    </DatetimePickerTrigger>
                                </div>
                          </div>
                          <button type="button" name="generate_key" className="btn btn-primary" onClick={this.handleSubmit}>Generate Key</button>
                        </form>
                   </div>
                 </div>
             </div>
          )
    }
}

Generatekey.propTypes = {
    firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(),
)(Generatekey);
