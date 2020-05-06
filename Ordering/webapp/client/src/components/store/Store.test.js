import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {Store} from './Store';
import categoryData from '../../assets/mocks/singleDay.json';

let store,wrapped;
beforeEach(()=>{
    wrapped = shallow(
                <Store 
                    store={ store }
                    dispatch = { random }
                    storeProfileDetails = { initialState.stores.storeProfileDetails }
                    storeSelectedData =  { [] }
                    SingleDayCategories= {categoryData.singleDay.category[0]}
                />
              );
    wrapped.setProps({ dispatch: random, parentCallback: random , history: { push: random }});

  });

  const initialState = {
    login: { loginData : { payload : { id: "40", isMultiStoreOwner: true}} },
    stores: { 
      getStoreProfile: { payload: [
      {
        "storeId": "27367",
        "storeNickName": "test",
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
          "storeNickName": "test2",
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
          "storeId": "22000",
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
      },
      getOrderingCategoriesInfo: { payload: {data: categoryData.singleDay.category[0]}}
  }};

  const mockStore = configureStore();

  store = mockStore(initialState);
  const random = function() {
    // Do something else
  };
describe('Ordering Store Component', () => {
  it('render Store functions', () => {
      const instance = wrapped.instance();
      wrapped.setState({ loginData : { id: "40", isMultiStoreOwner: false }});
      instance.componentWillReceiveProps (store);
      wrapped.setState({ loginData : { id: "40", isMultiStoreOwner: true }});
      instance.search ('',initialState.stores.storeProfileDetails);
      instance.search ('2',initialState.stores.storeProfileDetails);
      instance.storeSelected (0,0);
      instance.handleChange ();
      instance.handleChange (initialState.stores.storeProfileDetails[0]);
      instance.renderStoreInfo (initialState.stores.storeProfileDetails[0]);
      instance.onStoreFunctionSelect ();
      instance.onClickPrevious ();

  })
});
