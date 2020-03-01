import axios from 'axios'
import Location from '../../src/components/Location'

// setup variables before each test
let positionOne
let mockName
beforeEach(() => {
    // test location
    positionOne = {
        coords: {
            latitude: 51.505455,
            longitude: -0.075356
        }
    }

    // mock getting the position from the browser
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            success(positionOne)
        }
    }

    // mock the external API response
    mockName = "London, England"
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockName
    }))
})

it('Should render loading text before location received', () => {
    // override the componentDidMount and do nothing, forcing the initial render state
    const componentDidMount = jest.spyOn(Location.prototype, 'componentDidMount')
    componentDidMount.mockImplementationOnce(() => { })

    // create the callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    // shallow render the component
    const wrapper = shallow(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    // we are overriding the componentDidMount so these functions shouldn't get called
    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onLocationError).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)

    // ensure the text matches
    expect(wrapper.text()).toEqual('Waiting for location')

    // should match the snapshot
    expect(wrapper).toMatchSnapshot()
})

it('Should call error callback with no browser location support', () => {
    // ensure the browser has no geolocation
    delete navigator.geolocation

    // create the callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    // shallow render the component
    const wrapper = shallow(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    // error callback should have been called
    expect(onLocationError).toHaveBeenCalledTimes(1)
    expect(onLocationError).toHaveBeenCalledWith(Location.UNSUPPORTED_BROWSER)

    // location lat/long shouldn't have been received
    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)

    // component should render as expected
    expect(wrapper.text()).toEqual('Location unavailable...')
    expect(wrapper).toMatchSnapshot()
})

it('Should call onPositionSuccess from getCurrentPosition', () => {
    // mock the callback function inside the Location component, doesn't need to do anything
    const onPositionSuccess = jest.spyOn(Location.prototype, 'onPositionSuccess')
    onPositionSuccess.mockImplementationOnce(() => { })

    // create the callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()
    
    // shallow render the component
    shallow(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    // callback function inside Location component should have been called with the test lat/long
    expect(onPositionSuccess).toHaveBeenCalledTimes(1)
    expect(onPositionSuccess).toHaveBeenCalledWith(positionOne)

    // callbacks should not have been called
    expect(onLocationError).toHaveBeenCalledTimes(0)
    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)
})

it('Should handle error from getCurrentPosition', () => {
    // mock the browser location request to error
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            error({ code: Location.POSITION_UNAVAILABLE })
        }
    }

    // create the callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()
    const onNameReceived = jest.fn()

    // shallow render the component
    const wrapper = shallow(
        <Location onLocationReceived={onLocationReceived}
            onLocationError={onLocationError}
            onNameReceived={onNameReceived}
            locationURL="" />)

    // location and name callbacks shouldn't have been called
    expect(onLocationReceived).toHaveBeenCalledTimes(0)
    expect(onNameReceived).toHaveBeenCalledTimes(0)

    // error callback should have been called
    expect(onLocationError).toHaveBeenCalledTimes(1)
    expect(onLocationError).toHaveBeenCalledWith(Location.POSITION_UNAVAILABLE)

    // component should render as expected
    expect(wrapper.text()).toEqual('Location unavailable...')
    expect(wrapper).toMatchSnapshot()
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
    
    // shallow render the component
    const wrapper = shallow(
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
        expect(wrapper).toMatchSnapshot()

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

    // shallow render the component
    const wrapper = shallow(
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
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 50)
})

it('Should handle optional onNameReceived callback', (done) => {
    // create callback functions
    const onLocationReceived = jest.fn()
    const onLocationError = jest.fn()

    // shallow render the component
    const wrapper = shallow(
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
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 50);
})