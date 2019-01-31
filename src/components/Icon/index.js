import React, { Component } from 'react';
import loadSprite from './loadSprite';
import classnames from 'classnames';
import styles from './Icon.module.css';

export default class Icon extends Component {
  static defaultProps = {
    size: 'md'
  };
  componentDidMount() {
    loadSprite();
  }
  render() {
    const { type, className, size, ...restProps } = this.props;
    const cls = classnames(className, styles[size], {
      [styles.loading]: type === 'loading'
    });
    return (
      <svg className={cls} {...restProps}>
        <use xlinkHref={`#${type}`} />
      </svg>
    );
  }
}
