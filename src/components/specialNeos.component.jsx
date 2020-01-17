import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import NearEarthObject from "./nearEarthObject.component";
import NearEarthObjects from "./nearEarthObjects.component";
import "../App.css";

class SpecialNeos extends Component {
  handleClosestObject = neos => {
    if (!neos) return;
    const reducer = (minItem, currentItem) => {
      if (!minItem || currentItem["lunarDistance"] < minItem["lunarDistance"]) {
        minItem = currentItem;
      }
      return minItem;
    };
    return neos.reduce(reducer, null);
  };

  handlePHA = neos => {
    if (!neos) return;
    return neos.filter(n => n.pha === true);
  };

  handleNextNeo = neos => {
    if (!neos) return;
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

  render() {
    let closestObject = this.handleClosestObject(this.props.neos);
    let todaysPHA = this.handlePHA(this.props.neos);
    let nextNeo = this.handleNextNeo(this.props.neos)?.nextNeo;
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
              <NearEarthObject details={closestObject}></NearEarthObject>
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
              <NearEarthObjects details={todaysPHA}></NearEarthObjects>
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
              <NearEarthObject details={nextNeo}></NearEarthObject>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default SpecialNeos;
