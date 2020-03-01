import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import Location from './components/Location'
import HourSlider from './components/HourSlider'
import Icon from './components/Icon'
import './styles.css'

class WeatherComponent extends React.Component {
    constructor(props) {
        super(props)
        this.onLocationReceived = this.onLocationReceived.bind(this)
        this.onLocationError = this.onLocationError.bind(this)
        this.onForecastReceived = this.onForecastReceived.bind(this)
        this.onForecastError = this.onForecastError.bind(this)
        this.onSliderChange = this.onSliderChange.bind(this)

        this.state = {
            position: {
                latitude: null,
                longitude: null
            },
            timezone: null,
            daily: null,
            hourly: null,
            currentHour: null,
            error: null
        }
    }

    onLocationReceived(latitude, longitude) {
        // set the position in the state
        this.setState((prevState) => ({
            ...prevState,
            position: {
                latitude,
                longitude
            }
        }))
    }

    onLocationError(code) {
        // pick the error message depending on code passed
        let errorMessage
        switch (code) {
            case Location.PERMISSION_DENIED:
                errorMessage = 'Permission to read your location was denied'
                break
            case Location.POSITION_UNAVAILABLE:
                errorMessage = 'Your position is unavailable'
                break
            case Location.TIMEOUT:
                errorMessage = 'Getting your position timed out'
                break
            case Location.UNSUPPORTED_BROWSER:
                errorMessage = 'Your browser does not support geolocation'
                break
            case Location.RESPONSE_ERROR:
                errorMessage = 'An error occurred in the response to getting your location information'
                break
            default:
                errorMessage = 'An unknown error occured'
                break
        }

        // set the error in the state
        this.setState((prevState) => ({
            ...prevState,
            error: errorMessage
        }))
    }

    onNameReceived(name) {
        console.log(`onNameReceived:${name}`)
    }

    onForecastReceived(forecast) {
        this.setState((prevState) => ({
            ...prevState,
            timezone: forecast.timezone,
            daily: forecast.daily,
            hourly: forecast.hourly,
            currentHour: forecast.hourly[0]
        }))
    }

    onForecastError() {
        console.log('forecast error')
    }

    onSliderChange(index) {
        this.setState((prevState) => ({
            ...prevState,
            currentHour: prevState.hourly[index]
        }))
    }

    render() {
        return (
            <div className="weather__container">
                {this.state.error && (
                    <div className="weather__error">
                        <p>{this.state.error}</p>
                    </div>
                )}
                <Location
                    onLocationReceived={this.onLocationReceived}
                    onNameReceived={this.onNameReceived}
                    onLocationError={this.onLocationError}
                    locationURL={this.props.locationURL}/>
                <div>
                    <p className="weather__current-summary" 
                        title={this.state.currentHour && this.state.currentHour.summary}>
                        {this.state.currentHour ? (
                            <React.Fragment>
                                <Moment unix
                                    format="ddd HH:mm"
                                    tz={this.state.timezone}>
                                    {this.state.currentHour.time}
                                </Moment>, {this.state.currentHour.summary}
                            </React.Fragment>
                        ) : (
                            <span>Loading weather data...</span>
                        )
                    }</p>
                    <div className="weather__current-forecast">
                        {this.state.currentHour ? (
                            <React.Fragment>
                                <Icon name={this.state.currentHour.icon}/>
                                <div className="weather__current-temp">
                                    {Math.floor(this.state.currentHour.temperature)}&deg;C
                                </div>
                                <div className="weather__current-perc">
                                    <p>Precip: {Math.floor(this.state.currentHour.precipProbability*100)}%</p>
                                    <p>Humidity: {Math.floor(this.state.currentHour.humidity*100)}%</p>
                                    <p>Wind: {Math.floor(this.state.currentHour.windSpeed)} mph</p>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Icon name="default" />
                                <div className="weather__current-temp">--</div>
                                <div className="weather__current-perc">
                                    <p>Precip: --</p>
                                    <p>Humidity: --</p>
                                    <p>Wind: --</p>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                <div className="weather__slider">
                <HourSlider
                    latitude={this.state.position.latitude}
                    longitude={this.state.position.longitude}
                    onForecastReceived={this.onForecastReceived}
                    onForecastError={this.onForecastError}
                    forecastURL={this.props.forecastURL}
                    onSliderChange={this.onSliderChange}/>
                </div>
                <div className="weather__daily">
                {this.state.daily ? (
                    this.state.daily.map((day, index) => (
                        <div className="weather__day" title={day.summary} key={index}>
                            <Moment unix format="ddd" tz={this.state.timezone}>{day.time}</Moment>
                            <Icon name={day.icon} />
                            <p className="weather__temp">{Math.floor(day.temperatureMax)}&deg;C</p>
                            <p className="weather__temp weather__temp--low">{Math.floor(day.temperatureMin)}&deg;C</p>
                        </div>
                    ))
                ) : (
                    <div className="weather__day">
                        <Moment unix format="[--]">{0}</Moment>
                        <Icon name="default" />
                        <p className="weather__temp">--</p>
                        <p className="weather__temp weather__temp--low">--</p>
                    </div>
                )}
                </div>
                <p className="weather__icon-link">
                    <a href="https://www.freepik.com/free-vector/weather-icons-set_709126.htm" 
                        target="_blank">Icons created by freepik - www.freepik.com</a>
                </p>
            </div>
        )
    }
}

WeatherComponent.propTypes = {
    locationURL: PropTypes.string.isRequired,
    forecastURL: PropTypes.string.isRequired
}

export default WeatherComponent