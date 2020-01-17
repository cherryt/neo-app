import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import NearEarthObjects from "./nearEarthObjects.component";

class AllNeos extends Component {
  render() {
    const { neos } = this.props;
    return (
      <Accordion>
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
              <NearEarthObjects neos={neos}></NearEarthObjects>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default AllNeos;
