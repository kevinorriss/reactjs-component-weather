import React from 'react'
import PropTypes from 'prop-types'
const axios = require('axios')

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
        if (typeof navigator.geolocation === "undefined") {
            // set the error text
            this.setState({ name: Location.ERROR_TEXT })

            // call the location error callback
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
        try {
            // destructure the position coordinates to lat/long
            const { latitude, longitude } = position.coords

            // fire callback function
            this.props.onLocationReceived(latitude, longitude)

            // call the REST API to get the location name
            const url = `${this.props.locationURL}?latitude=${latitude}&longitude=${longitude}`
            const response = await axios.get(url)

            // set the name in the state
            this.setState({ name: response.data })

            // call the name received callback
            if (this.props.onNameReceived) {
                this.props.onNameReceived(response.data)
            }
        } catch (error) {
            // set the location name
            this.setState({ name: Location.ERROR_TEXT})

            // fire error callback function
            this.props.onLocationError(Location.RESPONSE_ERROR)
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
    onNameReceived: PropTypes.func,
    locationURL: PropTypes.string.isRequired
}

export default Location