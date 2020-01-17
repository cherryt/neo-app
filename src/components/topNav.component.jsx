import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SpecialNeos from "./specialNeos.component";
import AllNeos from "./allNeos.component";
import axios from "axios";

class TopNav extends Component {
  getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const doubleDigitMonth = month < 10 ? `0${month}` : month;
    return `${today.getFullYear()}-${doubleDigitMonth}-${today.getDate()}`;
  };

  state = {
    date: this.getDate(),
    neos: null
  };

  extractTimeFromDateTime = dateTime => {
    var timeNotAvailableMessage = "Time is not available";
    if (!dateTime) return timeNotAvailableMessage;
    var time = dateTime.split(" ")[1];
    return (
      (!!time && time.match(/^\d{2,}:(?:[0-5]\d)$/))[0] ||
      timeNotAvailableMessage
    );
  };

  handleObjectDetails = neos => {
    var newObjectModels = [];
    neos.map(n =>
      newObjectModels.push({
        name: n["name"],
        lunarDistance: n["close_approach_data"][0]["miss_distance"]["lunar"],
        velocity:
          n["close_approach_data"][0]["relative_velocity"][
            "kilometers_per_second"
          ],
        time: this.extractTimeFromDateTime(
          n["close_approach_data"][0]["close_approach_date_full"]
        ),
        dateTime: n["close_approach_data"][0]["close_approach_date_full"],
        size: n["estimated_diameter"]["kilometers"]["estimated_diameter_max"],
        pha: n["is_potentially_hazardous_asteroid"]
      })
    );
    return newObjectModels;
  };

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_NEO_API_URL}?start_date=${this.state.date}&end_date=${this.state.date}
        &api_key=${process.env.REACT_APP_NEO_API_KEY}`
      )
      .then(res => {
        var neos = res["data"]["near_earth_objects"][this.state.date];
        this.setState({ neos: this.handleObjectDetails(neos) });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    console.log(this.state.neos);
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Near Earth Objects!</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="home">Home</Nav.Link>
            <Nav.Link href="special">Some of Today's Asteroids</Nav.Link>
            <Nav.Link href="all">All of Today's Asteroids</Nav.Link>
          </Nav>
        </Navbar>
        <Router>
          <Route>
            <Route
              path="/special"
              render={() => <SpecialNeos neos={this.state.neos} />}
            />
            <Route
              path="/all"
              render={() => <AllNeos neos={this.state.neos} />}
            />
          </Route>
        </Router>
      </React.Fragment>
    );
  }
}

export default TopNav;
