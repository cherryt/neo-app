import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import NearEarthObject from "./nearEarthObject.component";
import NearEarthObjects from "./nearEarthObjects.component";
import axios from "axios";
import "../App.css";

class Nav extends Component {
  getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const doubleDigitMonth = month < 10 ? `0${month}` : month;
    return `${today.getFullYear()}-${doubleDigitMonth}-${today.getDate()}`;
  };

  state = {
    date: this.getDate(),
    details: {
      name: "asteroid 123",
      time: "sometime",
      velocity: 123,
      distance: 1234,
      size: 4
    }
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

  handleClosestObject = neos => {
    const reducer = (minItem, currentItem) => {
      if (!minItem || currentItem["lunarDistance"] < minItem["lunarDistance"]) {
        minItem = currentItem;
      }
      return minItem;
    };
    return neos.reduce(reducer, null);
  };

  handlePHA = neos => {
    return neos.filter(n => n.pha === true);
  };

  handleNextNeo = neos => {
    const reducer = (nextTimeAcc, currentItem) => {
      var today = new Date();
      if (!currentItem["dateTime"]) return nextTimeAcc;
      const timeDiff = Date.parse(currentItem["dateTime"]) - today.getTime();
      if (timeDiff < 0) return nextTimeAcc;
      if (!nextTimeAcc || timeDiff < nextTimeAcc.timeDiff) {
        return { nextNeo: currentItem, timeDiff: timeDiff };
      }
      return nextTimeAcc;
    };
    return neos.reduce(reducer, 0);
  };

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_NEO_API_URL}?start_date=${this.state.date}&end_date=${this.state.date}&api_key=${process.env.REACT_APP_NEO_API_KEY}`
      )
      .then(res => {
        console.log(res);
        var neos = res["data"]["near_earth_objects"][this.state.date];
        this.setState({ neos: this.handleObjectDetails(neos) });
        this.setState({
          closestObject: this.handleClosestObject(this.state.neos),
          todaysPHA: this.handlePHA(this.state.neos),
          nextNeo: this.handleNextNeo(this.state.neos).nextNeo
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              className="panel panel-title"
              as={Button}
              variant="info"
              eventKey="0"
            >
              Closest Object
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse className="panel panel-body" eventKey="0">
            <Card.Body>
              <NearEarthObject
                details={this.state.closestObject}
              ></NearEarthObject>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              className="panel panel-title"
              as={Button}
              variant="info"
              eventKey="1"
            >
              Potentially Hazardous Asteroids
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse className="panel panel-body" eventKey="1">
            <Card.Body>
              <NearEarthObjects
                details={this.state.todaysPHA}
              ></NearEarthObjects>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              className="panel panel-title"
              as={Button}
              variant="info"
              eventKey="2"
            >
              Next NEO
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse className="panel panel-body" eventKey="2">
            <Card.Body>
              <NearEarthObject details={this.state.nextNeo}></NearEarthObject>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              className="panel panel-title"
              as={Button}
              variant="info"
              eventKey="3"
            >
              All of Today's NEO
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse className="panel panel-body" eventKey="3">
            <Card.Body>
              <NearEarthObjects neos={this.state.neos}></NearEarthObjects>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default Nav;
