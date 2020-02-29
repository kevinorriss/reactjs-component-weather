const request = require('supertest')
// const axios = require('axios')
const app = require('../src/app')

let positionOne
let forecastResponse
beforeEach(async () => {
    positionOne = {
        latitude: 51.505455,
        longitude: -0.075356
    }

    forecastResponse = {
        data: {
            latitude: positionOne.latitude,
            longitude: positionOne.longitude,
            timezone: 'Europe/London',
            hourly: {
                summary: 'Light rain starting tomorrow morning.',
                icon: 'rain',
                data: [
                    {time: 1582477200, summary: 'Overcast', icon: 'cloudy', precipProbability: 0.05, temperature: 8.57, humidity: 0.71, windSpeed: 10.71},
                    {time: 1582577200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31}
                ]
            },
            daily: {
                summary: 'Rain throughout the week.',
                icon: 'rain',
                data: [
                    {time: 1582416000, summary: 'Light rain', icon: 'rain', temperatureMin: 6.37, temperatureMax: 13.47},
                    {time: 1582516000, summary: 'Overcast', icon: 'cloudy', temperatureMin: 4.23, temperatureMax: 12.42}
                ]
            }
        }
    }

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))
})

test('should error on missing latitude', async (done) => {
    const response =  await request(app)
        .get(`/weather/forecast?longitude=${positionOne.longitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'latitude is required'
    })

    done()
})

test('should error on missing longitude', async (done) => {
    const response =  await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'longitude is required'
    })

    done()
})

test('should error on malformed latitude', async (done) => {
    positionOne.latitude = 'wronglatitude'
    const response =  await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'latitude must be a number'
    })

    done()
})

test('should error on malformed longitude', async (done) => {
    positionOne.longitude = 'wronglongitude'
    const response =  await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'longitude must be a number'
    })

    done()
})

test('should accept integer latitude/longitude', async (done) => {
    positionOne = {latitude:51, longitude:0}
    await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    done()
})

test('should accept float latitude/longitude', async (done) => {
    await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    done()
})

test('should handle internal server error', async (done) => {
    forecastResponse = {}

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))

    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(500)

        expect(response.body).toMatchObject({
            msg: 'Server Error'
        })
        
    done()
})

test('should handle no daily data response', async (done) => {
    forecastResponse.data.daily.data = []

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))

    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

        expect(response.body).toMatchObject({
            timezone: 'Europe/London',
            hourly: [
                {time: 1582477200, summary: 'Overcast', icon: 'cloudy', precipProbability: 0.05, temperature: 8.57, humidity: 0.71, windSpeed: 10.71},
                {time: 1582577200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31}
            ],
            daily: []
        })
        
    done()
})

test('should handle partial daily data response', async (done) => {
    forecastResponse.data.daily.data = [{time: 1582477200, summary: 'Overcast', icon: 'cloudy'}]

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))

    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

        expect(response.body).toMatchObject({
            timezone: 'Europe/London',
            hourly: [
                {time: 1582477200, summary: 'Overcast', icon: 'cloudy', precipProbability: 0.05, temperature: 8.57, humidity: 0.71, windSpeed: 10.71},
                {time: 1582577200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31}
            ],
            daily: [{time: 1582477200, summary: 'Overcast', icon: 'cloudy'}]
        })
        
    done()
})

test('should handle no hourly data response', async (done) => {
    forecastResponse.data.hourly.data = []

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))

    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

        expect(response.body).toMatchObject({
            timezone: 'Europe/London',
            hourly: [],
            daily: [
                {time: 1582416000, summary: 'Light rain', icon: 'rain', temperatureMin: 6.37, temperatureMax: 13.47},
                {time: 1582516000, summary: 'Overcast', icon: 'cloudy', temperatureMin: 4.23, temperatureMax: 12.42}
            ]
        })
        
    done()
})

test('should handle partial hourly data response', async (done) => {
    forecastResponse.data.hourly.data = [{time: 1582416000, summary: 'Light rain', icon: 'rain'}]

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))

    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

        expect(response.body).toMatchObject({
            timezone: 'Europe/London',
            hourly: [{time: 1582416000, summary: 'Light rain', icon: 'rain'}],
            daily: [
                {time: 1582416000, summary: 'Light rain', icon: 'rain', temperatureMin: 6.37, temperatureMax: 13.47},
                {time: 1582516000, summary: 'Overcast', icon: 'cloudy', temperatureMin: 4.23, temperatureMax: 12.42}
            ]
        })
        
    done()
})

test('should return empty hourly array on map error', async (done) => {
    delete forecastResponse.data.hourly

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))

    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

        expect(response.body).toMatchObject({
            timezone: 'Europe/London',
            hourly: [],
            daily: [
                {time: 1582416000, summary: 'Light rain', icon: 'rain', temperatureMin: 6.37, temperatureMax: 13.47},
                {time: 1582516000, summary: 'Overcast', icon: 'cloudy', temperatureMin: 4.23, temperatureMax: 12.42}
            ]
        })
        
    done()
})

test('should return empty daily array on map error', async (done) => {
    delete forecastResponse.data.daily

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(forecastResponse))

    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

        expect(response.body).toMatchObject({
            timezone: 'Europe/London',
            hourly: [
                {time: 1582477200, summary: 'Overcast', icon: 'cloudy', precipProbability: 0.05, temperature: 8.57, humidity: 0.71, windSpeed: 10.71},
                {time: 1582577200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31}
            ],
            daily: []
        })
        
    done()
})

test('should return expected forecast', async (done) => {
    const response = await request(app)
        .get(`/weather/forecast?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

        expect(response.body).toMatchObject({
            timezone: 'Europe/London',
            hourly: [
                {time: 1582477200, summary: 'Overcast', icon: 'cloudy', precipProbability: 0.05, temperature: 8.57, humidity: 0.71, windSpeed: 10.71},
                {time: 1582577200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31}
            ],
            daily: [
                {time: 1582416000, summary: 'Light rain', icon: 'rain', temperatureMin: 6.37, temperatureMax: 13.47},
                {time: 1582516000, summary: 'Overcast', icon: 'cloudy', temperatureMin: 4.23, temperatureMax: 12.42}
            ]
        })
        
    done()
})