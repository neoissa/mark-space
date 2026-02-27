import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, MapPin, Plus } from 'lucide-react';
import './WeatherWidget.css';

const WeatherWidget = () => {
    const [cities, setCities] = useState([
        { id: 1, name: 'London', temp: 18, condition: 'Cloudy', icon: 'Cloud' },
        { id: 2, name: 'Najaf', temp: 32, condition: 'Sunny', icon: 'Sun' },
    ]);

    const renderIcon = (type) => {
        if (type === 'Cloud') return <Cloud size={24} />;
        if (type === 'Sun') return <Sun size={24} />;
        return <CloudRain size={24} />;
    };

    return (
        <div className="weather-widget">
            <div className="weather-list">
                {cities.map(city => (
                    <div key={city.id} className="weather-card-mini">
                        <div className="city-info">
                            <MapPin size={14} />
                            <span>{city.name}</span>
                        </div>
                        <div className="weather-main">
                            <div className="weather-icon">{renderIcon(city.icon)}</div>
                            <div className="temp">{city.temp}°C</div>
                        </div>
                        <div className="condition">{city.condition}</div>
                    </div>
                ))}
            </div>
            <button className="add-city-btn">
                <Plus size={16} /> Add City
            </button>
        </div>
    );
};

export default WeatherWidget;
