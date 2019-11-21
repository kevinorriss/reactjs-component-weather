import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from 'enzyme'
import Boilerplate from '@kevinorriss/boilerplate'

test('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Boilerplate />, div)
})

test('Should render boilerplate text', () => {
    const wrapper = mount(<Boilerplate />)
    expect(wrapper.text()).toEqual('Boilerplate React component')
})