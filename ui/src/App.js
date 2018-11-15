import React, { Component } from 'react';
import { Grommet } from 'grommet';
import MessagesData from './components/MessagesData';

class App extends Component {
  render() {
    return (
      <Grommet plain>
        <MessagesData />
      </Grommet>
    );
  }
}

export default App;
