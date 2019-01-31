import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import styles from './Toast.module.css';
import Icon from '../Icon';

const ENTERTIME = 300;
let container = null;
class Toast extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    timeout: PropTypes.number
  };
  static defaultProps = {
    timeout: 2000
  };
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }
  close() {
    const { timeout } = this.props;
    setTimeout(() => {
      if (!container) {
        return;
      }
      this.setState({
        show: false
      });
      setTimeout(() => {
        this.teardown();
      }, ENTERTIME);
    }, timeout);
  }
  teardown() {
    ReactDOM.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
    container = null;
  }
  componentDidMount() {
    this.close();
  }
  render() {
    let { show } = this.state;
    let { text, type } = this.props;
    return (
      <CSSTransition
        in={show}
        classNames="toastmask"
        timeout={ENTERTIME}
        appear={true}
        enter={true}
        exit={true}
      >
        <div className={styles.content} style={{ padding: type ? '15px' : '' }}>
          {type && <Icon type={type} size="lg" />}
          <div style={{ marginTop: type ? '6px' : '' }}>{text}</div>
        </div>
      </CSSTransition>
    );
  }
  hide = () => {
    this.setState({
      show: false
    });
  };
}

const toast = (text, timeout, type) => {
  let tempDiv = document.createElement('div');
  tempDiv.className = styles.mask;
  document.body.appendChild(tempDiv);
  container = tempDiv;
  let props = {
    text,
    type
  };
  if (timeout) {
    props.timeout = timeout;
  }
  ReactDOM.render(<Toast {...props} />, tempDiv);
};

export default {
  info(text, timeout) {
    toast(text, timeout);
  },
  success(text, timeout) {
    toast(text, timeout, 'success');
  },
  fail(text, timeout) {
    toast(text, timeout, 'fail');
  },
  loading(text, timeout) {
    toast(text, timeout, 'loading');
  },
  hide() {
    if (!container) {
      return;
    }
    ReactDOM.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
    container = null;
  }
};
