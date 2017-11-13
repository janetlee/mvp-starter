import React from 'react';

class Display extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      zipcode: props.zipcode,
      forecastDate: props.forecastDate,
      timeStart: props.timeStart,
      timeEnd: props.timeEnd,
      tempMax: props.tempMax,
      tempMin: props.tempMin,
      forecastURL: props.forecastURL
    };
  }

  render(zipcode) {
    return (
      <div>
        <h1>The Temperature Forecast on {this.props.forecastDate} at {this.props.timeStart} for {this.props.zipcode}</h1>
        <h3>High Temperature: {this.props.tempMax}</h3>
        <h3>Low Temperature: {this.props.tempMin}</h3>
        <h4>This forecast is valid until: {this.props.timeEnd}</h4>
        <h3><a href={this.props.forecastURL}>Full Forecast</a></h3>
        <iframe src={this.props.forecastURL} title="iframe example 1" width="800" height="800">
          <p>View the full forecast here</p>
        </iframe>

      </div>
    )
  }
}

export default Display;