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
     * Gets the name of the location specified by the lat/long coordinates in the request query.
     * 
     * Returns an empty string if the mapbox api doesn't return anything from the coordinates.
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

            // append locality if exists
            let location = ''
            if ('locality' in types) {
                location += types['locality']
            }

            // append place if exists, adding a comma providing locality exists too
            if ('place' in types) {
                if (location.length > 0) {
                    location += ', '
                }
                location += types['place']
            }

            // send back the location or an empty string if no location found
            res.send(location)
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
            
            // create the request URL and get the forecast
            const url = `https://api.darksky.net/forecast/${token}/${lat},${long}?units=${units}&exclude=currently,minutely,alerts,flags`
            const response = (await axios.get(url))

            // return only the data needed
            res.json({
                timezone: response.data.timezone,
                hourly: response.data.hourly.data.map((h) => ({
                    time: h.time,
                    summary: h.summary,
                    icon: h.icon,
                    temperature: h.temperature,
                    precipProbability: h.precipProbability,
                    humidity: h.humidity,
                    windSpeed: h.windSpeed
                })),
                daily: response.data.daily.data.filter((d, index) => index < 7).map((d) => ({
                    time: d.time,
                    summary: d.summary,
                    icon: d.icon,
                    temperatureMin: d.temperatureMin,
                    temperatureMax: d.temperatureMax
                }))
            })
        // throw a 500 status on error
        } catch (error) {
            res.status(500).send({msg: 'Server Error'})
        }
    }
}

export default WeatherData