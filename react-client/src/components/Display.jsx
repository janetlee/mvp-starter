import React from 'react';

class Display extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      zipcode: props.zipcode,
      timeStart: props.timeStart,
      tempMax: props.tempMax,
      tempMin: props.tempMin
    };
  }

  render(zipcode) {
    return (
      <div>
        <h1>The Temperature at {this.props.timeStart} in {this.props.zipcode}</h1>
        <h3>High Temperature: {this.props.tempMax}</h3>
        <h3>Low Temperature: {this.props.tempMin}</h3>
      </div>
    )
  }
}

export default Display;