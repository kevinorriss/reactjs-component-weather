import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faCloud, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import './styles.css'

class Weather extends React.Component {
    constructor(props) {
        super(props)

        // set the state
        this.state = {
            loading: true,
            location: null,
            forecast: null
        }

        // this.tick = this.tick.bind(this)
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(this.handlePositionReceived)
        }
        else {
            this.setState((prevState) => ({
                ...prevState,
                loading: false
            }))
        }
    }

    handlePositionReceived(position) {
        console.log(`you are at (lat:${position.coords.latitude}, long:${position.coords.longitude})`)

        const endpoint = 'pk.eyJ1Ijoia2V2aW5vcnJpc3MiLCJhIjoiY2p3YzJuODJ0MGx4eDN6bHpwbmo4cW81YiJ9.hjqLPSpKKNToaSIDALsFQw'
        const longitude = position.coords.longitude
        const latitude = position.coords.latitude
        const url = `https://api.mapbox.com/geocoding/v5/${endpoint}/${longitude},${latitude}.json`

        request({ url, json: true }, (error, { body }) => {
            if (error) {
                callback('Unable to connect to location services!')
            } else if (body.features.length === 0) {
                callback('Unable to find location. Try another search.')
            } else {
                callback(undefined, { longitude: body.features[0].center[0], latitude: body.features[0].center[1], location: body.features[0].place_name })
            }
        })
        

        // this.setState((prevState) => ({
        //     ...prevState,
        //     location: {
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude,
        //         name: ''
        //     }
        // }))
    }

    render() {
        return this.state.mounting ? (<p>Loading...</p>) : (
            <div className="weather__container">
                <div className="weather__location">
                    <FontAwesomeIcon icon={faLocationArrow} />
                    <span>Earlsfield</span>
                </div>
                <div className="weather__current-row">
                    <div>Next Hour</div>
                    <div>
                        <div className="weather__daylight-time weather__daylight-time--sunrise">
                            <FontAwesomeIcon icon={faSun} color="yellow" />
                            <span>07:15</span>
                        </div>
                        <div className="weather__daylight-time">
                            <FontAwesomeIcon icon={faMoon} color="grey" />
                            <span>16:15</span>
                        </div>
                    </div>
                </div>
                <div className="weather__description">Light cloud and a gentle breeze</div>
                <div className="weather__next-24-hours">
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                    <div className="weather__hour"><div>Time</div><div>Icon</div><div>Temp</div></div>
                </div>
                <div className="weather__day">
                    <div>Date</div>
                    <div>Icon</div>
                    <div>Temp</div>
                </div>
                <div className="weather__day">
                    <div>Date</div>
                    <div>Icon</div>
                    <div>Temp</div>
                </div>
                <div className="weather__day">
                    <div>Date</div>
                    <div>Icon</div>
                    <div>Temp</div>
                </div>
                <div className="weather__day">
                    <div>Date</div>
                    <div>Icon</div>
                    <div>Temp</div>
                </div>
                <div className="weather__day">
                    <div>Date</div>
                    <div>Icon</div>
                    <div>Temp</div>
                </div>
                <div className="weather__day">
                    <div>Date</div>
                    <div>Icon</div>
                    <div>Temp</div>
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

export default Weather