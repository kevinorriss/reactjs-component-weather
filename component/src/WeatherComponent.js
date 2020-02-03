import React from 'react'
import Moment from 'react-moment'
import moment from 'moment-timezone'
import Slider from 'rc-slider'
import PropTypes from 'prop-types'
import axios from 'axios'
import './styles.css'
import 'rc-slider/assets/index.css'

class WeatherComponent extends React.Component {
    // set the components default property values
    static defaultProps = {
        sliderMarks: 11,
        sliderMarkStep: 2,
        sliderStep: 1
    }

    constructor(props) {
        super(props)

        // set the default state
        this.state = {
            loading: true,
            browserSupport: null,
            location: null,
            forecast: null,
            selectedHour: null
        }

        // bind this to the functions
        this.handlePositionReceived = this.handlePositionReceived.bind(this)
        this.getForecast = this.getForecast.bind(this)
        this.getErrorMessage = this.getErrorMessage.bind(this)
        this.getLocationText = this.getLocationText.bind(this)
        this.getSliderMarks = this.getSliderMarks.bind(this)
        this.onSliderChange = this.onSliderChange.bind(this)
    }

    componentDidMount() {
        // check the browser supports geolocation
        /*if ("geolocation" in navigator) {
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
        }*/

        this.setState((prevState) => ({
            ...prevState,
            loading: false,
            browserSupport: true,
            location: {
                latitude: '51.435040',
                longitude: '-0.181660',
                name: 'Earlsfield, London, UK'
            },
            forecast: {
                timezone: "Europe/London",
                currently: {
                    summary: "Clear",
                    icon: "clear-night",
                    temperature: 4.5,
                    sunriseTime: 1577866020,
                    sunsetTime: 1577894580
                },
                hourly: [
                    {
                        time: 1577908800,
                        summary: "Clear",
                        icon: "clear-night",
                        temperature: 4.52,
                        precipProbability: 0.01,
                        humidity: 0.97,
                        windSpeed: 3.34
                    },
                    {
                        time: 1577912400,
                        summary: "Clear",
                        icon: "clear-night",
                        temperature: 4.48,
                        precipProbability: 0,
                        humidity: 0.98,
                        windSpeed: 3.38
                    },
                    {
                        time: 1577916000,
                        summary: "Clear",
                        icon: "clear-night",
                        temperature: 4.5,
                        precipProbability: 0.01,
                        humidity: 1,
                        windSpeed: 3.53
                    }
                ],
                daily: [
                    {
                        time: 1577836800,
                        summary: "Clear throughout the day.",
                        icon: "clear-day",
                        sunriseTime: 1577866020,
                        sunsetTime: 1577894580,
                        temperatureMin: 0.5,
                        temperatureMax: 7.11
                    },
                    {
                        time: 1577923200,
                        summary: "Possible drizzle overnight.",
                        icon: "rain",
                        sunriseTime: 1577952420,
                        sunsetTime: 1577981040,
                        temperatureMin: 4.51,
                        temperatureMax: 11.39
                    },
                    {
                        time: 1578009600,
                        summary: "Overcast throughout the day.",
                        icon: "rain",
                        sunriseTime: 1578038820,
                        sunsetTime: 1578067500,
                        temperatureMin: 4.21,
                        temperatureMax: 10.98
                    }
                ]
            }
        }))
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
            forecast: response.data
        }))
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

    getSliderMarks() {
        let marks = {}
        for (var i=0; i<this.props.sliderMarks; i++) { marks[i] = '' }

        if (this.state.loading || !this.state.forecast) {
            return marks
        }

        this.state.forecast.hourly.forEach((hour, i) => {
            if (i % this.props.sliderMarkStep) {
                marks[i] = moment.unix(hour.time).tz(this.state.forecast.timezone).format('HH:mm')
            }
        })

        return marks
    }

    onSliderChange (i) {
        this.setState((prevState) => ({
            ...prevState,
            selectedHour: this.state.forecast.hourly[i]
        }))
    }

    render() {

        let currentHourSummary
        if (this.state.selectedHour) {
            currentHourSummary = 
                <span>
                    <Moment unix format="ddd HH:mm" tz={this.state.forecast.timezone}>{this.state.selectedHour.time}</Moment>
                    , {this.state.selectedHour.summary}
                </span>
        } else {
            currentHourSummary = <span>&nbsp;</span>
        }

        return (
            <div className="weather__container">
                {!this.state.loading && (!this.state.location || !this.state.forecast) && <div className="weather__error"><p>{this.getErrorMessage()}</p></div>}
                <p className="weather__location" title={this.getLocationText()}>{this.getLocationText()}</p>
                <p className="weather__current-hour">{currentHourSummary}</p>
                <Slider
                    marks={this.getSliderMarks()}
                    step={this.props.sliderStep}
                    max={this.props.sliderMarks}
                    included={false}
                    onChange={this.onSliderChange}
                />
            </div>
        )
    }
}

WeatherComponent.propTypes = {
    locationURL: PropTypes.string.isRequired,
    forecastURL: PropTypes.string.isRequired,
    sliderMarks: PropTypes.number,
}

export default WeatherComponent