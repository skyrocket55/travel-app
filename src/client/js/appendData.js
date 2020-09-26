// Reset data
const clearModal = () => {
    document.getElementById('high_temp').innerHTML = '';
    document.getElementById('low_temp').innerHTML = '';
    document.getElementById('weather').innerHTML = '';
    document.getElementById('num_days').innerHTML = '';
};

// Append data
export const appendData = (destinationData) => {
    // To calculate the no. of days between two dates
    const dateNow = new Date();
    dateNow.setHours(0,0,0,0);
    const timeOffset = dateNow.getTimezoneOffset() * 60000;
    const date = new Date(destinationData.arrivalDate);
    const diff = (destinationData.arrivalDate - dateNow + timeOffset)/1000/60/60/24;
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    clearModal();

    // append data to modal window
    document.getElementById('modal_info_img').src = destinationData.imageUrl;
    document.getElementById('date').innerHTML = `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
    document.querySelectorAll('.city').forEach(item =>{item.innerHTML = destinationData.city;});
    document.querySelectorAll('.country').forEach(item =>{item.innerHTML = destinationData.country;});

    // days away from the trip
    if (diff === 0) {
        document.getElementById('num_days').innerHTML = 'is today';
    } else if (diff === 1) {
        document.getElementById('num_days').innerHTML = 'is 1 day away';
    } else {
        document.getElementById('num_days').innerHTML = `is ${diff} days away`;
    }

    // temperature
    if (destinationData.highTemp && destinationData.lowTemp) {
        document.getElementById('high_temp').innerHTML = `High: ${destinationData.highTemp}&#8451;`;
        document.getElementById('low_temp').innerHTML = `, Low: ${destinationData.lowTemp}&#8451;`;
    }
    
    // weather description
    if (destinationData.weather) {
        document.getElementById('weather').innerHTML = destinationData.weather;
    }
}
