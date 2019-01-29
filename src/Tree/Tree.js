import React, { Component } from 'react';
import styles from './Tree.module.css';

class Tree extends Component {
  render() {
    return (
      <section className={styles.container}>
        <section className={styles.treeLv6} />
      </section>
    );
  }
}

export default Tree;
