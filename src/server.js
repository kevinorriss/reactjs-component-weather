const express = require('express')
const WeatherData = require('@kevinorriss/weather/build/WeatherData')

// create weather data instance
const weather = new WeatherData(process.env.DARKSKY_TOKEN, process.env.MAPBOX_TOKEN)

// create the express server
const app = express()

// automatically parse request data to JSON (req.body)
app.use(express.json())

// define route
app.get('/weather/location', weather.location)
app.get('/weather/forecast', weather.forecast)

// create the port number for the server to listen on
const port = process.env.PORT || 5000

// start the server
app.listen(port, () => console.log(`Server started on port ${port}`))