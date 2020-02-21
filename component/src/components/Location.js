import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

class Location extends React.Component {
    constructor(props) {
        super(props)
        
        // bind this to the functions
        this.onPositionSuccess = this.onPositionSuccess.bind(this)

        // set the initial state
        this.state = {
            name: 'Waiting for location'
        }
    }

    componentDidMount() {
        // if browser doesn't support geolocation, fire event and return
        if (!"geolocation" in navigator) {
            this.props.onLocationError(Location.UNSUPPORTED_BROWSER)
            return
        }

        // request the location from the browser
        navigator.geolocation.getCurrentPosition(
            // success
            this.onPositionSuccess,
            // error
            ({ code }) => {
                // pass the error to the callback
                this.props.onLocationError(code)

                // set the name in the state
                this.setState({ name: Location.ERROR_TEXT})
            }
        )
    }

    async onPositionSuccess(position) {
        // destructure the position coordinates to lat/long
        const { latitude, longitude } = position.coords

        // fire callback function
        this.props.onLocationReceived(latitude, longitude)

        try {
            // call the REST API to get the location name
            const url = `${this.props.locationURL}?latitude=${latitude}&longitude=${longitude}`
            const response = await axios.get(url)

            // set the name in the state
            this.setState({ name: response.data })
        } catch (error) {
            // fire error callback function
            this.props.onLocationError(Location.RESPONSE_ERROR)

            // set the location name
            this.setState({ name: Location.ERROR_TEXT})
        }
    }

    render() {
        return (
            <div className="weather__location">{this.state.name}</div>
        )
    }
}

Location.PERMISSION_DENIED = 1
Location.POSITION_UNAVAILABLE = 2
Location.TIMEOUT = 3
Location.UNSUPPORTED_BROWSER = 4
Location.RESPONSE_ERROR = 5
Location.ERROR_TEXT = 'Location unavailable...'

Location.propTypes = {
    onLocationReceived: PropTypes.func.isRequired,
    onLocationError: PropTypes.func.isRequired,
    locationURL: PropTypes.string.isRequired,
}

export default Location