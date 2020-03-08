import React from 'react'
import PropTypes from 'prop-types'
import clearDayIcon from '../icons/clear-day.png'
import clearNightIcon from '../icons/clear-night.png'
import cloudyIcon from '../icons/cloudy.png'
import fogIcon from '../icons/fog.png'
import partlyCloudyDayIcon from '../icons/partly-cloudy-day.png'
import partlyCloudyNightIcon from '../icons/partly-cloudy-night.png'
import rainIcon from '../icons/rain.png'
import sleetIcon from '../icons/sleet.png'
import snowIcon from '../icons/snow.png'
import windIcon from '../icons/wind.png'
import defaultIcon from '../icons/default.png'

class Icon extends React.Component {
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

Icon.propTypes = {
    name: PropTypes.string.isRequired,
}

export default Icon
