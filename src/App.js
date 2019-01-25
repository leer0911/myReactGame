import React, { Component } from 'react';
import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div>
        <header className={styles.Header}>
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
        </header>
      </div>
    );
  }
}

export default App;
