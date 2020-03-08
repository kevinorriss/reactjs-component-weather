module.exports = {
    position: {
        coords: {
            latitude: 51.505455,
            longitude: -0.075356
        }
    },
    mapboxResponse: {
        features: [{
            place_type: ['locality'],
            text: 'Tower Bridge'
        }, {
            place_type: ['place'],
            text: 'London'
        }]
    },
    expectedResponse: 'Tower Bridge, London'
}