import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import axios from 'axios'
import moment from 'moment-timezone'
import 'rc-slider/assets/index.css'

class HourSlider extends React.Component {
    constructor(props) {
        super(props)

        // bind this to the functions
        this.getForecast = this.getForecast.bind(this)

        // set the initial state
        this.state = {
            markCount: 12,
            markStep: 2,
            hourStep: 2,
            marks: {},
            disabled: true
        }
    }

    componentDidUpdate(prevProps) {
        // if the lat/long was null and has been updated, we have the location
        if (!prevProps.latitude && !prevProps.longitude && this.props.latitude && this.props.longitude) {
            this.getForecast(this.props.latitude, this.props.longitude)
        }
    }

    async requestForecast(url) {
        return await axios.get(url)
    }

    async getForecast(latitude, longitude) {
        let response
        try {
            // call the REST API to get the forecast data for the provided location
            const url = `${this.props.forecastURL}?latitude=${latitude}&longitude=${longitude}`
            response = await this.requestForecast(url)
        } catch (error) {
            // fire the error callback function and return
            this.props.onForecastError('Error getting forecast response')
            return
        }

        // destructure the forecast
        const { timezone, hourly } = response.data

        const maxMark = (this.state.markCount - 1) * this.state.hourStep

        // check that we have enough hourly forecasts for each step
        if (hourly.length < maxMark) {
            this.props.onForecastError("Hourly forecast not covered")
            return
        }

        // fire the forecast callback function
        this.props.onForecastReceived(response.data)

        let marks = {}
        let count = 0
        for (let i = 0; i <= maxMark; i += this.state.hourStep) {
            if (count % this.state.markStep == 0) {
                marks[count] = moment.unix(hourly[i].time).tz(timezone).format('HH:mm')
            } else {
                marks[count] = ''
            }
            count++;
        }

        this.setState((prevState) => ({
            ...prevState,
            marks,
            disabled: false
        }))
    }

    render() {
        return (
            <Slider marks={this.state.marks}
                step={1}
                max={this.state.markCount-1}
                included={false}
                disabled={this.state.disabled}
                onChange={(index) => { this.props.onSliderChange(index*this.state.hourStep) }}
            />
        )
    }
}

HourSlider.propTypes = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    onForecastReceived: PropTypes.func.isRequired,
    onForecastError: PropTypes.func.isRequired,
    onSliderChange: PropTypes.func.isRequired,
    forecastURL: PropTypes.string.isRequired,
}

export default HourSlider
