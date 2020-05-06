import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {Login} from './Login';

let store,wrapped;
beforeEach(()=>{
    wrapped = shallow(
                   <Login store={store} dispatch = {random}/>
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
describe('Ordering Login Component', () => {
  it('render Login functions', () => {
      const instance = wrapped.instance();
      wrapped.find('#userId').simulate('change', { target: { name: 'userId', value: '40' } });
      instance.handleValidation ();
      instance.handleSubmit ({ target: { name: 'userId', value: '40' } });
      wrapped.setState({ userId : "40", password : "711290" });
      instance.handleValidation ();
      instance.handleSubmit ({ target: { name: 'userId', value: '40' } });
  })
});
