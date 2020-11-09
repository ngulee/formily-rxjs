import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './container/Home';
import QuickStart from './container/QuickStart';
import Linkage from './container/Linkage';


function App() {
  return (
    <div className='app'>
      <Switch>
        <Route exact path='/start' component={QuickStart} />
        <Route exact path='/linkage' component={Linkage} />
        <Route exact path='/' component={Home} />
      </Switch>
    </div>
  );
}

export default App;
