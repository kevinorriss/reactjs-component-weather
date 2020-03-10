import React from 'react'
import ReactDOM from 'react-dom'
import WeatherComponent from '@kevinorriss/weather'

ReactDOM.render(<WeatherComponent locationURL="/weather/location" forecastURL="/weather/forecast" />, document.getElementById('root'))
