import React from 'react'
import axios from 'axios'
import Location from '@kevinorriss/weather/build/Location'

let positionOne
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
})

it('Should match snapshot', () => {
    // mock the external API response
    const mockName = "London, England"
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockName
    }))

    const wrapper = shallow(
        <Location onLocationReceived={jest.fn()}
            onLocationError={jest.fn()}
            locationURL="" />)

    expect(wrapper).toMatchSnapshot()
})

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

it('Should call error callback with no browser location support', () => {
    // ensure the browser has no geolocation
    delete navigator.geolocation

    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    const wrapper = mount(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    expect(onLocationError).toHaveBeenCalledTimes(1)
    expect(onLocationError).toHaveBeenCalledWith(Location.UNSUPPORTED_BROWSER)

    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)

    expect(wrapper.text()).toEqual('Location unavailable...')
})

it('Should call onPositionSuccess from getCurrentPosition', () => {
    const onPositionSuccess = jest.spyOn(Location.prototype, 'onPositionSuccess')
    onPositionSuccess.mockImplementationOnce(() => { })

    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()
    
    mount(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    expect(onPositionSuccess).toHaveBeenCalledTimes(1)
    expect(onPositionSuccess).toHaveBeenCalledWith(positionOne)

    expect(onLocationError).toHaveBeenCalledTimes(0)
    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)
})

it('Should handle error from getCurrentPosition', () => {
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            error({ code: Location.POSITION_UNAVAILABLE })
        }
    }

    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    const wrapper = mount(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)

    expect(onLocationError).toHaveBeenCalledTimes(1)
    expect(onLocationError).toHaveBeenCalledWith(Location.POSITION_UNAVAILABLE)
    expect(wrapper.text()).toEqual('Location unavailable...')
})

it('Should successfully retrieve location name', (done) => {
    // create callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    // mock the external API response
    const mockName = "London, England"
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockName
    }))
    
    // mount the component
    const wrapper = mount(
        <Location onLocationReceived={onLocationReceived}
            onNameReceived={onNameReceived}
            onLocationError={onLocationError}
            locationURL="" />)

    // set a short delay before testing callbacks
    setTimeout(() => {
        // get the lat/long expected
        const { latitude, longitude } = positionOne.coords

        // location lat/long should be sent back
        expect(onLocationReceived).toHaveBeenCalledTimes(1)
        expect(onLocationReceived).toHaveBeenCalledWith(latitude, longitude)

        // name should be sent back
        expect(onNameReceived).toHaveBeenCalledTimes(1)
        expect(onNameReceived).toHaveBeenCalledWith(mockName)

        // no errors
        expect(onLocationError).toHaveBeenCalledTimes(0)

        // component re-renders with location name
        expect(wrapper.text()).toEqual(mockName)

        // tell jest the test is complete
        done()
    }, 50);
})

it('Should handle error in retrieving location name', (done) => {
    // create callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    // mock the external API response, forcing an error
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.reject())

    const wrapper = mount(
        <Location onLocationReceived={onLocationReceived}
            onNameReceived={onNameReceived}
            onLocationError={onLocationError}
            locationURL="" />)

    // set a short delay before testing callbacks
    setTimeout(() => {
        // get the lat/long expected
        const { latitude, longitude } = positionOne.coords

        // location lat/long should be sent back
        expect(onLocationReceived).toHaveBeenCalledTimes(1)
        expect(onLocationReceived).toHaveBeenCalledWith(latitude, longitude)

        // no name should have been received
        expect(onNameReceived).toHaveBeenCalledTimes(0)

        // error callback to have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(Location.RESPONSE_ERROR)

        // component re-renders with error text
        expect(wrapper.text()).toEqual('Location unavailable...')

        done()
    }, 50)
})

it('Should handle optional onNameReceived callback', (done) => {
    // create callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()

    // mock the external API response
    const mockName = "London, England"
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockName
    }))

    // mount the component
    const wrapper = mount(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            locationURL="" />)

    // set a short delay before testing callbacks
    setTimeout(() => {
        // get the lat/long expected
        const { latitude, longitude } = positionOne.coords

        // location lat/long should be sent back
        expect(onLocationReceived).toHaveBeenCalledTimes(1)
        expect(onLocationReceived).toHaveBeenCalledWith(latitude, longitude)

        // no errors
        expect(onLocationError).toHaveBeenCalledTimes(0)

        // component re-renders with location name
        expect(wrapper.text()).toEqual(mockName)

        // tell jest the test is complete
        done()
    }, 50);
})