const apiKey = '44fc3ca2c815e5c3900184bf465d824f';

const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const weatherDetails = document.getElementById('weather-details');
const tempChartCtx = document.getElementById('tempChart').getContext('2d');
let tempChart;

// Function to fetch weather data for multiple cities
async function getWeather(cities) {
    const weatherData = [];

    for (const city of cities) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            weatherData.push({
                name: data.name,
                temp: data.main.temp,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed
            });
        } else {
            alert(`City not found: ${city}`);
        }
    }

    return weatherData;
}

// Function to render weather details and chart
function renderWeather(data) {
    weatherDetails.innerHTML = ''; // Clear existing content

    const labels = [];
    const temperatures = [];

    data.forEach(city => {
        labels.push(city.name);
        temperatures.push(city.temp);

        // Add city weather details
        weatherDetails.innerHTML += `
            <div class="weather-details">
                <h3>${city.name}</h3>
                <p>Temperature: ${city.temp}°C</p>
                <p>Description: ${city.description}</p>
                <p>Humidity: ${city.humidity}%</p>
                <p>Wind Speed: ${city.windSpeed} m/s</p>
            </div>
            <hr>
        `;
    });

    // Update chart
    if (tempChart) {
        tempChart.destroy(); // Destroy old chart instance
    }

    tempChart = new Chart(tempChartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 5,
                fill: true,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value + '°C'; // Add °C to the y-axis labels
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        }
                    }
                }
            }
        }
    });
}

// Event listener for form submission
cityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cities = cityInput.value.split(',').map(city => city.trim());
    
    if (cities.length > 0) {
        const weatherData = await getWeather(cities);
        renderWeather(weatherData);
    }
});
