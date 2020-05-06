import React from 'react';
import { shallow } from 'enzyme';
import {SideNavBar} from './SideNavBar';

let wrapped;
beforeEach(()=>{
    wrapped = shallow(
                <SideNavBar parentCallback = {random} errorMessage = {123} />
              );
  });
  const random = function() {
    // Do something else
  };
describe('Ordering HeaderBar Component', () => {
  it('render HeaderBar functions', () => {
    //   const instance = wrapped.instance();
    //   instance.handleClick (0,0);
  })
});
