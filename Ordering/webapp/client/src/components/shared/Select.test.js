import React from 'react';
import { shallow } from 'enzyme';
import {SelectStore} from './select';

let wrapped;
beforeEach(()=>{
    wrapped = shallow(
                <SelectStore parentCallback = {random} toggleText = {["1","2"]} />
              );
    wrapped.setProps({ placeholder: "random", val: { label:"random" }  });
  });
  const random = function() {
    // Do something else
  };
describe('Ordering SelectStore Component', () => {
  it('render SelectStore functions', () => {
      const instance = wrapped.instance();
      instance.render ();
  })
});
