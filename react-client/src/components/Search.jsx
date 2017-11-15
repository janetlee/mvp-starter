import React from 'react';
import App from '../index.jsx'
import Display from './Display.jsx';

class Search extends React.Component {
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
      <div className='header'>
        <div>
        <input type="text" value={this.state.zipEntry} onChange={this.handleZipcodeEntry.bind(this)}></input>
        <button onClick={this.handleSubmit.bind(this, this.state.zipEntry)} >Submit!</button>
        </div>
      </div>

    );
  }
}


export default Search;