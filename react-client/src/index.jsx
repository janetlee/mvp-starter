import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
// import Display from './components/Display.jsx';

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

    $.ajax({
      url: '/items',
      method: 'POST',
      data: {zipcode: data},
      success: (data) => {
        console.log('Submitted POST call');
        // TODO: build out something here to keep track of submitted zip codes?
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1>Weather by Zip Code</h1>
      <Search handleSubmit={this.handleSubmit.bind(this)} zipcode={this.state.zipcode}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));