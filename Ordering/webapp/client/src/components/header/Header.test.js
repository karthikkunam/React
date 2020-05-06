import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {Header} from './Header';

let store,wrapped;
beforeEach(()=>{
    wrapped = shallow( <Header store={store}/> );
    wrapped.setProps({ storeInfo: initialState.stores, dispatch: random, parentCallback: random });
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
        ],
      errorMessage: {payload: {}},
      storeSelected: {payload: { data: {}}},
      storeInfo: { data: {"storeId": "27367",
      "address": {
        "streetAddress": "4901 LITTLE RD",
        "city": "ARLINGTON",
        "state": "TX",
        "zip": "760171964",
        "country": "US",
        "phone": 8174834469}}}
    }
  };

  const mockStore = configureStore();

  store = mockStore(initialState);
  const random = function() {
    // Do something else
  };
describe('Ordering Header Component', () => {
it('render Header functions', () => {
    const instance = wrapped.instance();
    instance.componentWillReceiveProps ();
    instance.toggle ();
})

it('render Header Logout', () => {
  const instance = wrapped.instance();
  instance.logout ();
})
});
