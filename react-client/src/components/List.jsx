import React from 'react';
import ListItem from './ListItem.jsx';
import App from '../index.jsx'

class List extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      zipcode: ''
    };

    this.handleZipcodeEntry = this.handleZipcodeEntry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleZipcodeEntry(event) {
    this.setState({
      zipcode: event.target.value
    });
    console.log('Stage changed');
  }

  handleSubmit(event) {
    console.log('Zip Code was submitted: ' + this.state.value);
    event.preventDefault();
  }


  render() {
    return (
      <div>
        <input type="text" name="zipcode" value={this.state.value} onChange={this.handleZipcodeEntry.bind(this)}></input>
        <button onSubmit={this.handleSubmit.bind(this)} >Submit!</button>
      </div>
    );
  }

}


export default List;