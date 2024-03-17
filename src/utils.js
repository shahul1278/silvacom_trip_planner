import moment from "moment";
import { DateTime } from "luxon";

export function formatTimestampToLocalTime(timestamp, timezoneOffsetInSeconds) {
    // Convert timestamp to UTC moment object
    let localTime = moment.unix(timestamp).utc();

    // Manually apply the timezone offset
    localTime = localTime.add(timezoneOffsetInSeconds, 'seconds');

    // Format the date and time separately
    const formattedDate = localTime.format('dddd, DD MMM YYYY');
    const formattedTime = localTime.format('hh:mm A');

    // Combine the formatted date and time with additional text
    const combinedString = `${formattedDate} | Local time: ${formattedTime}`;

    return combinedString;

}

export const formatForecastWeather = (data) => {
    let { timezone, daily, hourly } = data;
    hourly = hourly.slice(1, 7).map((d) => {
        return {
            title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
            temp: d.temp,
            icon: d.weather[0].icon,
        };
    });
    daily = daily.map((d) => ({
        title: formatToLocalTime(d.dt, timezone, " dd LLL yyyy"),
        temp: d.temp.day,
        icon: d.weather[0].icon,
        date: new Date(d.dt * 1000).toISOString().split('T')[0] // Include date for filtering
    }));

    return { timezone, daily, hourly };
};


export const formatToLocalTime = (
    secs,
    zone,
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

export const iconUrlFromCode = (code) =>
    `http://openweathermap.org/img/wn/${code}@2x.png`;

