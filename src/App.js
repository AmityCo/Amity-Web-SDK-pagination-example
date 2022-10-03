import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import ASCClient, { ConnectionStatus } from "@amityco/js-sdk";
import GetPostsObject from "./getPostsObject";
import "./App.css";

const APIKEY = process.env.REACT_APP_APIKEY;
const USERID = process.env.REACT_APP_USERID;
const DISPLAYAME = process.env.REACT_APP_DISPLAYAME;

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const ascClient = new ASCClient({
      apiKey: APIKEY,
    });
    ascClient.registerSession({ userId: USERID, displayName: DISPLAYAME });
    ascClient.on("connectionStatusChanged", (data) => {
      if (data.newValue === ConnectionStatus.Connected) {
        setIsReady(true);
      } else if (data.newValue === ConnectionStatus.Disconnected) {
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isReady ? (
          <GetPostsObject />
        ) : (
          <div>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
