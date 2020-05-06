import React from 'react';
import { shallow } from 'enzyme';
import {ErrorHandler} from './ErrorHandler';

let wrapped;
beforeEach(()=>{
    wrapped = shallow(
                <ErrorHandler  errorMessage = {123} />
              );
  });

describe('Ordering ErrorHandler Component', () => {
  it('render ErrorHandler functions', () => {
    //   const instance = wrapped.instance();
    //   instance.componentDidMount ();
    //   instance.toggle ();
  })
});
