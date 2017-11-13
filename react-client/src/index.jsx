import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
// import '../styles/styles.css';
import Search from './components/Search.jsx';
import Display from './components/Display.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: '',
      forecastDate: '',
      timeStart: '',
      timeEnd: '',
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
            zipcode: data.zipcode || '',
            forecastDate: data.timeStart.slice(0, 10) || '',
            timeStart: data.timeStart.slice(11, 19) || '',
            timeEnd: data.timeEnd.slice(11, 19) || '',
            tempMax: data.tempMax || '',
            tempMin: data.tempMin || '',
            forecastURL: data.forecastURL || ''
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
        console.log('DATE STAMP: ', data.timeStart.slice(0, 10));

        if (data) {
          this.setState({
            zipcode: data.zipcode,
            forecastDate: data.timeStart.slice(0, 10),
            timeStart: data.timeStart.slice(11, 19),
            timeEnd: data.timeEnd.slice(11, 19),
            tempMax: data.tempMax,
            tempMin: data.tempMin,
            forecastURL: data.forecastURL
          });
        }
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1 className='header'>Weather by Zip Code</h1>
      <Search className='Search' handleSubmit={this.handleSubmit.bind(this)}
        zipcode={this.state.zipcode}
        />
      <Display className='Display' zipcode={this.state.zipcode}
        forecastDate={this.state.forecastDate}
        timeStart={this.state.timeStart}
        timeEnd={this.state.timeEnd}
        tempMax={this.state.tempMax}
        tempMin={this.state.tempMin}
        forecastURL={this.state.forecastURL}
        />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));