import React, { Component, createRef } from 'react';
import styles from './App.module.css';
import Decoration from '../Decoration/Decoration';
import Tree from '../Tree/Tree';

class App extends Component {
  containerRef;
  constructor(props) {
    super(props);
    this.containerRef = createRef();
  }
  componentDidMount() {
    this.containerResize();
    window.addEventListener('resize', this.containerResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.containerResize);
  }
  render() {
    return (
      <section className={styles.container} ref={this.containerRef}>
        <Decoration />
        <Tree />
      </section>
    );
  }
  containerResize = () => {
    const container = this.containerRef.current;
    if (!container) {
      return;
    }
    let w = window.innerWidth;
    let h = window.innerHeight - (w * 667) / 375;
    h = ((h * 1) / 750) * 100;
    container.style.margin = `${h.toFixed(3)}vw 0`;
  };
}

export default App;
