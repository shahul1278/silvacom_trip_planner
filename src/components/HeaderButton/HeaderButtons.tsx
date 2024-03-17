import React, { useState } from "react";
import "./HeaderButton.css";

//Interfaces
interface CityInfo {
    id: number;
    name: string;
}

type DefinedCityTypes = CityInfo[];

const preDefinedCities: DefinedCityTypes = [
    { id: 1, name: "Tokyo" },
    { id: 2, name: "Toronto" },
    { id: 3, name: "Dubai" },
    { id: 4, name: "Vancouver" },
    { id: 5, name: "Chicago" },
];

interface HeaderButtonProps {
    setSearchData: (cityName: string) => void; // Function to update search data based on selected city
    setActiveCity: (city: number) => void
    activeCity: number | null;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ setSearchData, setActiveCity, activeCity }) => {


    const handleCityClick = (city: CityInfo) => {
        setSearchData(city.name);
        setActiveCity(city.id); // Update the active city state
    };
    return (
        <div className="Headercontainer">
            {preDefinedCities.map((item) => (
                // Using 'id' as the key for better performance and stability
                <div key={item.id} className={activeCity === item.id ? "activeCity" : ""} onClick={() => handleCityClick(item)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
};

export default HeaderButton;
