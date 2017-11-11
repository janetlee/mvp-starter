import React from 'react';

class Display extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      zipcode: props.zipcode
    };
  }

  render(zipcode) {
    return (
      <div>
        <h1>The Temperature in {this.state.zipcode}</h1>
      </div>
    )
  }
}

export default Display;