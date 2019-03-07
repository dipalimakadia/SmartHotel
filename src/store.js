import { createStore, combineReducers, compose } from 'redux'
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer} from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';

import notifyReducer from './reducers/notifyReducer';



const firebaseConfig = {
  apiKey: "AIzaSyD7vRWGur12k9MK7vRfa-glWcERDoVweD0",
  authDomain: "hotel-management-demo-73b23.firebaseapp.com",
  databaseURL: "https://hotel-management-demo-73b23.firebaseio.com",
  projectId: "hotel-management-demo-73b23",
  storageBucket: "hotel-management-demo-73b23.appspot.com",
  messagingSenderId: "183834401739"
};

//react-redux-firebaseConfig
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true
}

//init firebase instance
firebase.initializeApp(firebaseConfig);

//init firestore
const firestore = firebase.firestore();
const settings ={ timestampsInSnapshots: true};
 firestore.settings(settings);

const createStoreWithFirebase = compose (
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    notify: notifyReducer,
    
});

//check for settings in local storage
if(localStorage.getItem('settings') == null){
   // default settings
   const defaultSettings = { allowRegistration: false
  }
  //set to localstorage
  localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

//create intial state
const initialState = {settings: JSON.parse(localStorage.getItem('settings'))};

//create store

const store = createStoreWithFirebase(
    rootReducer,
    initialState,
    compose(
    reactReduxFirebase(firebase)
));

export default store;
