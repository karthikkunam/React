import 'babel-polyfill';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import SessionManager from './components/session/SessionManager';

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
/* Adding for persisting Redux store info into local cache*/
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' 
import { PersistGate } from 'redux-persist/integration/react';
import sessionStorage from 'redux-persist/es/storage/session';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './containers/App.css'
import reducer from './reducers'
import App from './containers/App'
// import storeInstance from '../src/api/orderingInfo'
import '../src/components/shared/loader.css'

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

// storeInstance.interceptors.request.use(request => {
//     document.body.classList.add('loading-indicator');
//     return request;
//         }, error => {
//     document.body.classList.remove('loading-indicator');
//     return Promise.reject(error);
// });

// storeInstance.interceptors.response.use(response => {
//     document.body.classList.remove('loading-indicator');
//     return response;
//         }, error => {
//     document.body.classList.remove('loading-indicator');
//     return Promise.reject(error);
// });

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
)

/**Setting counter to launch the 09:50 - 10:00 modals */
sessionStorage.setItem('counter10Mins', 0);
sessionStorage.setItem('counter5Mins', 0);
sessionStorage.setItem('homeCounter', 0);
sessionStorage.setItem('orderCutOffCounter', 0);

const EnhancedComponent = SessionManager(App);
let persistor = persistStore(store)
export default store;
render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
       <EnhancedComponent/>
      </PersistGate>
  </Provider>,
  document.getElementById('root')
)
