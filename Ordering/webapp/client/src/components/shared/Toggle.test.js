import React from 'react';
import { shallow } from 'enzyme';
import {ToggleButton} from './Toggle';

let wrapped;
beforeEach(()=>{
    wrapped = shallow(
                <ToggleButton parentCallback = {random} toggleText = {["1","2"]} />
              );
  });
  const random = function() {
    // Do something else
  };
describe('Ordering ToggleButton Component', () => {
  it('render ToggleButton functions', () => {
      const instance = wrapped.instance();
      instance.onToggle ();
  })
});
