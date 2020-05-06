import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {WeatherDetails} from './WeatherDetails';
import categoryData from '../../assets/mocks/singleDay.json';

let store,wrapped;
beforeEach(()=>{
    wrapped = shallow(
                <WeatherDetails store={ store } dispatch = { random } storeSelectedData =  { initialState.stores.storeProfileDetails[0] }  />
              );
    wrapped.setProps({ dispatch: random, handleSelectedLink: random , history: { push: random }, SingleDayCategories : categoryData.singleDay });
    wrapped.setState({ SingleDayCategories: categoryData.singleDay});


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
      },
      getOrderingCategoriesInfo: { payload: {data: categoryData.singleDay.category[0]}}
  }};

  const mockStore = configureStore();

  store = mockStore(initialState);
  const random = function() {
    // Do something else
  };

  describe('Ordering WeatherDetails Component', () => {
    it('render WeatherDetails functions', () => {
        const instance = wrapped.instance();
        instance.generateDays(4);
        instance.generateDays(0)

    })
  });
  
