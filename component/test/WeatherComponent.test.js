import WeatherComponent from '../src/WeatherComponent'
import Location from '../src/components/Location'
import HourSlider from '../src/components/HourSlider'

let positionOne
let mockName
let forecast
let locationRequest
let forecastRequest

const onLocationReceived = jest.spyOn(WeatherComponent.prototype, 'onLocationReceived')
const onLocationError = jest.spyOn(WeatherComponent.prototype, 'onLocationError')
const onForecastReceived = jest.spyOn(WeatherComponent.prototype, 'onForecastReceived')
const onForecastError = jest.spyOn(WeatherComponent.prototype, 'onForecastError')
const onSliderChange = jest.spyOn(WeatherComponent.prototype, 'onSliderChange')

beforeEach(() => {
    // test location
    positionOne = {
        coords: {
            latitude: 51.505455,
            longitude: -0.075356
        }
    }

    mockName = 'London, England'

    forecast = {
        timezone: 'Europe/London',
        hourly: [
            {time: 1582848000, summary: 'Rain', icon: 'rain', precipProbability: 0.85, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582851600, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582855200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582858800, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582862400, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582866000, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582869600, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582873200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582876800, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582880400, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582884000, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582887600, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582891200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582894800, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582898400, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582902000, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582905600, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582909200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582912800, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582916400, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582920000, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
            {time: 1582923600, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31},
        ],
        daily: [
            {time: 1582416000, summary: 'Light rain', icon: 'rain', temperatureMin: 6.37, temperatureMax: 13.47},
            {time: 1582516000, summary: 'Overcast', icon: 'cloudy', temperatureMin: 4.23, temperatureMax: 12.42}
        ]
    }

    // mock getting the position from the browser
    navigator.geolocation = {
        getCurrentPosition: (success, error) => {
            success(positionOne)
        }
    }

    locationRequest = jest.spyOn(Location.prototype, 'requestLocation')
    locationRequest.mockImplementationOnce(() => Promise.resolve({ data: mockName}))

    forecastRequest = jest.spyOn(HourSlider.prototype, 'requestForecast')
    forecastRequest.mockImplementationOnce(() => Promise.resolve({ data: forecast}))
})

afterEach(() => {
    onLocationReceived.mockClear()
    onLocationError.mockClear()
    onForecastReceived.mockClear()
    onForecastError.mockClear()
    onSliderChange.mockClear()
})

it('Should render initial state correctly', (done) => {
    // mock the location received callback to do nothing
    onLocationReceived.mockImplementationOnce((latitude, longitude) => {})

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // the mocked location received callback should have been called
        expect(onLocationReceived).toHaveBeenCalledTimes(1)

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
        // the mocked location received callback should have been called
        expect(onLocationReceived).toHaveBeenCalledTimes(1)
        expect(onLocationReceived).toHaveBeenCalledWith(positionOne.coords.latitude, positionOne.coords.longitude)

        // the state should have remained the same
        expect(wrapper.state('position')).toEqual(positionOne.coords)

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
    locationRequest.mockReset()
    locationRequest.mockImplementationOnce(() => Promise.reject())

    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // error callback should have been called
        expect(onLocationError).toHaveBeenCalledTimes(1)
        expect(onLocationError).toHaveBeenCalledWith(Location.RESPONSE_ERROR)

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

it('Should handle forecast received in callback', (done) => {
    // mount the component
    const wrapper = mount(
        <WeatherComponent
            locationURL="/weather/location"
            forecastURL="/weather/forecast" />
    )

    // set a short delay before testing callbacks
    setTimeout(() => {
        // the mocked location received callback should have been called
        expect(onForecastReceived).toHaveBeenCalledTimes(1)
        expect(onForecastReceived).toHaveBeenCalledWith(forecast)

        expect(wrapper.state('timezone')).toEqual(forecast.timezone)
        expect(wrapper.state('daily')).toEqual(forecast.daily)
        expect(wrapper.state('hourly')).toEqual(forecast.hourly)
        expect(wrapper.state('currentHour')).toEqual(forecast.hourly[0])

        // component should render as expected
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})