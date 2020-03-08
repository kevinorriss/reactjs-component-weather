import WeatherComponent from '../src/WeatherComponent'
import Location from '../src/components/Location'
import HourSlider from '../src/components/HourSlider'

// require the test data we pass to the mocked API calls
const locationData = require('./data/location.data')
const forecastData = require('./data/forecast.data')

// create the spies
const locationDidMount = jest.spyOn(Location.prototype, 'componentDidMount')
const requestLocation = jest.spyOn(Location.prototype, 'requestLocation')
const requestForecast = jest.spyOn(HourSlider.prototype, 'requestForecast')
const onLocationReceived = jest.spyOn(WeatherComponent.prototype, 'onLocationReceived')
const onLocationError = jest.spyOn(WeatherComponent.prototype, 'onLocationError')
const onForecastReceived = jest.spyOn(WeatherComponent.prototype, 'onForecastReceived')
const onForecastError = jest.spyOn(WeatherComponent.prototype, 'onForecastError')

// disable console errors for cleaner test output
jest.spyOn(console, 'error').mockImplementation(() => {})

beforeEach(() => {
    // mock getting the position from the browser, passing in the mock data
    navigator.geolocation = { getCurrentPosition: jest.fn().mockImplementationOnce((success, error) => { success(locationData.position) }) }

    requestLocation.mockImplementationOnce(() => Promise.resolve({data: locationData.expectedResponse }))
    requestForecast.mockImplementationOnce(() => Promise.resolve({data: forecastData.expectedResponse }))
})

afterEach(() => {
    // reset the counts of every mock
    jest.clearAllMocks()
})

it('Should render initial state correctly', (done) => {
    // mock the location component mounting, preventing updates
    locationDidMount.mockImplementationOnce(() => {})

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // the mocked location received callback should not have been called
        expect(onLocationReceived).toHaveBeenCalledTimes(0)
        expect(onLocationError).toHaveBeenCalledTimes(0)
        expect(onForecastReceived).toHaveBeenCalledTimes(0)
        expect(onForecastError).toHaveBeenCalledTimes(0)

        // the state should have remained the same
        expect(wrapper.state()).toEqual({
            position: {
                latitude: null,
                longitude: null
            },
            timezone: null,
            daily: null,
            hourly: null,
            currentHour: null,
            error: null
        })

        // component should render as expected
        expect(wrapper).toMatchSnapshot()
        
        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle location received in callback', (done) => {
    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // the mocked location received callback should have been called
        expect(onLocationReceived).toHaveBeenCalledTimes(1)
        expect(onLocationReceived).toHaveBeenCalledWith(locationData.position.coords.latitude, locationData.position.coords.longitude)

        // the state should have remained the same
        expect(wrapper.state('position')).toEqual(locationData.position.coords)

        // component should render as expected
        expect(wrapper).toMatchSnapshot()
        
        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle permission denied error', (done) => {
    // mock the browser location request to error
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            error({ code: Location.PERMISSION_DENIED })
        }
    }

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // error callback should have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(Location.PERMISSION_DENIED)

        // state should have been updated
        expect(wrapper.state('error')).toEqual('Permission to read your location was denied')

        // should have rendered correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle permission unavailable error', (done) => {
    // mock the browser location request to error
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            error({ code: Location.POSITION_UNAVAILABLE })
        }
    }

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // error callback should have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(Location.POSITION_UNAVAILABLE)

        // state should have been updated
        expect(wrapper.state('error')).toEqual('Your position is unavailable')

        // should have rendered correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle location timeout error', (done) => {
    // mock the browser location request to error
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            error({ code: Location.TIMEOUT })
        }
    }

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // error callback should have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(Location.TIMEOUT)

        // state should have been updated
        expect(wrapper.state('error')).toEqual('Getting your position timed out')

        // should have rendered correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle unsupported browser error', (done) => {
    // mock the browser location request to error
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            error({ code: Location.UNSUPPORTED_BROWSER })
        }
    }

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // error callback should have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(Location.UNSUPPORTED_BROWSER)

        // state should have been updated
        expect(wrapper.state('error')).toEqual('Your browser does not support geolocation')

        // should have rendered correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle location response error', (done) => {
    // force the location external API call to fail
    requestLocation.mockReset()
    requestLocation.mockImplementationOnce(() => Promise.reject())

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // error callback should have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(Location.RESPONSE_ERROR)

        // should still get the forecast as the location coords were sent back even if the location name fails
        expect(onLocationReceived).toHaveBeenCalledTimes(1)
        expect(onLocationReceived).toHaveBeenCalledWith(locationData.position.coords.latitude, locationData.position.coords.longitude)
        expect(requestForecast).toHaveBeenCalledTimes(1)

        // state should have been updated
        expect(wrapper.state('error')).toEqual('An error occurred in the response to getting your location information')

        // should have rendered correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle unknown error', (done) => {
    // mock the browser location request to error with an unknown code
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            error({ code: -1 })
        }
    }

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // error callback should have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(-1)

        // state should have been updated
        expect(wrapper.state('error')).toEqual('An unknown error occured')

        // should have rendered correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('Should hande forecast error', (done) => {
    requestForecast.mockReset()
    requestForecast.mockImplementationOnce(() => Promise.reject())

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // error callback should have been called
        expect(onForecastError).toHaveBeenCalledTimes(1)
        expect(onForecastError).toHaveBeenCalledWith('Error getting forecast response')

        // forecast shouldn't have been called
        expect(onForecastReceived).toHaveBeenCalledTimes(0)

        // state should have been updated
        expect(wrapper.state('error')).toEqual('Error getting forecast response')

        // should have rendered correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('Should handle forecast received in callback', (done) => {
    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // update the component
        wrapper.update()

        // the mocked location received callback should have been called
        expect(onForecastReceived).toHaveBeenCalledTimes(1)
        expect(onForecastReceived).toHaveBeenCalledWith(forecastData.expectedResponse)

        // expect the forecast to have been set in the state
        expect(wrapper.state('timezone')).toEqual(forecastData.expectedResponse.timezone)
        expect(wrapper.state('daily')).toEqual(forecastData.expectedResponse.daily)
        expect(wrapper.state('hourly')).toEqual(forecastData.expectedResponse.hourly)
        expect(wrapper.state('currentHour')).toEqual(forecastData.expectedResponse.hourly[0])

        // component should render as expected
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})