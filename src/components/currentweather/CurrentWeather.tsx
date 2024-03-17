import React from 'react';
import './CurrentWeather.css';

// Interfaces
interface WeatherData {
    city: string;
    weather: [{
        description: string;
        icon: string;
    }];
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    wind: {
        speed: number;
    };
}

interface CurrentWeatherProps {
    data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
    // Conditionally render the weather data if it exists
    if (!data) return null;

    return (
        <div className="weather">
            <div className="weather-top">
                <div>
                    {/* Displaying the city name and current weather description */}
                    <p className="weather-city">{data.city}</p>
                    <p className="weather-description">{data.weather[0].description}</p>
                </div>
                {/* Weather icon indicating current weather condition */}
                <img
                    alt="weather icon"
                    className="weather-icon"
                    src={`icons/${data.weather[0].icon}.png`}
                />
            </div>
            <div className="weather-bottom">
                {/* Rounded temperature value for better readability */}
                <p className="weather-temperature">{Math.round(data.main.temp)}°C</p>
                <div className="weather-details">
                    {/* A summary of additional weather details like feels like, wind, etc. */}
                    <div className="weather-parameter-row">
                        <span className="parameter-label">Details</span>
                    </div>
                    <div className="weather-parameter-row">
                        <span className="parameter-label">Feels like</span>
                        <span className="parameter-value">{Math.round(data.main.feels_like)}°C</span>
                    </div>
                    <div className="weather-parameter-row">
                        <span className="parameter-label">Wind</span>
                        <span className="parameter-value">{data.wind.speed} m/s</span>
                    </div>
                    <div className="weather-parameter-row">
                        <span className="parameter-label">Humidity</span>
                        <span className="parameter-value">{data.main.humidity}%</span>
                    </div>
                    <div className="weather-parameter-row">
                        <span className="parameter-label">Pressure</span>
                        <span className="parameter-value">{data.main.pressure} hPa</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
