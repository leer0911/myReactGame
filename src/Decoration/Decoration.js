import React, { Component, Fragment } from 'react';
import styles from './Decoration.module.css';

class Decoration extends Component {
  render() {
    return (
      <Fragment>
        <section className={styles.c1} />
        <section className={styles.c2} />
        <section className={styles.c3} />
        <section className={styles.mountain} />
        <section className={styles.house} />
        <section className={styles.garden} />
        <section className={styles.man} />
      </Fragment>
    );
  }
}

export default Decoration;
