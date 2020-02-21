import React from 'react'
import PropTypes from 'prop-types'
import clearDayIcon from '../icons/clear-day.svg'
import clearNightIcon from '../icons/clear-night.svg'
import cloudyIcon from '../icons/cloudy.svg'
import fogIcon from '../icons/fog.svg'
import partlyCloudyDayIcon from '../icons/partly-cloudy-day.svg'
import partlyCloudyNightIcon from '../icons/partly-cloudy-night.svg'
import rainIcon from '../icons/rain.svg'
import sleetIcon from '../icons/sleet.svg'
import snowIcon from '../icons/snow.svg'
import windIcon from '../icons/wind.svg'
import defaultIcon from '../icons/default.svg'

class HourSlider extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let icon
        switch (this.props.name) {
            case 'clear-day':
                icon = clearDayIcon
                break
            case 'clear-night':
                icon = clearNightIcon
                break
            case 'rain':
                icon = rainIcon
                break
            case 'snow':
                icon = snowIcon
                break
            case 'sleet':
                icon = sleetIcon
                break
            case 'wind':
                icon = windIcon
                break
            case 'fog':
                icon = fogIcon
                break
            case 'cloudy':
                icon = cloudyIcon
                break
            case 'partly-cloudy-day':
                icon = partlyCloudyDayIcon
                break
            case 'partly-cloudy-night':
                icon = partlyCloudyNightIcon
                break
            default:
                icon = defaultIcon
                break
        }

        return (
            <img src={icon} className="weather__icon" />
        )
    }
}

HourSlider.propTypes = {
    name: PropTypes.string.isRequired,
}

export default HourSlider
