import HourSlider from '../../src/components/HourSlider'

// require the test data we pass to the mocked API calls
const forecastData = require('../data/forecast.data')

// create the spies
const requestForecast = jest.spyOn(HourSlider.prototype, 'requestForecast')

// disable console errors for cleaner test output
jest.spyOn(console, 'error').mockImplementation(() => {})

beforeEach(() => {
    requestForecast.mockImplementationOnce(() => Promise.resolve({data: forecastData.expectedResponse }))
})

afterEach(() => {
    // reset the counts of every mock
    jest.clearAllMocks()
})

it('Should render initial state', () => {
    // create the callback functions
    const onForecastReceived = jest.fn()
    const onForecastError = jest.fn()
    const onSliderChange = jest.fn()

    // shallow render the component
    const wrapper = shallow(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // component should still be disabled
    expect(wrapper.state('disabled')).toEqual(true)
    expect(wrapper.state('marks')).toEqual({})
})

it('Should call error callback on external API request error', (done) => {
    requestForecast.mockReset()
    requestForecast.mockImplementationOnce(() => Promise.reject())

    // create the callback functions
    const onForecastReceived = jest.fn()
    const onForecastError = jest.fn()
    const onSliderChange = jest.fn()

    // shallow render the component
    const wrapper = shallow(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // set the lat/long props
    wrapper.setProps({ latitude: forecastData.position.latitude, longitude: forecastData.position.longitude })

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
    const partialForecast = JSON.parse(JSON.stringify(forecastData.expectedResponse))
    partialForecast.hourly.splice(2)

    // mock the external API call with the partial hourly forecast
    requestForecast.mockReset()
    requestForecast.mockImplementationOnce(() => Promise.resolve({data: partialForecast }))

    // shallow render the component
    const wrapper = shallow(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // set the lat/long props
    wrapper.setProps({ latitude: forecastData.position.latitude, longitude: forecastData.position.longitude })

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
    const wrapper = shallow(
        <HourSlider
            onForecastReceived={onForecastReceived}
            onForecastError={onForecastError}
            onSliderChange={onSliderChange}
            forecastURL=""/>
    )

    // set the lat/long props
    wrapper.setProps({ latitude: forecastData.position.latitude, longitude: forecastData.position.longitude })

    // set a short delay before testing callbacks
    setTimeout(() => {
        // success callback should have been called
        expect(onForecastReceived).toHaveBeenCalledTimes(1)
        expect(onForecastReceived).toHaveBeenCalledWith(forecastData.expectedResponse)

        // component should no longer be disabled
        expect(wrapper.state('disabled')).toEqual(false)

        // expect the marks to match the test data
        expect(wrapper.state('marks')).toEqual({
            '0': '14:00',
            '1': '',
            '2': '18:00',
            '3': '',
            '4': '22:00',
            '5': '',
            '6': '02:00',
            '7': '',
            '8': '06:00',
            '9': '',
            '10': '10:00',
            '11': ''
        })
        
        // tell jest the test is complete
        done()
    }, 20)
})