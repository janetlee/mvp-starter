import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/items',
      success: (data) => {
        this.setState({
          items: data
        })
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  handleSubmit() {
    // user clicks the Submit button and it forms the HTML request and makes the call to the server
    $.ajax({
      url: '/items',
      method: 'POST',
      success: (data) => {
        console.log('Submitted POST call');
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1>Weatber by Zip Code</h1>
      <List handleSubmit={this.handleSubmit.bind(this)} items={this.state.items}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));