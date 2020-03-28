import React from 'react';
import './App.css';
import CreateChat from "./components/createchat/createchat"
import { Grommet } from 'grommet';

function App() {
  return (
    <Grommet plain>
      <div className="App">
        <CreateChat />
      </div>
    </Grommet>
  );
}

export default App;
