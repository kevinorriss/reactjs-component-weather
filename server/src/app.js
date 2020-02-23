const express = require('express')
const WeatherData = require('../../component/src/WeatherData')

// create weather data instance
const weather = new WeatherData(process.env.DARKSKY_TOKEN, process.env.MAPBOX_TOKEN)

// create the express server
const app = express()

// automatically parse request data to JSON (req.body)
app.use(express.json())

// define route
app.get('/weather/location', weather.location)
app.get('/weather/forecast', weather.forecast)

module.exports = app