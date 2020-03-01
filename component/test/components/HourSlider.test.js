import axios from 'axios'
import HourSlider from '../../src/components/HourSlider'

const getForecast = jest.spyOn(HourSlider.prototype, 'getForecast')

// setup variables before each test
let positionOne
let forecast
beforeEach(() => {
    // test location
    positionOne = {
        latitude: 51.505455,
        longitude: -0.075356
    }

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

    // mock the external API response
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: forecast}))
})

afterEach(() => {
    getForecast.mockClear()
})

it('Should render initial state', () => {
    // create the callback functions
    const onForecastReceived = jest.fn()
    const onForecastError = jest.fn()
    const onSliderChange = jest.fn()

    // shallow render the component
    const wrapper = mount(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // component should still be disabled
    expect(wrapper.state('disabled')).toEqual(true)
    expect(wrapper.state('marks')).toEqual({})

    // should render as expected
    expect(wrapper).toMatchSnapshot()
})

it('Should call error callback on external API request error', (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.reject())

    // create the callback functions
    const onForecastReceived = jest.fn()
    const onForecastError = jest.fn()
    const onSliderChange = jest.fn()

    // shallow render the component
    const wrapper = mount(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // set the lat/long props
    wrapper.setProps({ latitude: positionOne.latitude, longitude: positionOne.longitude })

    // set a short delay before testing callbacks
    setTimeout(() => {
        // callbacks shouldn't have been called
        expect(onForecastReceived).toHaveBeenCalledTimes(0)
        expect(onSliderChange).toHaveBeenCalledTimes(0)

        // error callback should have been called
        expect(onForecastError).toHaveBeenCalledTimes(1)
        expect(onForecastError).toHaveBeenCalledWith('Error getting forecast response')

        // expect the initial state
        expect(wrapper.state('disabled')).toEqual(true)
        expect(wrapper.state('marks')).toEqual({})

        // should render correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('should handle when response contains less hourly data than expected', (done) => {
    // create the callback functions
    const onForecastReceived = jest.fn()
    const onForecastError = jest.fn()
    const onSliderChange = jest.fn()

    // set the hourly array to contain only the first two elements
    forecast.hourly.splice(2)

    // mock the external API call with the partial hourly forecast
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: forecast}))

    // shallow render the component
    const wrapper = mount(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // set the lat/long props
    wrapper.setProps({ latitude: positionOne.latitude, longitude: positionOne.longitude })

    // set a short delay before testing callbacks
    setTimeout(() => {
        // callbacks shouldn't have been called
        expect(onForecastReceived).toHaveBeenCalledTimes(0)
        expect(onSliderChange).toHaveBeenCalledTimes(0)

        // error callback should have been called
        expect(onForecastError).toHaveBeenCalledTimes(1)
        expect(onForecastError).toHaveBeenCalledWith("Hourly forecast not covered")

        // expect the initial state
        expect(wrapper.state('disabled')).toEqual(true)
        expect(wrapper.state('marks')).toEqual({})

        // should render correctly
        expect(wrapper).toMatchSnapshot()

        // tell jest the test is complete
        done()
    }, 20)
})

it('should handle valid forecast response', (done) => {
    // create the callback functions
    const onForecastReceived = jest.fn()
    const onForecastError = jest.fn()
    const onSliderChange = jest.fn()

    // shallow render the component
    const wrapper = mount(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // set the lat/long props
    wrapper.setProps({ latitude: positionOne.latitude, longitude: positionOne.longitude })

    // set a short delay before testing callbacks
    setTimeout(() => {
        // success callback should have been called
        expect(onForecastReceived).toHaveBeenCalledTimes(1)
        expect(onForecastReceived).toHaveBeenCalledWith(forecast)

        // component should no longer be disabled
        expect(wrapper.state('disabled')).toEqual(false)

        // expect the marks to match the test data
        expect(wrapper.state('marks')).toEqual({
            '0': '00:00',
            '1': '',
            '2': '04:00',
            '3': '',
            '4': '08:00',
            '5': '',
            '6': '12:00',
            '7': '',
            '8': '16:00',
            '9': '',
            '10': '20:00',
            '11': ''
        })

        // should render correctly
        expect(wrapper).toMatchSnapshot()
        
        // tell jest the test is complete
        done()
    }, 20)
})