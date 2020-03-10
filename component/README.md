# Weather Component

A weather forecast React component with an express API

## Prerequisites

For the API to work, you will need an account with the following API providers:

* [Mapbox](https://docs.mapbox.com/api/search/#geocoding) - Geocoding API
* [Dark Sky](https://darksky.net/dev) - Weather Forecast API

Create a free account to obtain your own API token

## Installing

```
npm install @kevinorriss/weather
```

Add your API tokens to the following environment variables (server side)

* DARKSKY_TOKEN
* MAPBOX_TOKEN

## Usage

Import the component, passing in the relative URLs you'd like the component to call to access the API

```
import WeatherComponent from '@kevinorriss/weather'

...

<!-- JSX -->
<div className="your-container">
    <WeatherComponent locationURL="/weather/location" forecastURL="/weather/forecast" />
</div>
```

Add the API to your express routes, passing in your darksky and mapbox tokens

```
import WeatherApi from '@kevinorriss/weather/build/WeatherApi'

...

// create weather data instance
const weather = new WeatherApi(process.env.DARKSKY_TOKEN, process.env.MAPBOX_TOKEN)

// define routes
app.get('/weather/location', weather.location)
app.get('/weather/forecast', weather.forecast)
```

## Development

This repo comes with a react app for development purposes. To get started, open a terminal in the root of the project and then:

### Link the component to the client / server
```
cd ./component
yarn link

cd ../client
yarn link @kevinorriss/weather

cd ../server
yarn link @kevinorriss/weather
```

### Start the app
```
yarn run dev
```

Whenever you make a change to the component code, the react app will update.

## Tests
```
cd ./component/
yarn test:watch
```

This project uses Jest and Enzyme for its unit tests, simply run the above code to run the test suites.

## Author

* **Kevin Orriss** - [orriss.io](http://orriss.io)

## License

This project is licensed under the ISC License