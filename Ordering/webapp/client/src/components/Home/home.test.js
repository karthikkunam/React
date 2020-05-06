import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {Home} from './Home';

let store,wrapped;
beforeEach(()=>{
    wrapped = shallow(
                   <Home store={store} dispatch = {random}/>
                );
    wrapped.setProps({ dispatch: random, parentCallback: random , history: { push: random }});
  });

  const initialState = {
    login: { loginData : { payload : { id: "40", isMultiStoreOwner: true}} },
    stores: { 
      getStoreProfile: { payload: [
      {
        "storeId": "27367",
        "address": {
          "streetAddress": "4901 LITTLE RD",
          "city": "ARLINGTON",
          "state": "TX",
          "zip": "760171964",
          "country": "US",
          "phone": 8174834469
        }
      },
      {
        "storeId": "12200",
        "address": {
          "streetAddress": "2529 OAK LAWN AVE",
          "city": "DALLAS",
          "state": "TX",
          "zip": "752194019",
          "country": "US",
          "phone": 2145226252
        }
      }
      ]},
      storeProfileDetails: [
        {
          "storeId": "27367",
          "storeNickName": "27367",
          "address": {
            "streetAddress": "4901 LITTLE RD",
            "city": "ARLINGTON",
            "state": "TX",
            "zip": "760171964",
            "country": "US",
            "phone": 8174834469
          }
        },
        {
          "storeId": "12200",
          "storeNickName": "7367",
          "address": {
            "streetAddress": "2529 OAK LAWN AVE",
            "city": "DALLAS",
            "state": "TX",
            "zip": "752194019",
            "country": "US",
            "phone": 2145226252
          }
        }
        ],
      errorMessage: {payload: {}},
      storeSelected: {payload: { data: {"storeId": "27367",
      "address": {
        "streetAddress": "4901 LITTLE RD",
        "city": "ARLINGTON",
        "state": "TX",
        "zip": "760171964",
        "country": "US",
        "phone": 8174834469
      }
    }}
    }
  }};

  const mockStore = configureStore();

  store = mockStore(initialState);
  const random = function() {
    // Do something else
  };
describe('Ordering Home Component', () => {
it('render Home functions', () => {
    const instance = wrapped.instance();
    instance.componentWillReceiveProps (initialState.stores);
    instance.search ('2',initialState.stores.storeProfileDetails);
    instance.search ('0',initialState.stores.storeProfileDetails);
    instance.search ('',initialState.stores.storeProfileDetails);
    instance.handleChange ();
    instance.onClickPrevious ();
    instance.handleChange (initialState.stores.storeSelected.payload);
    instance.componentDidMount ();
    wrapped.setState({ storeData: initialState.stores.storeProfileDetails, loginData : { id: "40", isMultiStoreOwner: false }});
    instance.prepareOptions ();
    instance.storeSelected (initialState.stores.storeProfileDetails,0,0);

})
});
