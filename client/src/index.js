import React from 'react'
import ReactDOM from 'react-dom'
import WeatherComponent from '@kevinorriss/weather/build/WeatherComponent'

ReactDOM.render(<WeatherComponent locationURL="/weather/location" forecastURL="/weather/forecast" />, document.getElementById('root'))
