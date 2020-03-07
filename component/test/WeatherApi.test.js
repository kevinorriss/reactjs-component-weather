import express from 'express'
import request from 'supertest'
import axios from 'axios'
import WeatherApi from '../src/WeatherApi'

// load in the forecast and location objects used as test data
const forecastData = require('./data/forecast.data')
const locationData = require('./data/location.data')

// define the test tokens
const darkskyToken = 'myDarkskyToken'
const mapboxToken = 'myMapboxToken'

// setup an express app
const weather = new WeatherApi(darkskyToken, mapboxToken)
const app = express()
app.use(express.json())
app.get('/weather/location', weather.location)
app.get('/weather/forecast', weather.forecast)

describe('constructor', () => {
    test('Should store constructor params', () => {
        // create an API instance
        const api = new WeatherApi(darkskyToken, mapboxToken)

        // tokens and unit should be set
        expect(api.darkskyToken).toEqual(darkskyToken)
        expect(api.mapboxToken).toEqual(mapboxToken)
    })

    test('Should hardcode units to uk2', () => {
        // create an API instance, ommit the units
        const api = new WeatherApi(darkskyToken, mapboxToken)

        // units should have been set to uk2
        expect(api.units).toEqual('uk2')
    })
})

describe('forecast', () => {
    let requestPosition, axiosResponse
    beforeEach(() => {
        // copy the forecast data object (clearing any alterations made by previous tests)
        requestPosition = JSON.parse(JSON.stringify(forecastData.position))
        axiosResponse = JSON.parse(JSON.stringify(forecastData.response))

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))
    })

    test('should error on missing latitude', async (done) => {
        // send request without providing a latitiude, expecting a 400 response
        const response = await request(app)
            .get(`/weather/forecast?longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'latitude is required'
        })

        // tell jest the test is complete
        done()
    })

    test('should error on missing longitude', async (done) => {
        // send request without providing a longitude, expecting a 400 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'longitude is required'
        })

        // tell jest the test is complete
        done()
    })

    test('should error on malformed latitude', async (done) => {
        // change the request latitude to not be a number
        requestPosition.latitude = 'wronglatitude'

        // send request, expecting a 400 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'latitude must be a number'
        })

        // tell jest the test is complete
        done()
    })

    test('should error on malformed longitude', async (done) => {
        // change the request latitude to not be a number
        requestPosition.longitude = 'wronglongitude'

        // send request, expecting a 400 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'longitude must be a number'
        })

        // tell jest the test is complete
        done()
    })

    test('should accept integer latitude/longitude', async (done) => {
        // change the request position to be integers
        requestPosition = { latitude: 51, longitude: 0 }

        // send request, expecting a 200 response
        await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // tell jest the test is complete
        done()
    })

    test('should accept float latitude/longitude', async (done) => {
        // send request, expecting a 200 response
        await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // tell jest the test is complete
        done()
    })

    test('should handle internal server error', async (done) => {
        // mock the external API call, forcing it to reject the proise
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.reject())

        // send request, expecting a 500 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(500)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'Server Error'
        })

        // tell jest the test is complete
        done()
    })

    test('should handle no daily data response', async (done) => {
        // set test response data to have an empty array
        axiosResponse.data.daily.data = []

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))
        
        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // response should match the mocked external response data
        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: []
        })

        // tell jest the test is complete
        done()
    })

    test('should handle partial daily data response', async (done) => {
        // set the test reposnse data to have partial info
        axiosResponse.data.daily.data = [{ time: 1582477200, summary: 'Overcast', icon: 'cloudy' }]

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // response should match the mocked external response data
        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: axiosResponse.data.daily.data
        })

        // tell jest the test is complete
        done()
    })

    test('should handle no hourly data response', async (done) => {
        // set test response data to have an empty array
        axiosResponse.data.hourly.data = []

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // response should match the mocked external response data
        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: [],
            daily: axiosResponse.data.daily.data
        })

        // tell jest the test is complete
        done()
    })

    test('should handle partial hourly data response', async (done) => {
        // set the test reposnse data to have partial info
        axiosResponse.data.hourly.data = [{ time: 1582416000, summary: 'Light rain', icon: 'rain' }]

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // response should match the mocked external response data
        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: axiosResponse.data.daily.data
        })

        // tell jest the test is complete
        done()
    })

    test('should return empty hourly array on map error', async (done) => {
        // delete the hourly array from the mock response, causing map to error
        delete axiosResponse.data.hourly

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // response should match the mocked external response data
        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: [],
            daily: axiosResponse.data.daily.data
        })

        // tell jest the test is complete
        done()
    })

    test('should return empty daily array on map error', async (done) => {
        // delete the daily array from the mock response, causing map to error
        delete axiosResponse.data.daily

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // response should match the mocked external response data
        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: []
        })

        // tell jest the test is complete
        done()
    })

    test('should return expected forecast', async (done) => {
        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // response should match the mocked external response data
        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: axiosResponse.data.daily.data
        })

        // tell jest the test is complete
        done()
    })
})

describe('location', () => {

    let requestPosition, axiosResponse
    beforeEach(async () => {
        // copy the forecast data object (clearing any alterations made by previous tests)
        requestPosition = JSON.parse(JSON.stringify(locationData.position))
        axiosResponse = JSON.parse(JSON.stringify(locationData.response))

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))
    })

    test('should error on missing latitude', async (done) => {
        // send request, expecting a 400 response
        const response = await request(app)
            .get(`/weather/location?longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'latitude is required'
        })

        // tell jest the test is complete
        done()
    })

    test('should error on missing longitude', async (done) => {
        // send request, expecting a 400 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'longitude is required'
        })

        // tell jest the test is complete
        done()
    })

    test('should error on malformed latitude', async (done) => {
        // change the request latitude to not be a number
        requestPosition.latitude = 'wronglatitude'

        // send request, expecting a 400 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'latitude must be a number'
        })

        // tell jest the test is complete
        done()
    })

    test('should error on malformed longitude', async (done) => {
        // change the request longitude to not be a number
        requestPosition.longitude = 'wronglongitude'

        // send request, expecting a 400 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'longitude must be a number'
        })

        // tell jest the test is complete
        done()
    })

    test('should accept integer latitude/longitude', async (done) => {
        // change the request position lat/long to be integers
        requestPosition = { latitude: 51, longitude: 0 }

        // send request, expecting a 200 response
        await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // tell jest the test is complete
        done()
    })

    test('should accept float latitude/longitude', async (done) => {
        // send request, expecting a 200 response
        await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // tell jest the test is complete
        done()
    })

    test('should return locality and place', async (done) => {
        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // Should return the locality and place
        expect(response.text).toEqual('Riverside, London')

        // tell jest the test is complete
        done()
    })

    test('should handle missing locality from mapbox response', async (done) => {
        // alter the reponse, removing locality
        axiosResponse.data.features = axiosResponse.data.features.filter(
            (f) => f.place_type[0] !== 'locality')

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // should return only the place (without locality)
        expect(response.text).toEqual('London')

        // tell jest the test is complete
        done()
    })

    test('should handle missing place from mapbox response', async (done) => {
        // alter the reponse, removing place
        axiosResponse.data.features = axiosResponse.data.features.filter(
            (f) => f.place_type[0] !== 'place')

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // should return only the locality (without place)
        expect(response.text).toEqual('Riverside')

        // tell jest the test is complete
        done()
    })

    test('should handle missing locality and place from mapbox response', async (done) => {
        // alter the response, removing all location information
        axiosResponse.data.features = []

        // mock the external API call
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        // send request, expecting a 200 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        // should return "Unknown Location" text
        expect(response.text).toEqual('Unknown Location')

        // tell jest the test is complete
        done()
    })

    test('should handle internal server error', async (done) => {
        // mock the external API call, forcing it to error
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.reject())

        // send request, expecting a 500 response
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(500)

        // response should provide accurate message
        expect(response.body).toMatchObject({
            msg: 'Server Error'
        })

        // tell jest the test is complete
        done()
    })
})