import React, { Component } from 'react';
import 'react-tabs/style/react-tabs.css';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Relation from './component/relation/relation';
import Compatibility from './component/compatibility/compatibility';

class App extends Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="content">
            <Route path="/Relation" component={Relation} />
            <Route path="/Compatibility" component={Compatibility} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
