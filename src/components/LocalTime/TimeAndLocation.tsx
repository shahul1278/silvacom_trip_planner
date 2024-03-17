import React from "react";
import { formatTimestampToLocalTime } from "../../utils";
import "./TimeAndLocation.css";

interface TimeAndLocationProps {
  weather: {
    dt: number,
    timezone: number,
  };
}

const TimeAndLocation: React.FC<TimeAndLocationProps> = ({
  weather: { dt, timezone },
}) => {
  return (
    <div className="time-and-location">
      <div className="time-display">
        <span className="time-label">Current Time:</span>
        {formatTimestampToLocalTime(dt, timezone)}
      </div>
    </div>
  );
};

export default TimeAndLocation;
