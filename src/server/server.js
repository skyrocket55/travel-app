// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middleware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Setup dotenv
const dotenv = require('dotenv');
dotenv.config();

// Make API requests
const fetch = require('node-fetch');

// Setup empty JS object to act as endpoint
const trips = {};
let destinationData = {};

// Initialize the main project folder
app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'));
});

// Setup Server
const port = 8000;
app.listen(port, () => { console.log(`App running on localhost:${port}`) });

// GET Geo Location
const getGeoLocation = async (location, username) => {
    // Geonames API
    const baseUrl = 'http://api.geonames.org/searchJSON?maxRows=1';
    const apiEndpoint = await fetch(`${baseUrl}&q=${location}&username=${username}`);
    return await apiEndpoint.json();
}

// GET Picture of destination
const getPicture = async (key, city, country) => {
    // Pixabay API
    const baseUrl = 'https://pixabay.com/api/?image_type=photo';
    const apiEndpoint = await fetch(`${baseUrl}&key=${key}&q=${city}+${country}`);
    return await apiEndpoint.json();
}

// GET Weather Forecast
const getForecast = async (userKey, cityId, date, difference) => {
    const oneDay = 60 * 60 * 1000 * 24;
    let baseUrl = "";
        if (difference > oneDay * 15) {
            baseUrl = `https://api.weatherbit.io/v2.0/history/daily?start_date=2019-${date.getMonth() + 1}-${date.getDate()}&end_date=2019-${date.getMonth() + 1}-${date.getDate() + 1}`
        } else {
            baseUrl = `http://api.weatherbit.io/v2.0/forecast/daily?`
        }

    const request = await fetch(`${baseUrl}&city_id=${cityId}&key=${userKey}`);
    return await request.json();
}

// GET homepage
app.get('/', (req, res) => {
    res.sendFile('dist.html');
})

// POST geolocation, picture and weather data
app.post('/destination', async (req, res) => {
    // reset current destination
    destination = {};

    try {
        // search inputs
        const city = req.body.city;
        const travelDate = new Date(req.body.arrivalDate);

        // get timezone offset
        const now = new Date();
        const timeOffset = now.getTimezoneOffset() * 60000;
        
        // To calculate the no. of days between two dates
        destinationData.arrivalDate = travelDate.getTime();
        const dateNow = new Date();
        dateNow.setHours(0,0,0,0);
        const difference = (destinationData.arrivalDate - dateNow) + timeOffset;

        // Get geo location    
        const geoLocation = await getGeoLocation(city, process.env.GEONAMES_USERID);
        destinationData.city = geoLocation.geonames[0].name;
        destinationData.country = geoLocation.geonames[0].countryName;
        destinationData.cityId = geoLocation.geonames[0].geonameId;

        // Pull image of location
        const locationImg = await getPicture(process.env.PIXABAY_API_KEY, destinationData.city, destinationData.country);
        destinationData.imageUrl = locationImg.hits[0].webformatURL;

        // Chain async getForecast then send response to update UI
        getForecast(process.env.WEATHERBIT_API_KEY, destinationData.cityId, travelDate, difference)
            .then((data) => {
                const days = difference / 1000 / 60 / 60 / 24;
                destinationData.days = days;

                if (days >= 0 && days < 16) {
                    destinationData.weather = data.data[days].weather.description;
                    destinationData.highTemp = data.data[days].high_temp;
                    destinationData.lowTemp = data.data[days].low_temp;
                } else {
                    destinationData.weather = 'No weather forecast for this city';
                }
                return destinationData;
            })
            .then((destinationData) => {
                res.json({
                    success: true,
                    destination: destinationData
                });
            });
    } catch (error) {
        console.log('post error: ', error);
        res.send({ success: false });
    }
})

module.exports = app;