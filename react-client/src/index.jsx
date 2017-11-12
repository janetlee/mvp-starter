import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import Display from './components/Display.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: '',
      timeStart: '',
      tempMax: '',
      tempMin: '',
      forecastURL: ''
    }
  }

  componentDidMount() {
    console.log('COMPONENT DID MOUNT IS RUNNING');
    $.ajax({
      url: '/items',
      success: (data) => {
        console.log('CHANGING STATES');
        if (data) {
          this.setState({
            zipcode: this.state.zipcode,
            timeStart: data[0].timeStart.slice(11, 19) || '',
            tempMax: data[0].tempMax || '',
            tempMin: data[0].tempMin || '',
            forecastURL: data[0].forecastURL || ''
          })
        }
        console.log(data);
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  handleSubmit(data) {
    console.log('Zip Code was submitted: ' + data);

    var context = this.state;
    $.ajax({
      url: '/items',
      method: 'POST',
      data: {zipcode: data},
      success: (data) => {
        console.log('Submitted POST call');
        console.log('CHANGING STATES');
        console.log(data);

        this.setState({
          zipcode: data[0].zipcode,
          timeStart: data[0].timeStart.slice(11, 19),
          tempMax: data[0].tempMax,
          tempMin: data[0].tempMin,
          forecastURL: data[0].forecastURL
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1>Weather by Zip Code</h1>
      <Search handleSubmit={this.handleSubmit.bind(this)}
        zipcode={this.state.zipcode}
        />
      <Display zipcode={this.state.zipcode}
        timeStart={this.state.timeStart}
        tempMax={this.state.tempMax}
        tempMin={this.state.tempMin}
        forecastURL={this.state.forecastURL}
        />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));