import React from 'react';
import ListItem from './ListItem.jsx';
import App from '../index.jsx'

class List extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      zipEntry: ''
    };

    this.handleZipcodeEntry = this.handleZipcodeEntry.bind(this);
    this.handleSubmit = props.handleSubmit.bind(this);
  }

  handleZipcodeEntry(event) {
    this.setState({
      zipEntry: event.target.value
    });
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.zipEntry} onChange={this.handleZipcodeEntry.bind(this)}></input>
        <button onClick={this.handleSubmit.bind(this, this.state.zipEntry)} >Submit!</button>
      </div>
    );
  }

}


export default List;