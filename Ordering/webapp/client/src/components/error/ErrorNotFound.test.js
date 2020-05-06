import React from 'react';
import {  mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ErrorNotFound from './ErrorNotFound';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ErrorNotFound Component', () => {
  const initialState = {
    selectedStoreFunction: 'ordering',
    selectedStore: "1428"
  };

  const mockStore = configureStore();
  let  store = mockStore(initialState);
 
  it('render ErrorNotFound', () => {
    const comp = mount(<Provider store={store}>
        <Router>
        <ErrorNotFound />
        </Router>
    </Provider>);
    expect(comp).toBeDefined()
})
});
