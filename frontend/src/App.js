import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './screens/general/main.sass';

function App() {
  return (
      <BrowserRouter>
        Blood Block
        <Route exact path="/"/>
      </BrowserRouter>
  );
}

export default App;
