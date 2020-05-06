import React from 'react';
import { shallow } from 'enzyme';
import {HeaderBar} from './HeaderBar';

let wrapped;
beforeEach(()=>{
    wrapped = shallow(
                <HeaderBar parentCallback = {random} errorMessage = {123} />
              );
  });
  const random = function() {
    // Do something else
  };
describe('Ordering HeaderBar Component', () => {
  it('render HeaderBar functions', () => {
      const instance = wrapped.instance();
      instance.handleClick (0,0);
  })
});
