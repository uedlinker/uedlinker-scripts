import React from 'react'
import { shallow } from 'enzyme'

import Button from './index'

describe('Button', () => {
  it('should render children correctly', () => {
    const wrapper = shallow(<Button><span>Bar</span></Button>)
    expect(wrapper.children().equals(<span>Bar</span>)).toBe(true)
  })
})
