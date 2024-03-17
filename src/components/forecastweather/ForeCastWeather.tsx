import React from 'react';
import { iconUrlFromCode } from "../../utils";
import './ForecastWeather.css';

interface ForecastItem {
    title: string;
    icon: string;
    temp: number;
}

interface ForecastWeatherProps {
    data: ForecastItem[] | undefined;
    type: 'hourly' | 'daily';
}

const ForecastWeather: React.FC<ForecastWeatherProps> = ({ data, type }) => {
    // Display a message if there's no data
    if (!data || data.length === 0) {
        return <p>No forecast data available.</p>;
    }

    return (
        <div className="forecast-container">
            <h2 className="forecast-title">{type === 'hourly' ? 'Hourly Forecast' : 'Daily Forecast'}:</h2>
            <div className="forecast">
                {data.map((forecast, index) => (
                    <div key={index} className="forecast-item">
                        <p className="forecast-item-title">{forecast.title}</p>
                        <img src={iconUrlFromCode(forecast.icon)} className="forecast-icon" alt={`${forecast.title} icon`} />
                        <p className="forecast-temp">Temp: {forecast.temp}°C</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForecastWeather;
