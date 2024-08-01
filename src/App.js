import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [showRoom, setShowRoom] = useState({});
  const [showData, setShowData] = useState(false);
  const [time, setTime] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    getData();
    //nastavení intervalu aktualizace dat na co 2 minuty
    const interval = setInterval(() => {
      getData();
    }, 120000); // 120000 ms = 2 minut
    //čištění intervalu po odstranění komponenty
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Aktualizace showRoom při změně weatherData nebo selectedCity
    if (selectedCity !== "" && weatherData.length > 0) {
      const cityData = weatherData.find(
        (item) => item.location === selectedCity
      );
      if (cityData) {
        setShowRoom(cityData);
        setShowData(true);
      }
    }
  }, [weatherData, selectedCity]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };

  const getData = () => {
    axios
      .get("https://jirkucweatherspringapi.azurewebsites.net/weather")
      .then(function (response) {
        //console.log(response.data);
        setWeatherData(response.data);
        setTime(getCurrentTime);
      })
      .catch(function (error) {
        const alertMessage = `API nedostupné: ${error}`;
        alert(alertMessage);
        console.error("There was an error!", error);
      });
  };

  const handleChange = (e) => {
    let city = e.target.value;
    if (city !== "label") {
      setShowRoom(weatherData.find((item) => item.location === city));
      setShowData(true);
      setSelectedCity(city);
    } else {
      setShowData(false);
      setSelectedCity("");
    }
  };

  return (
    <div className="container">
      <div className="row my-5 text-center">
        <h1 className="display-3">
          Počasí 
          <span className={showData ? "d-none" : "d-inline" }>
             &nbsp;<img src="/projects/spring_weatherapi_frontend/weather-svgrepo-com.svg" alt="Weather icon" width="64" height="64" />&nbsp;
          </span>
          <span className={showData ? "d-inline" : "d-none" }>
             &nbsp;<img src={'https:' + showRoom.icon} alt="Weather icon" />&nbsp;
             {showRoom.location}
          </span>
        </h1>
      </div>

      <div className="row my-3">
        <div
          className={showData ? "col-md-6 mx-auto" : "col-md-6 mx-auto d-none"}
        >
          <p>Čas: {showRoom.timestamp}</p>
          <p>Počasí: {showRoom.weather_description}</p>
          <p>Teplota: {showRoom.temp_celsius}°C</p>
          <p>Rel. vlhkost: {showRoom.rel_humidity} %</p>
          <p>Rychlost větru: {Math.round((showRoom.wind_speed_m_per_s + Number.EPSILON) * 10) / 10} m/s </p>
          <p>Směr větru: {showRoom.wind_direction}</p>
        </div>
      </div>

      <div className="row my-3">
        <div className="col-md-6 mx-auto">
          <select className="form-select" onChange={handleChange} name="city">
            <option value="label">Vyberte lokalitu</option>
            {weatherData.map((item, index) => (
              <option key={index} value={item.location}>
                {item.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row my-2">
        <p className="col-md-6 mx-auto">Aktualizováno: {time}</p>
      </div>
      <div className="row my-2">
        <p className="col-md-6 mx-auto text-lighter">Lehce přepracováno podle původního <a href="https://veetektest.g6.cz/projects/weather-app/index.html" target="_blank" rel="noreferrer" class="text-reset">Vítkova projektu</a></p>
      </div>
    </div>
  );
}

export default App;
