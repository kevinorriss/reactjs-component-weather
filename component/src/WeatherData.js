const axios = require('axios')

class WeatherData {
    constructor(darkskyToken, mapboxToken, units='uk2') {
        this.darkskyToken = darkskyToken
        this.mapboxToken = mapboxToken
        this.units = units

        this.location = this.location.bind(this)
        this.forecast = this.forecast.bind(this)
    }

    /**
     * Gets the name of the location specified by the lat/long coordinates in the request query
     * 
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @return {String} The name of the location (e.g. 'London') at the specified coordinates
     */
    async location(req, res) {
        try {
            // create request variables
            const lat = encodeURIComponent(req.query.latitude)
            const long = encodeURIComponent(req.query.longitude)
            const token = encodeURIComponent(this.mapboxToken)

            // create the request URL
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${token}&types=locality,place`
            const response = await axios.get(url)

            let types = []
            response.data.features.forEach(f => {types[f.place_type[0]] = f.text})

            if (types)
    
            res.send(`${types['locality']}, ${types['place']}`)
        // throw a 500 status on error
        } catch (error) {
            res.status(500).send({msg: 'Server Error'})
        }
    }

    async forecast(req, res) {
        try {
            // create request variables
            const lat = encodeURIComponent(req.query.latitude)
            const long = encodeURIComponent(req.query.longitude)
            const token = encodeURIComponent(this.darkskyToken)
            const units = encodeURIComponent(this.units)
            
            // create the request URL
            const url = `https://api.darksky.net/forecast/${token}/${lat},${long}?units=${units}&exclude=minutely,hourly,alerts,flags`

            const response = await axios.get(url)
            res.json(response.data)
        // throw a 500 status on error
        } catch (error) {
            res.status(500).send({msg: 'Server Error'})
        }
    }
}

export default WeatherData