import React from 'react'
import Moment from 'react-moment'
import 'moment-timezone'
import PropTypes from 'prop-types'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faCloud, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import './styles.css'

class WeatherComponent extends React.Component {
    constructor(props) {
        super(props)

        // set the state
        this.state = {
            locationURL: props.locationURL,
            forecastURL: props.forecastURL,
            loading: true,
            browserSupport: null,
            location: null,
            forecast: null
        }

        this.handlePositionReceived = this.handlePositionReceived.bind(this)
        this.getForecast = this.getForecast.bind(this)
        this.getErrorMessage = this.getErrorMessage.bind(this)
        this.getLocationText = this.getLocationText.bind(this)
    }

    componentDidMount() {
        // check the browser supports geolocation
        if ("geolocation" in navigator) {
            // set the support in the state
            this.setState((prevState) => ({
                ...prevState,
                browserSupport: true
            // once state has been set, request the location, handling success and error callbacks
            }), () => {
                navigator.geolocation.getCurrentPosition(this.handlePositionReceived, () => {
                    this.setState((prevState) => ({
                        ...prevState,
                        loading: false
                    }))
                })
            })

        // browser does not support geolocation
        } else {
            this.setState((prevState) => ({
                ...prevState,
                loading: false,
                browserSupport: false
            }))
        }
    }

