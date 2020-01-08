import React, {Component} from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import NearEarthObject from './nearEarthObject.component';
import NearEarthObjects from './nearEarthObjects.component';

class Nav extends Component {
    state = {
        details :{
        name: "asteroid 123",
        time: "sometime",
        velocity: 123,
        distance: 1234,
        size: 4
        }
    }   

componentDidUpdate(){
    //api call
    
}

render(){
    return (
<Accordion defaultActiveKey="0">
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="0">
        Closest Object
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="0">
      <Card.Body><NearEarthObject details={this.state.details}></NearEarthObject></Card.Body>
    </Accordion.Collapse>
  </Card>
  {/* <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="1">
        All of Today's NEO
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="1">
      <Card.Body><NearEarthObjects neos={neos}></NearEarthObjects></Card.Body>
    </Accordion.Collapse>
  </Card> */}
</Accordion>
    )
}
}

export default Nav;