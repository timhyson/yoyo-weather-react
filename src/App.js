import React, { Component } from 'react';
import './App.css';
import 'bootswatch/superhero/bootstrap.css';
import { Navbar, NavItem, Nav, Grid, Row, Col } from 'react-bootstrap';

const PLACES = [
  { name: 'London', country: 'UK' },
  { name: 'Denpasar', country: 'ID' },
  { name: 'Paris', country: 'FR' },
  { name: 'Chicago', country: 'US' }
];
const APIKEY = '917edcacb90140b8f8784062e849f1ed';

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
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>yoyo weather dashboard</Navbar.Brand>
          </Navbar.Header>
        </Navbar>

        <Grid>
          <Row>
            <Col md={4} sm={4}>
              <h3>Select a city</h3>
              <Nav
                bsStyle="pills"
                stacked
                activeKey={activePlace}
                onSelect={index => {
                  this.setState({ activePlace: index });
                }}
              >
                {PLACES.map((place, index) => (
                  <NavItem key={index} eventKey={index}>
                    {place.name}
                  </NavItem>
                ))}
              </Nav>
            </Col>
            <Col md={8} sm={8}>
              <WeatherDashboard
                key={activePlace}
                name={PLACES[activePlace].name}
              />
            </Col>
            <Col md={8} sm={8}>
              <FiveDayForecast
                key={activePlace}
                name={PLACES[activePlace].name}
              />
            </Col>
          </Row>
        </Grid>
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
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      name +
      '&appid=' +
      APIKEY +
      '&units=metric';
    fetch(URL)
      .then(res => res.json())
      .then(json => {
        this.setState({ weatherData: json });
      });
  }
  render() {
    const weatherData = this.state.weatherData;
    if (!weatherData) return <div>Loading...</div>;

    const weather = weatherData.weather[0];
    const iconUrl = 'https://openweathermap.org/img/w/' + weather.icon + '.png';
    const windSpeed = weatherData.wind.speed * 3.6; // API returns metres/sec
    return (
      <div>
        <h1>
          {weather.main} in {weatherData.name}
          <img src={iconUrl} alt={weatherData.description} />
        </h1>
        <p>
          Current: {weatherData.main.temp}
          &deg;C
        </p>
        <p>
          High: {weatherData.main.temp_max}
          &deg;C
        </p>
        <p>
          Low: {weatherData.main.temp_min}
          &deg;C
        </p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Wind speed: {windSpeed} km/h</p>
      </div>
    );
  }
}
class FiveDayForecast extends Component {
  constructor() {
    super();
    this.state = {
      weatherData: null
    };
  }
  componentDidMount() {
    const name = this.props.name;
    const URL =
      'https://api.openweathermap.org/data/2.5/forecast?q=' +
      name +
      '&appid=' +
      APIKEY +
      '&units=metric';
    fetch(URL)
      .then(res => res.json())
      .then(json => {
        this.setState({ weatherData: json });
      });
  }
  render() {
    const weatherData = this.state.weatherData;
    if (!weatherData) return <div>Loading...</div>;

    // API returns weather forecast for 5 days with data every 3 hours, so we
    // create a new array with the midday predictions
    const middayPredictions = weatherData.list.filter(prediction => {
      return prediction.dt_txt.includes('12:00:00');
    });

    return (
      <div>
        <h3>Five day forecast</h3>

        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3 col-md-3">
              <p />
            </div>
            <div className="col-xs-3 col-md-3">
              <p>Date</p>
            </div>
            <div className="col-xs-3 col-md-3">
              <p>Temp</p>
            </div>
            <div className="col-xs-3 col-md-3">
              <p>Humidity</p>
            </div>
          </div>

          {middayPredictions.map((day, index) => {
            const iconUrl =
              'https://openweathermap.org/img/w/' + day.weather[0].icon + '.png';
            const date = day.dt_txt.split(' ')[0];
            const temp = day.main.temp;

            return (
              <div key={index} className="row">
                <div className="col-xs-3 col-md-3">
                  <img src={iconUrl} alt={weatherData.description} />
                </div>
                <div className="col-xs-3 col-md-3">
                  <p>{date}</p>
                </div>
                <div className="col-xs-3 col-md-3">
                  <p>
                    {temp}
                    &deg;C
                  </p>
                </div>
                <div className="col-xs-3 col-md-3">
                  <p>{day.main.humidity}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
