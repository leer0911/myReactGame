import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ModalPortal from './ModalPortal';
import { polyfill } from 'react-lifecycles-compat';
import styles from './Modal.module.css';

export const portalClassName = styles.container;

const isReact16 = ReactDOM.createPortal !== undefined;

const getCreatePortal = () =>
  isReact16
    ? ReactDOM.createPortal
    : ReactDOM.unstable_renderSubtreeIntoContainer;

function getParentElement(parentSelector) {
  return parentSelector();
}

class Modal extends Component {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    portalClassName: PropTypes.string,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        base: PropTypes.string.isRequired,
        afterOpen: PropTypes.string.isRequired,
        beforeClose: PropTypes.string.isRequired
      })
    ]),
    overlayClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        base: PropTypes.string.isRequired,
        afterOpen: PropTypes.string.isRequired,
        beforeClose: PropTypes.string.isRequired
      })
    ]),
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    shouldCloseOnOverlayClick: PropTypes.bool,
    parentSelector: PropTypes.func,
    role: PropTypes.string,
    overlayRef: PropTypes.func,
    contentRef: PropTypes.func
  };
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    isOpen: false,
    portalClassName,
    closeTimeoutMS: 0,
    shouldCloseOnOverlayClick: true,
    parentSelector: () => document.body
  };

  componentDidMount() {
    if (!isReact16) {
      this.node = document.createElement('div');
    }
    this.node.className = this.props.portalClassName;

    const parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);

    !isReact16 && this.renderPortal(this.props);
  }

  getSnapshotBeforeUpdate(prevProps) {
    const prevParent = getParentElement(prevProps.parentSelector);
    const nextParent = getParentElement(this.props.parentSelector);
    return { prevParent, nextParent };
  }

  componentDidUpdate(prevProps, _, snapshot) {
    const { isOpen, portalClassName } = this.props;

    if (prevProps.portalClassName !== portalClassName) {
      this.node.className = portalClassName;
    }

    const { prevParent, nextParent } = snapshot;
    if (nextParent !== prevParent) {
      prevParent.removeChild(this.node);
      nextParent.appendChild(this.node);
    }

    // Stop unnecessary renders if modal is remaining closed
    if (!prevProps.isOpen && !isOpen) return;

    !isReact16 && this.renderPortal(this.props);
  }

  componentWillUnmount() {
    if (!this.node || !this.portal) return;

    const state = this.portal.state;
    const now = Date.now();
    const closesAt =
      state.isOpen &&
      this.props.closeTimeoutMS &&
      (state.closesAt || now + this.props.closeTimeoutMS);

    if (closesAt) {
      if (!state.beforeClose) {
        this.portal.closeWithTimeout();
      }

      setTimeout(this.removePortal, closesAt - now);
    } else {
      this.removePortal();
    }
  }

  removePortal = () => {
    !isReact16 && ReactDOM.unmountComponentAtNode(this.node);
    const parent = getParentElement(this.props.parentSelector);
    parent.removeChild(this.node);
  };

  portalRef = ref => {
    this.portal = ref;
  };

  renderPortal = props => {
    const createPortal = getCreatePortal();
    const portal = createPortal(this, <ModalPortal {...props} />, this.node);
    this.portalRef(portal);
  };

  render() {
    if (!isReact16) {
      return null;
    }
    if (!this.node && isReact16) {
      this.node = document.createElement('div');
    }

    const createPortal = getCreatePortal();
    return createPortal(
      <ModalPortal ref={this.portalRef} {...this.props} />,
      this.node
    );
  }
}

polyfill(Modal);

export default Modal;
