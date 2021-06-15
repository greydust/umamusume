import React from 'react';
import {
  Redirect, HashRouter as Router, Route, Link, Switch,
} from 'react-router-dom';

import 'react-tabs/style/react-tabs.css';
import './App.css';

import Relation from './component/relation/relation';
import Compatibility from './component/compatibility/compatibility';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="links">
          <Link to="/relation" className="link">Relation</Link>
          <Link to="/compatibility" className="link">Compatibility</Link>
        </div>
        <div className="tabs">
          <Switch>
            <Route exact path="/">
              <Redirect to="/relation" />
            </Route>
            <Route path="/relation" component={Relation} />
            <Route path="/compatibility" component={Compatibility} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
