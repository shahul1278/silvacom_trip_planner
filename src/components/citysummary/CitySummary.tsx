import React from "react";
import "./CitySummary.css";

interface CitySummaryProps {
    data: string;
}

const CitySummary: React.FC<CitySummaryProps> = ({ data }) => {
    // Only render if 'data' is not empty
    if (!data) return null;

    return (
        <div>
            <h3 className="city-summary-header">Summary:</h3>
            <p className="citysummary">{data}</p>
        </div>
    );
}

export default CitySummary;
