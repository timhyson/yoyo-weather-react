import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const PLACES = [
  { name: 'London' },
  { name: 'Bali' }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      activePlace: 0
    };
  }

  render() {
    const activePlace = this.state.activePlace;
    return (
      <div className="App">
        {PLACES.map((place, index) => (
          <button
            key={index}
            onClick={() => {
              this.setState({ activePlace: index });
            }}
          >
            {place.name}
          </button>
        ))}
        <WeatherDashboard key={activePlace} name={PLACES[activePlace].name} />
      </div>
    );
  }
}

class WeatherDashboard extends Component {
  constructor() {
    super();
    this.state = {
      weatherData: null
    };
  }
  componentDidMount() {
    const name = this.props.name;
    const URL =
      'http://api.openweathermap.org/data/2.5/weather?q=' +
      name +
      '&appid=917edcacb90140b8f8784062e849f1ed&units=metric';
    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: json });
    })
  }
  render() {
    const weatherData = this.state.weatherData;
    if(!weatherData) return <div>Loading...</div>;

    const weather = weatherData.weather[0];
    const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
    return (
      <div>
        <h1>
          {weather.main} in {weatherData.name}
          <img src={iconUrl} alt={weatherData.description} />
        </h1>
        <p>Current: {weatherData.main.temp}&deg;</p>
        <p>High: {weatherData.main.temp_max}&deg;</p>
        <p>Low: {weatherData.main.temp_min}&deg;</p>
        <p>Wind speed: {weatherData.wind.speed}&deg;</p>
      </div>
    )
  }
}

export default App;
