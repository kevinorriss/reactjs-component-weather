import express from 'express'
import request from 'supertest'
import axios from 'axios'
import WeatherApi from '../src/WeatherApi'

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

describe('forecast', () => {
    let requestPosition, axiosResponse
    beforeEach(() => {
        requestPosition = JSON.parse(JSON.stringify(forecastData.position))
        axiosResponse = JSON.parse(JSON.stringify(forecastData.response))

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))
    })

    test('should error on missing latitude', async (done) => {
        const response = await request(app)
            .get(`/weather/forecast?longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'latitude is required'
        })

        done()
    })

    test('should error on missing longitude', async (done) => {
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'longitude is required'
        })

        done()
    })

    test('should error on malformed latitude', async (done) => {
        requestPosition.latitude = 'wronglatitude'
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'latitude must be a number'
        })

        done()
    })

    test('should error on malformed longitude', async (done) => {
        requestPosition.longitude = 'wronglongitude'
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'longitude must be a number'
        })

        done()
    })

    test('should accept integer latitude/longitude', async (done) => {
        requestPosition = { latitude: 51, longitude: 0 }
        await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        done()
    })

    test('should accept float latitude/longitude', async (done) => {
        await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        done()
    })

    test('should handle internal server error', async (done) => {
        axiosResponse = {}

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(500)

        expect(response.body).toMatchObject({
            msg: 'Server Error'
        })

        done()
    })

    test('should handle no daily data response', async (done) => {
        axiosResponse.data.daily.data = []

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: []
        })

        done()
    })

    test('should handle partial daily data response', async (done) => {
        axiosResponse.data.daily.data = [{ time: 1582477200, summary: 'Overcast', icon: 'cloudy' }]

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: axiosResponse.data.daily.data
        })

        done()
    })

    test('should handle no hourly data response', async (done) => {
        axiosResponse.data.hourly.data = []

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: [],
            daily: axiosResponse.data.daily.data
        })

        done()
    })

    test('should handle partial hourly data response', async (done) => {
        axiosResponse.data.hourly.data = [{ time: 1582416000, summary: 'Light rain', icon: 'rain' }]

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: axiosResponse.data.daily.data
        })

        done()
    })

    test('should return empty hourly array on map error', async (done) => {
        delete axiosResponse.data.hourly

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: [],
            daily: axiosResponse.data.daily.data
        })

        done()
    })

    test('should return empty daily array on map error', async (done) => {
        delete axiosResponse.data.daily

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: []
        })

        done()
    })

    test('should return expected forecast', async (done) => {
        const response = await request(app)
            .get(`/weather/forecast?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.body).toMatchObject({
            timezone: axiosResponse.data.timezone,
            hourly: axiosResponse.data.hourly.data,
            daily: axiosResponse.data.daily.data
        })

        done()
    })
})

describe('location', () => {

    let requestPosition, axiosResponse
    beforeEach(async () => {
        requestPosition = JSON.parse(JSON.stringify(locationData.position))
        axiosResponse = JSON.parse(JSON.stringify(locationData.response))

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))
    })

    test('should error on missing latitude', async (done) => {
        const response = await request(app)
            .get(`/weather/location?longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'latitude is required'
        })

        done()
    })

    test('should error on missing longitude', async (done) => {
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'longitude is required'
        })

        done()
    })

    test('should error on malformed latitude', async (done) => {
        requestPosition.latitude = 'wronglatitude'
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'latitude must be a number'
        })

        done()
    })

    test('should error on malformed longitude', async (done) => {
        requestPosition.longitude = 'wronglongitude'
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(400)

        expect(response.body).toMatchObject({
            msg: 'longitude must be a number'
        })

        done()
    })

    test('should accept integer latitude/longitude', async (done) => {
        requestPosition = { latitude: 51, longitude: 0 }
        await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        done()
    })

    test('should accept float latitude/longitude', async (done) => {
        await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        done()
    })

    test('should return locality and place', async (done) => {
        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.text).toEqual('Riverside, London')

        done()
    })

    test('should handle missing locality from mapbox response', async (done) => {
        axiosResponse.data.features = axiosResponse.data.features.filter(
            (f) => f.place_type[0] !== 'locality')

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.text).toEqual('London')

        done()
    })

    test('should handle missing place from mapbox response', async (done) => {
        axiosResponse.data.features = axiosResponse.data.features.filter(
            (f) => f.place_type[0] !== 'place')

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.text).toEqual('Riverside')

        done()
    })

    test('should handle missing locality and place from mapbox response', async (done) => {
        axiosResponse.data.features = []

        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.resolve(axiosResponse))

        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(200)

        expect(response.text).toEqual('Unknown Location')

        done()
    })

    test('should handle internal server error', async (done) => {
        axios.get = jest.fn()
        axios.get.mockImplementationOnce(() => Promise.reject())

        const response = await request(app)
            .get(`/weather/location?latitude=${requestPosition.latitude}&longitude=${requestPosition.longitude}`)
            .send()
            .expect(500)

        expect(response.body).toMatchObject({
            msg: 'Server Error'
        })

        done()
    })
})