    async handlePositionReceived(position) {
        try {
            const url = `${this.state.locationURL}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
            const response = await axios.get(url)

            this.setState((prevState) => ({
                ...prevState,
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    name: response.data
                }
            }), this.getForecast)
        } catch (error) {
            this.setState((prevState) => ({
                ...prevState,
                loading: false
            }))
        }
    }

    async getForecast() {
        const url = `${this.state.forecastURL}?latitude=${this.state.location.latitude}&longitude=${this.state.location.longitude}`
        const response = await axios.get(url)

        this.setState((prevState) => ({
            ...prevState,
            forecast: {
                timezone: response.data.timezone,
                current: {
                    summary: response.data.currently.summary,
                    sunriseTime: response.data.daily.data[0].sunriseTime,
                    sunsetTime: response.data.daily.data[0].sunsetTime
                }
            }
        }))
        console.log(response.data)
    }

    getLocationText() {
        return this.state.location ? this.state.location.name : 'Loading...'
    }

    getErrorMessage() {
        if (this.state.loading) {
            return
        }

        if (!this.state.location) {
            if (!this.state.browserSupport) {
                return 'Your browser does not support geolocation'
            } else {
                return 'Unable to get your location'
            }
        }
        else if (!this.state.forecast) {
            return 'Unable to get forecast'
        }
    }

    render() {
        return (
            <div className="weather__container">
                {!this.state.loading && (!this.state.location || !this.state.forecast) && <div className="weather__error"><p>{this.getErrorMessage()}</p></div>}
                <div className="weather__location">
                    <FontAwesomeIcon icon={faLocationArrow} />
                    <span title={this.getLocationText()}>{this.getLocationText()}</span>
                </div>
                <div className="weather__current-row">
                    <div>Next Hour</div>
                    <div>
                        <div className="weather__daylight-time weather__daylight-time--sunrise">
                            <FontAwesomeIcon icon={faSun} color="yellow" />
                            <span>
                                {this.state.forecast ? (
                                    <Moment 
                                        unix 
                                        format="HH:mm" 
                                        tz={this.state.forecast.timezone}
                                    >
                                        {this.state.forecast.current.sunriseTime}
                                    </Moment>
                                ) : '--:--'}
                            </span>
                        </div>
                        <div className="weather__daylight-time">
                            <FontAwesomeIcon icon={faMoon} color="grey" />
                            <span>
                                {this.state.forecast ? (
                                    <Moment
                                        unix
                                        format="HH:mm"
                                        tz={this.state.forecast.timezone}
                                    >
                                        {this.state.forecast.current.sunsetTime}
                                    </Moment>
                                ) : '--:--'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="weather__description">{this.state.forecast ? this.state.forecast.current.summary : '--'}</div>
                <div className="weather__next-24-hours">
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                </div>
                <div className="weather__day">
                    <div>Date</div>
                    <div>Icon</div>
                    <div>Temp</div>
                </div>
            </div>
        )
    }
}

WeatherComponent.propTypes = {
    locationURL: PropTypes.string.isRequired,
    forecastURL: PropTypes.string.isRequired
}

export default WeatherComponent

/*
{
    "latitude": 51.43504,
    "longitude": -0.18166,
    "timezone": "Europe/London",
    "currently": {
        "time": 1574456666,
        "summary": "Overcast",
        "icon": "cloudy",
        "nearestStormDistance": 33,
        "nearestStormBearing": 199,
        "precipIntensity": 0,
        "precipProbability": 0,
        "temperature": 8.45,
        "apparentTemperature": 5.55,
        "dewPoint": 5.86,
        "humidity": 0.84,
        "pressure": 994.1,
        "windSpeed": 11.75,
        "windGust": 29.83,
        "windBearing": 98,
        "cloudCover": 1,
        "uvIndex": 0,
        "visibility": 5.716,
        "ozone": 308.1
    },
    "daily": {
        "summary": "Light rain throughout the week.",
        "icon": "rain",
        "data": [
            {
                "time": 1574380800,
                "summary": "Possible drizzle until afternoon, starting again overnight.",
                "icon": "rain",
                "sunriseTime": 1574407860,
                "sunsetTime": 1574438700,
                "moonPhase": 0.86,
                "precipIntensity": 0.133,
                "precipIntensityMax": 0.9252,
                "precipIntensityMaxTime": 1574380800,
                "precipProbability": 0.93,
                "precipType": "rain",
                "temperatureHigh": 9.97,
                "temperatureHighTime": 1574437140,
                "temperatureLow": 7.48,
                "temperatureLowTime": 1574476980,
                "apparentTemperatureHigh": 7.24,
                "apparentTemperatureHighTime": 1574436540,
                "apparentTemperatureLow": 4.62,
                "apparentTemperatureLowTime": 1574476920,
                "dewPoint": 6.73,
                "humidity": 0.9,
                "pressure": 996.2,
                "windSpeed": 9.61,
                "windGust": 32.58,
                "windGustTime": 1574446560,
                "windBearing": 116,
                "cloudCover": 0.75,
                "uvIndex": 1,
                "uvIndexTime": 1574423340,
                "visibility": 6.231,
                "ozone": 312.7,
                "temperatureMin": 6.24,
                "temperatureMinTime": 1574408580,
                "temperatureMax": 9.97,
                "temperatureMaxTime": 1574437140,
                "apparentTemperatureMin": 4.01,
                "apparentTemperatureMinTime": 1574408400,
                "apparentTemperatureMax": 7.24,
                "apparentTemperatureMaxTime": 1574436540
            },
            {
                "time": 1574467200,
                "summary": "Drizzle in the morning and afternoon.",
                "icon": "rain",
                "sunriseTime": 1574494380,
                "sunsetTime": 1574525040,
                "moonPhase": 0.9,
                "precipIntensity": 0.1338,
                "precipIntensityMax": 0.3286,
                "precipIntensityMaxTime": 1574510700,
                "precipProbability": 0.92,
                "precipType": "rain",
                "temperatureHigh": 10.84,
                "temperatureHighTime": 1574519100,
                "temperatureLow": 4.27,
                "temperatureLowTime": 1574573880,
                "apparentTemperatureHigh": 10.59,
                "apparentTemperatureHighTime": 1574523240,
                "apparentTemperatureLow": 4.54,
                "apparentTemperatureLowTime": 1574573880,
                "dewPoint": 7.39,
                "humidity": 0.91,
                "pressure": 995.1,
                "windSpeed": 9.17,
                "windGust": 31.01,
                "windGustTime": 1574476740,
                "windBearing": 100,
                "cloudCover": 1,
                "uvIndex": 1,
                "uvIndexTime": 1574509680,
                "visibility": 10,
                "ozone": 302.8,
                "temperatureMin": 5.71,
                "temperatureMinTime": 1574553600,
                "temperatureMax": 10.84,
                "temperatureMaxTime": 1574519100,
                "apparentTemperatureMin": 4.62,
                "apparentTemperatureMinTime": 1574476920,
                "apparentTemperatureMax": 10.59,
                "apparentTemperatureMaxTime": 1574523240
            },
            {
                "time": 1574553600,
                "summary": "Possible drizzle overnight.",
                "icon": "partly-cloudy-day",
                "sunriseTime": 1574580900,
                "sunsetTime": 1574611380,
                "moonPhase": 0.94,
                "precipIntensity": 0.0263,
                "precipIntensityMax": 0.1493,
                "precipIntensityMaxTime": 1574640000,
                "precipProbability": 0.32,
                "precipType": "rain",
                "temperatureHigh": 12.07,
                "temperatureHighTime": 1574607540,
                "temperatureLow": 8.92,
                "temperatureLowTime": 1574649240,
                "apparentTemperatureHigh": 11.79,
                "apparentTemperatureHighTime": 1574607540,
                "apparentTemperatureLow": 7.05,
                "apparentTemperatureLowTime": 1574651340,
                "dewPoint": 7.18,
                "humidity": 0.94,
                "pressure": 1004.1,
                "windSpeed": 4.09,
                "windGust": 21.83,
                "windGustTime": 1574640000,
                "windBearing": 171,
                "cloudCover": 0.56,
                "uvIndex": 1,
                "uvIndexTime": 1574596260,
                "visibility": 10,
                "ozone": 273.7,
                "temperatureMin": 4.27,
                "temperatureMinTime": 1574573880,
                "temperatureMax": 12.07,
                "temperatureMaxTime": 1574607540,
                "apparentTemperatureMin": 4.54,
                "apparentTemperatureMinTime": 1574573880,
                "apparentTemperatureMax": 11.79,
                "apparentTemperatureMaxTime": 1574607540
            },
            {
                "time": 1574640000,
                "summary": "Light rain throughout the day.",
                "icon": "rain",
                "sunriseTime": 1574667360,
                "sunsetTime": 1574697720,
                "moonPhase": 0.97,
                "precipIntensity": 0.3719,
                "precipIntensityMax": 1.1923,
                "precipIntensityMaxTime": 1574682720,
                "precipProbability": 0.97,
                "precipType": "rain",
                "temperatureHigh": 11.84,
                "temperatureHighTime": 1574683800,
                "temperatureLow": 9.56,
                "temperatureLowTime": 1574755200,
                "apparentTemperatureHigh": 11.56,
                "apparentTemperatureHighTime": 1574683800,
                "apparentTemperatureLow": 7.33,
                "apparentTemperatureLowTime": 1574755200,
                "dewPoint": 8.94,
                "humidity": 0.9,
                "pressure": 1000.4,
                "windSpeed": 10.9,
                "windGust": 28.96,
                "windGustTime": 1574670300,
                "windBearing": 179,
                "cloudCover": 0.82,
                "uvIndex": 1,
                "uvIndexTime": 1574682420,
                "visibility": 8.342,
                "ozone": 278.4,
                "temperatureMin": 8.92,
                "temperatureMinTime": 1574649240,
                "temperatureMax": 11.84,
                "temperatureMaxTime": 1574683800,
                "apparentTemperatureMin": 7.05,
                "apparentTemperatureMinTime": 1574651340,
                "apparentTemperatureMax": 11.56,
                "apparentTemperatureMaxTime": 1574683800
            },
            {
                "time": 1574726400,
                "summary": "Light rain throughout the day.",
                "icon": "rain",
                "sunriseTime": 1574753880,
                "sunsetTime": 1574784060,
                "moonPhase": 0.01,
                "precipIntensity": 0.4753,
                "precipIntensityMax": 2.1654,
                "precipIntensityMaxTime": 1574791320,
                "precipProbability": 0.96,
                "precipType": "rain",
                "temperatureHigh": 11.82,
                "temperatureHighTime": 1574790000,
                "temperatureLow": 7.44,
                "temperatureLowTime": 1574841600,
                "apparentTemperatureHigh": 11.54,
                "apparentTemperatureHighTime": 1574790000,
                "apparentTemperatureLow": 6.07,
                "apparentTemperatureLowTime": 1574815380,
                "dewPoint": 8.51,
                "humidity": 0.88,
                "pressure": 995.5,
                "windSpeed": 11.67,
                "windGust": 38.62,
                "windGustTime": 1574790900,
                "windBearing": 214,
                "cloudCover": 0.86,
                "uvIndex": 1,
                "uvIndexTime": 1574769000,
                "visibility": 9.208,
                "ozone": 272.9,
                "temperatureMin": 8.28,
                "temperatureMinTime": 1574812800,
                "temperatureMax": 11.82,
                "temperatureMaxTime": 1574790000,
                "apparentTemperatureMin": 6.12,
                "apparentTemperatureMinTime": 1574812800,
                "apparentTemperatureMax": 11.54,
                "apparentTemperatureMaxTime": 1574790000
            },
            {
                "time": 1574812800,
                "summary": "Drizzle in the morning.",
                "icon": "rain",
                "sunriseTime": 1574840340,
                "sunsetTime": 1574870400,
                "moonPhase": 0.04,
                "precipIntensity": 0.0662,
                "precipIntensityMax": 0.25,
                "precipIntensityMaxTime": 1574830380,
                "precipProbability": 0.85,
                "precipType": "rain",
                "temperatureHigh": 11.29,
                "temperatureHighTime": 1574860620,
                "temperatureLow": 7.05,
                "temperatureLowTime": 1574928000,
                "apparentTemperatureHigh": 11.01,
                "apparentTemperatureHighTime": 1574860620,
                "apparentTemperatureLow": 4.68,
                "apparentTemperatureLowTime": 1574928000,
                "dewPoint": 6.95,
                "humidity": 0.88,
                "pressure": 988.6,
                "windSpeed": 8.44,
                "windGust": 29.74,
                "windGustTime": 1574899080,
                "windBearing": 249,
                "cloudCover": 0.87,
                "uvIndex": 1,
                "uvIndexTime": 1574855460,
                "visibility": 9.117,
                "ozone": 291.1,
                "temperatureMin": 7.41,
                "temperatureMinTime": 1574842980,
                "temperatureMax": 11.29,
                "temperatureMaxTime": 1574860620,
                "apparentTemperatureMin": 5.23,
                "apparentTemperatureMinTime": 1574892300,
                "apparentTemperatureMax": 11.01,
                "apparentTemperatureMaxTime": 1574860620
            },
            {
                "time": 1574899200,
                "summary": "Light rain overnight.",
                "icon": "rain",
                "sunriseTime": 1574926860,
                "sunsetTime": 1574956800,
                "moonPhase": 0.08,
                "precipIntensity": 0.0285,
                "precipIntensityMax": 0.1512,
                "precipIntensityMaxTime": 1574985600,
                "precipProbability": 0.61,
                "precipType": "rain",
                "temperatureHigh": 9.82,
                "temperatureHighTime": 1574949300,
                "temperatureLow": 7.04,
                "temperatureLowTime": 1574978160,
                "apparentTemperatureHigh": 7.92,
                "apparentTemperatureHighTime": 1574950020,
                "apparentTemperatureLow": 5.97,
                "apparentTemperatureLowTime": 1574978820,
                "dewPoint": 6.31,
                "humidity": 0.89,
                "pressure": 1002.2,
                "windSpeed": 7.67,
                "windGust": 29.74,
                "windGustTime": 1574899200,
                "windBearing": 272,
                "cloudCover": 0.57,
                "uvIndex": 1,
                "uvIndexTime": 1574942040,
                "visibility": 9.889,
                "ozone": 273.5,
                "temperatureMin": 7.01,
                "temperatureMinTime": 1574929800,
                "temperatureMax": 9.82,
                "temperatureMaxTime": 1574949300,
                "apparentTemperatureMin": 4.67,
                "apparentTemperatureMinTime": 1574928900,
                "apparentTemperatureMax": 7.92,
                "apparentTemperatureMaxTime": 1574950020
            },
            {
                "time": 1574985600,
                "summary": "Light rain until evening.",
                "icon": "rain",
                "sunriseTime": 1575013320,
                "sunsetTime": 1575043140,
                "moonPhase": 0.11,
                "precipIntensity": 0.3418,
                "precipIntensityMax": 1.1554,
                "precipIntensityMaxTime": 1574997540,
                "precipProbability": 0.97,
                "precipType": "rain",
                "temperatureHigh": 12.14,
                "temperatureHighTime": 1575036780,
                "temperatureLow": 5.24,
                "temperatureLowTime": 1575100800,
                "apparentTemperatureHigh": 11.86,
                "apparentTemperatureHighTime": 1575036780,
                "apparentTemperatureLow": 3.7,
                "apparentTemperatureLowTime": 1575100800,
                "dewPoint": 6.57,
                "humidity": 0.84,
                "pressure": 1003.4,
                "windSpeed": 10.35,
                "windGust": 37.6,
                "windGustTime": 1575034080,
                "windBearing": 194,
                "cloudCover": 0.93,
                "uvIndex": 1,
                "uvIndexTime": 1575028140,
                "visibility": 8.614,
                "ozone": 255.4,
                "temperatureMin": 6.84,
                "temperatureMinTime": 1575072000,
                "temperatureMax": 12.14,
                "temperatureMaxTime": 1575036780,
                "apparentTemperatureMin": 4.97,
                "apparentTemperatureMinTime": 1575072000,
                "apparentTemperatureMax": 11.86,
                "apparentTemperatureMaxTime": 1575036780
            }
        ]
    },
    "offset": 0
}
*/