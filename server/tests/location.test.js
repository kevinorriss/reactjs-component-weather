const request = require('supertest')
const axios = require('axios')
const app = require('../src/app')

let positionOne
let mapboxResponse
beforeEach(async () => {
    positionOne = {
        latitude: 51.505455,
        longitude: -0.075356
    }

    mapboxResponse = {
        data: {
            features: [{
                place_type: [ 'locality' ],
                text: 'Riverside'
            }, {
                place_type: [ 'place' ],
                text: 'London'
            }]
        }
    }
})

test('should error on missing latitude', async (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({}))

    const response =  await request(app)
        .get(`/weather/location?longitude=${positionOne.longitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'latitude is required'
    })

    done()
})

test('should error on missing longitude', async (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({}))

    const response =  await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'longitude is required'
    })

    done()
})

test('should error on malformed latitude', async (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({}))

    positionOne.latitude = 'wronglatitude'
    const response =  await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'latitude must be a number'
    })

    done()
})

test('should error on malformed longitude', async (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve({}))

    positionOne.longitude = 'wronglongitude'
    const response =  await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(400)

    expect(response.body).toMatchObject({
        msg: 'longitude must be a number'
    })

    done()
})

test('should accept integer latitude/longitude', async (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(mapboxResponse))

    positionOne = {latitude:51, longitude:0}
    await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    done()
})

test('should accept float latitude/longitude', async (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(mapboxResponse))

    await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    done()
})

test('should return locality and place', async (done) => {
    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(mapboxResponse))

    const response = await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    expect(response.text).toEqual('Riverside, London')
        
    done()
})

test('should handle missing locality from mapbox response', async (done) => {
    mapboxResponse = {
        data: {
            features: [{
                place_type: [ 'place' ],
                text: 'London'
            }]
        }
    }

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(mapboxResponse))

    const response = await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    expect(response.text).toEqual('London')
        
    done()
})

test('should handle missing place from mapbox response', async (done) => {
    mapboxResponse = {
        data: {
            features: [{
                place_type: [ 'locality' ],
                text: 'Riverside'
            }]
        }
    }

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(mapboxResponse))

    const response = await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    expect(response.text).toEqual('Riverside')
        
    done()
})

test('should handle missing locality and place from mapbox response', async (done) => {
    mapboxResponse = {
        data: {
            features: []
        }
    }

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(mapboxResponse))

    const response = await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(200)

    expect(response.text).toEqual('Unknown Location')
        
    done()
})

test('should handle internal server error', async (done) => {
    mapboxResponse = {}

    axios.get = jest.fn()
    axios.get.mockImplementationOnce(() => Promise.resolve(mapboxResponse))

    const response = await request(app)
        .get(`/weather/location?latitude=${positionOne.latitude}&longitude=${positionOne.longitude}`)
        .send()
        .expect(500)

        expect(response.body).toMatchObject({
            msg: 'Server Error'
        })
        
    done()
})