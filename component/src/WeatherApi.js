const axios = require('axios')

class WeatherApi {
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
            // check the request query params exist
            if (typeof req.query.longitude === "undefined") { res.status(400).send({msg: 'longitude is required'}); return }
            if (typeof req.query.latitude === "undefined") { res.status(400).send({msg: 'latitude is required'}); return }

            // parse the lat/long to numbers
            const longitude = Number(req.query.longitude)
            const latitude = Number(req.query.latitude)

            // if the query params are not numbers, error
            if (isNaN(longitude)) { res.status(400).send({msg: 'longitude must be a number'}); return }
            if (isNaN(latitude)) { res.status(400).send({msg: 'latitude must be a number'}); return }

            // create the request URL
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${this.mapboxToken}&types=locality,place`
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

            if (location.length === 0) {
                location = 'Unknown Location'
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
            // check the request query params exist
            if (typeof req.query.longitude === "undefined") { res.status(400).send({msg: 'longitude is required'}); return }
            if (typeof req.query.latitude === "undefined") { res.status(400).send({msg: 'latitude is required'}); return }

            // parse the lat/long to numbers
            const longitude = Number(req.query.longitude)
            const latitude = Number(req.query.latitude)

            // if the query params are not numbers, error
            if (isNaN(longitude)) { res.status(400).send({msg: 'longitude must be a number'}); return }
            if (isNaN(latitude)) { res.status(400).send({msg: 'latitude must be a number'}); return }
            
            // create the request URL and get the forecast
            const url = `https://api.darksky.net/forecast/${this.darkskyToken}/${latitude},${longitude}?units=${this.units}&exclude=currently,minutely,alerts,flags`
            const response = await axios.get(url)

            // create the return forecast object
            let forecast = {
                timezone: response.data.timezone,
                hourly: [],
                daily: []
            }

            // map the response hourly data, returning an empty array on error
            try {
                forecast.hourly = response.data.hourly.data.map((h) => ({
                    time: h.time || null,
                    summary: h.summary,
                    icon: h.icon,
                    temperature: h.temperature,
                    precipProbability: h.precipProbability,
                    humidity: h.humidity,
                    windSpeed: h.windSpeed
                }))
            } catch (e) { /* do nothing */ }

            // map the response daily data, returning an empty array on error
            try {
                forecast.daily = response.data.daily.data.filter((d, index) => index < 7).map((d) => ({
                    time: d.time,
                    summary: d.summary,
                    icon: d.icon,
                    temperatureMin: d.temperatureMin,
                    temperatureMax: d.temperatureMax
                }))
            } catch (e) { /* do nothing */ }

            // return the forecast
            res.json(forecast)
        // throw a 500 status on error
        } catch (error) {
            res.status(500).send({msg: 'Server Error'})
        }
    }
}

module.exports = WeatherApi