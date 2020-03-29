import React from 'react';
import './App.css';
import MainPage from "./components/mainpage/mainpage"
import VideoChat from "./components/videochat/videochat"
import { Grommet, Heading } from 'grommet';
import { BrowserRouter as Router, Route } from "react-router-dom"


function App() {
  return (
    <Grommet plain>
      <Router>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route path="/rooms/:id">
          <VideoChat />
        </Route>
      </Router>
    </Grommet>
  );
}

export default App;
