import React from 'react'
import axios from 'axios'
import { mount } from 'enzyme'
import Location from '@kevinorriss/weather/build/HourSlider'

/*let positionOne
beforeEach(async () => {
    positionOne = {
        coords: {
            latitude: 51.505455,
            longitude: -0.075356
        }
    }

    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            success(positionOne)
        }
    }
})*/

it('Should render loading text before location received', () => {
    // override the componentDidMount and do nothing, forcing the initial render state
    const componentDidMount = jest.spyOn(Location.prototype, 'componentDidMount')
    componentDidMount.mockImplementationOnce(() => { })

    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    const wrapper = mount(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    // we are overriding the componentDidMount so these functions shouldn't get called
    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onLocationError).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)

    expect(wrapper.text()).toEqual('Waiting for location')
})