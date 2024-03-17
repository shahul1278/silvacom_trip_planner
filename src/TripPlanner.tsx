import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CurrentWeather from "./components/currentweather/CurrentWeather";
import ForecastWeather from "./components/forecastweather/ForeCastWeather";
import {
    RAPIDAPI_URL,
    WEATHER_API_URL_v3,
    RAPIDAPI_Options,
    WEATHER_API_URL,
    WEATHER_API_KEY,
} from "./config";
import "./TripPlanner.css";
import CitySummary from "./components/citysummary/CitySummary";
import HeaderButton from "./components/HeaderButton/HeaderButtons";
import TimeAndLocation from "./components/LocalTime/TimeAndLocation";
import { formatForecastWeather } from "./utils";
import { FaLocationDot } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Interfaces
interface City {
    value: string;
    name: string;
}

interface ForecastResponseData {
    timezone: string;
    daily: DailyForecast[];
    hourly: HourlyForecast[];
}

interface DailyForecast {
    title: string;
    temp: number;
    icon: string;
    date: string;
}

interface HourlyForecast {
    title: string;
    temp: number;
    icon: string;
}

interface Weather {
    city: string;
    weather: [
        {
            description: string;
            icon: string;
        }
    ];
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    wind: {
        speed: number;
    };
    dt: number;
    timezone: number;
}

const TripPlanner = () => {
    const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
    const [forecast, setForecast] = useState<ForecastResponseData | null>(null);
    const [searchData, setSearchData] = useState<string>("");
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>("");
    const [cityDescription, setCityDescription] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedCityImage, setSelectedCityImage] = useState<string>("");
    const [displayForecast, setDisplayForecast] =
        useState<ForecastResponseData | null>(null);

    //Fetch's list of cities i.e, AutoType
    const fetchCities = async (param: string) => {
        try {
            const response = await axios.get(
                `${RAPIDAPI_URL}/cities?minPopulation=1000000&namePrefix=${param}`,
                RAPIDAPI_Options
            );
            const cities = response.data.data.map((city: any) => ({
                value: `${city.latitude} ${city.longitude}`,
                name: `${city.name}, ${city.countryCode}`,
            }));
            setCities(cities);
        } catch (error) {
            console.error(error);
        }
    };

    //Fetch's City Summary
    const fetchCityDescription = async (cityName: string) => {
        toast.info(`${cityName} Summary fetching .....`);
        try {
            const response = await axios.get(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                    cityName
                )}`
            );
            setCityDescription(response.data.extract);
            setSelectedCityImage(response.data.originalimage.source);
            toast.success(`${cityName} Summary loaded successfully!`);
        } catch (error) {
            console.error("Error fetching city description:", error);
            toast.error("Failed to load City Summary");
        }
    };

    //Fetch's current location weather info
    const fetchWeatherForCurrentLocation = () => {
        toast.info("Fetching Your Weather Data...........");
        if (navigator?.geolocation) {
            navigator?.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const weatherResponse = await axios.get(
                            `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
                        );
                        const forecastResponse = await axios.get(
                            `${WEATHER_API_URL_v3}/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${WEATHER_API_KEY}&units=metric`
                        );
                        const cityName = weatherResponse.data?.name;
                        setCurrentWeather({ city: cityName, ...weatherResponse.data });
                        const formatedData = formatForecastWeather(forecastResponse.data);
                        setForecast(formatedData);
                        setDisplayForecast(formatedData);
                        fetchCityDescription(cityName);
                        toast.success("Weather loaded successfully!");
                    } catch (error) {
                        console.error(error);
                        toast.error("Failed to load weather data.");
                    }
                },
                (error) => {
                    console.error(error);
                    toast.error("Geolocation is not supported by your browser.");
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const HandleOnSearchCity = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const changedValue = e.target.value;
        console.log(changedValue);
        setSearchData(changedValue);
        await fetchCities(changedValue);
    };

    const handleOnSearchChange = async (city: City) => {
        if (!city) return;
        setSelectedCity(city?.name);
        const [lat, lon] = city?.value.split(" ");
        toast.info(` Fetching ${city.name.split(", ")[0]} weather data...`);
        try {
            const weatherResponse = await axios.get(
                `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
            );
            const forecastResponse = await axios.get(
                `${WEATHER_API_URL_v3}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${WEATHER_API_KEY}&units=metric`
            );
            setCurrentWeather({ city: city?.name, ...weatherResponse.data });
            const formatedData = formatForecastWeather(forecastResponse.data);
            setForecast(formatedData);
            setDisplayForecast(formatedData);
            fetchCityDescription(city?.name.split(", ")[0]);
            setCities([]);
            toast.success("Weather loaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to load weather data.");
        }
    };

    const handleOnSearchChangeByName = useCallback(async (cityName: string) => {
        await fetchCities(cityName);
    }, []);

    // Handler for date change
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    useEffect(() => {
        if (selectedDate && forecast) {
            // Filter forecasts based on the selected date
            const daily = forecast.daily.filter((d) => d.date === selectedDate);

            setDisplayForecast({ ...forecast, daily });
        } else if (selectedDate === "") {
            // If the date is cleared, show the complete forecast data
            setDisplayForecast(forecast);
        }
    }, [selectedDate, forecast]);

    useEffect(() => {
        // Effect for reloading cities based on search data and selected city
        if (searchData) {
            fetchCities(searchData);
        }
        if (selectedCity) {
            handleOnSearchChangeByName(selectedCity);
        }
    }, [searchData, selectedCity, handleOnSearchChangeByName]);

    // Get today's date and the maximum date which is 5 days in the future
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    return (
        <div
            className="container"
            style={{
                backgroundImage: `url(${selectedCityImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <ToastContainer />
            <div className="container-box">
                <div className="head-cities">
                    <HeaderButton setSearchData={handleOnSearchChangeByName} />
                </div>
                <div className="search-container">
                    <div className="search-bar">
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Search Cities..."
                            onChange={HandleOnSearchCity}
                        />
                        <FaLocationDot
                            className="iconCurrentLocation"
                            onClick={() => fetchWeatherForCurrentLocation()}
                        />
                    </div>
                    {cities && cities?.length > 0 && (
                        <ul className="cities-list">
                            {cities?.map((city, index) => (
                                <li key={index} onClick={() => handleOnSearchChange(city)}>
                                    {city?.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {currentWeather && (
                    <TimeAndLocation
                        weather={{
                            dt: currentWeather.dt,
                            timezone: currentWeather.timezone,
                        }}
                    />
                )}
                {currentWeather && <CurrentWeather data={currentWeather} />}

                {forecast && (
                    <ForecastWeather data={forecast?.hourly || []} type="hourly" />
                )}
                <div>
                    {forecast && (
                        <input
                            className="styled-date-input"
                            type="date"
                            value={selectedDate}
                            min={today}
                            max={maxDateStr}
                            onChange={handleDateChange}
                        />
                    )}
                    {forecast && (
                        <ForecastWeather data={displayForecast?.daily || []} type="daily" />
                    )}
                </div>
                {cityDescription && <CitySummary data={cityDescription} />}
            </div>
        </div>
    );
};

export default TripPlanner;
