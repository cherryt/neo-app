import React, {Component} from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import NearEarthObject from './nearEarthObject.component';
import NearEarthObjects from './nearEarthObjects.component';
import axios from 'axios';

class Nav extends Component {
    state = {
        date: "2020-01-07",
        details :{
            name: "asteroid 123",
            time: "sometime",
            velocity: 123,
            distance: 1234,
            size: 4
        }
    }  

handleObjectDetails=(neos)=>{
    var newObjectModels = [];
    neos.map(n => newObjectModels.push(
        {name: n["name"],
        lunar_distance: n["close_approach_data"][0]["miss_distance"]["lunar"],
        velocity: n["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"],
        time: n["close_approach_data"][0]["close_approach_date_full"],
        size: n["estimated_diameter"]["kilometers"]["estimated_diameter_max"],
        pha: n["is_potentially_hazardous_asteroid"]
    }));
    return newObjectModels;
}

handleClosestObject=(neos)=>{
    const reducer = (minItem, currentItem) => {
        if(!!minItem || currentItem["lunar_distance"] < minItem["lunar_distance"]) {
            minItem = currentItem
        }
        return minItem;
    }
    return neos.reduce(reducer);
}

handlePHA=(neos)=>{
    return neos.filter(n => n.pha === true);
}

componentDidMount(){
    //api call
    axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${this.state.date}&end_date=${this.state.date}&api_key=${process.env.REACT_APP_NEO_API_KEY}`)
    .then((res) => {
        var neos = res["data"]["near_earth_objects"][this.state.date];
        this.setState({neos: this.handleObjectDetails(neos)});

        //closest
        var closestObject = this.handleClosestObject(this.state.neos);
       this.setState({closestObject: closestObject});
    }).catch((err) => {
        console.log(err);
    });
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
                    <Card.Body>
                        <NearEarthObject details={this.state.closestObject}></NearEarthObject>
                    </Card.Body>
                </Accordion.Collapse>   
            </Card>
            <Card>
                <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Potentially Hazardous Asteroids
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        <NearEarthObjects details={() => this.handlePHA(this.state.neos)}></NearEarthObjects>
                    </Card.Body>
                </Accordion.Collapse>   
            </Card>
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                        All of Today's NEO
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                    <Card.Body>
                        <NearEarthObjects neos={this.state.neos}></NearEarthObjects>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}
}

export default Nav;