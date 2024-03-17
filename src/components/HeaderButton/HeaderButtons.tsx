import React from "react";
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
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ setSearchData }) => {
    return (
        <div className="Headercontainer">
            {preDefinedCities.map((item) => (
                // Using 'id' as the key for better performance and stability
                <div key={item.id} onClick={() => setSearchData(item.name)}>
                    {item.name}
                </div>
            ))}
        </div>
    );
};

export default HeaderButton;
