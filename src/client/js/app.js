import { appendData } from './appendData';

// fetch data from server
const getDestinationForecast = async (url, data) => {
    const request = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        return await request.json();
    } catch (error) {
        console.log('getDestinationForecast error: ', error)
        return ({ success: false });
    }
};

// Handle search request
export const handleSearch = async (event) => {
    event.preventDefault();

    // get search inputs
    const city = document.getElementById('location').value;
    const date = document.getElementById('arrival_date').value;

    const data = {
        city: city,
        arrivalDate: date
    };

    // Get weather forecast from server
    const forecast = await getDestinationForecast('http://localhost:8000/destination', data);
    
    // Append data else prompt error
    forecast.success ? appendData(forecast.destination) : alert('Location not found');
};
