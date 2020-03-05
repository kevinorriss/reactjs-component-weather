const latitude = 51.505455
const longitude = 0.075356

module.exports = {
    position: {
        latitude,
        longitude
    },
    response: {
        data: {
            latitude,
            longitude,
            timezone: 'Europe/London',
            hourly: {
                summary: 'Light rain starting tomorrow morning.',
                icon: 'rain',
                data: [
                    { time: 1582477200, summary: 'Overcast', icon: 'cloudy', precipProbability: 0.05, temperature: 8.57, humidity: 0.71, windSpeed: 10.71 },
                    { time: 1582577200, summary: 'Rain', icon: 'rain', precipProbability: 0.82, temperature: 7.34, humidity: 0.82, windSpeed: 6.31 }
                ]
            },
            daily: {
                summary: 'Rain throughout the week.',
                icon: 'rain',
                data: [
                    { time: 1582416000, summary: 'Light rain', icon: 'rain', temperatureMin: 6.37, temperatureMax: 13.47 },
                    { time: 1582516000, summary: 'Overcast', icon: 'cloudy', temperatureMin: 4.23, temperatureMax: 12.42 }
                ]
            }
        }
    }
}