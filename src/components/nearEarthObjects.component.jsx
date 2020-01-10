import React, { Component } from "react";
import NearEarthObject from "./nearEarthObject.component";

class NearEarthObjects extends Component {
  render() {
    const neos = this.props.neos;
    if (!neos || neos.length === 0) return "No data";
    return neos.map(n => {
      return (
        <NearEarthObject details={n} key={n.lunar_distance}></NearEarthObject>
      );
    });
  }
}

export default NearEarthObjects;
