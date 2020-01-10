import React, { Component } from "react";
import Table from "react-bootstrap/Table";

class NearEarthObject extends Component {
  render() {
    const { details } = this.props;
    if (!details) return "No Closest Object data";
    return (
      <Table size="sm">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{details.name}</td>
          </tr>
          <tr>
            <td>Miss Distance</td>
            <td>{details.lunarDistance}</td>
          </tr>
          <tr>
            <td>Time</td>
            <td>{details.time}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{details.size}</td>
          </tr>
          <tr>
            <td>Velocity</td>
            <td>{details.velocity}</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default NearEarthObject;
