import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: ''
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/items',
      success: (data) => {
        this.setState({
          zipcode: data
        })
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  handleSubmit(data) {
    console.log(this);
    console.log('Zip Code was submitted: ' + data);

    // user clicks the Submit button and it forms the HTML request and makes the call to the server
    $.ajax({
      url: '/items',
      method: 'POST',
      data: {zipcode: data},
      success: (data) => {
        console.log('Submitted POST call');
        // TODO: build out something here to keep track of submitted zip codes?
        // TODO: make call out to NWS
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1>Weatber by Zip Code</h1>
      <List handleSubmit={this.handleSubmit.bind(this)} zipcode={this.state.zipcode}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));