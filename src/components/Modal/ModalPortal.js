import { CSSTransition } from 'react-transition-group';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

export const classNamesShape =
  process.env.NODE_ENV !== 'production'
    ? PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          enter: PropTypes.string,
          exit: PropTypes.string,
          active: PropTypes.string
        }),
        PropTypes.shape({
          enter: PropTypes.string,
          enterDone: PropTypes.string,
          enterActive: PropTypes.string,
          exit: PropTypes.string,
          exitDone: PropTypes.string,
          exitActive: PropTypes.string
        })
      ])
    : null;

export default class ModalPortal extends Component {
  static defaultProps = {
    style: {
      overlay: {},
      content: {}
    }
  };

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    overlayClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onAfterOpen: PropTypes.func,
    onAfterClose: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    shouldCloseOnOverlayClick: PropTypes.bool,
    children: PropTypes.node,
    overlayRef: PropTypes.func,
    contentRef: PropTypes.func,
    popup: PropTypes.bool,
    noAnimation: PropTypes.bool,
    animationType: PropTypes.string,
    contentTransitionName: classNamesShape,
    overlayTransitionName: classNamesShape
  };

  constructor(props) {
    super(props);

    this.state = {
      afterOpen: false,
      beforeClose: false,
      defaultTimeout: props.noAnimation ? 0 : 500
    };

    this.shouldClose = null;
    this.moveFromContentToOverlay = null;
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this.open();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.open();
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.close();
    }
  }

  componentWillUnmount() {
    this.afterClose();
    clearTimeout(this.closeTimer);
  }

  setOverlayRef = overlay => {
    this.overlay = overlay;
    this.props.overlayRef && this.props.overlayRef(overlay);
  };

  setContentRef = content => {
    this.content = content;
    this.props.contentRef && this.props.contentRef(content);
  };

  afterClose = () => {
    if (this.props.onAfterClose) {
      this.props.onAfterClose();
    }
  };

  open = () => {
    if (this.state.afterOpen && this.state.beforeClose) {
      clearTimeout(this.closeTimer);
      this.setState({ beforeClose: false });
    } else {
      this.setState({ isOpen: true }, () => {
        this.setState({ afterOpen: true });

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      });
    }
  };

  close = () => {
    if (this.props.closeTimeoutMS > 0 || !this.props.noAnimation) {
      this.closeWithTimeout();
    } else {
      this.closeWithoutTimeout();
    }
  };

  closeWithTimeout = () => {
    const closesAt =
      Date.now() + this.props.closeTimeoutMS + this.state.defaultTimeout;
    this.setState({ beforeClose: true, closesAt }, () => {
      this.closeTimer = setTimeout(
        this.closeWithoutTimeout,
        this.state.closesAt - Date.now()
      );
    });
  };

  closeWithoutTimeout = () => {
    this.setState(
      {
        beforeClose: false,
        isOpen: false,
        afterOpen: false,
        closesAt: null
      },
      this.afterClose
    );
  };

  handleOverlayOnClick = event => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }

    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.ownerHandlesClose()) {
        this.requestClose(event);
      }
    }
    this.shouldClose = null;
  };

  handleContentOnMouseUp = () => {
    this.shouldClose = false;
  };

  handleOverlayOnMouseDown = event => {
    if (
      !this.props.shouldCloseOnOverlayClick &&
      event.target === this.overlay
    ) {
      event.preventDefault();
    }
  };

  handleContentOnClick = () => {
    this.shouldClose = false;
  };

  handleContentOnMouseDown = () => {
    this.shouldClose = false;
  };

  requestClose = event =>
    this.ownerHandlesClose() && this.props.onRequestClose(event);

  ownerHandlesClose = () => this.props.onRequestClose;

  shouldBeClosed = () => !this.state.isOpen && !this.state.beforeClose;

  render() {
    const {
      className,
      overlayClassName,
      closeTimeoutMS,
      contentTransitionName,
      overlayTransitionName,
      popup
    } = this.props;

    const getAniClassName = key => {
      if (key === 'overlay' && overlayTransitionName) {
        return overlayTransitionName;
      }
      if (key === 'content' && contentTransitionName) {
        return contentTransitionName;
      }

      popup && (key = `${key}Popup`);
      return {
        appear: styles[`${key}Appear`],
        appearActive: styles[`${key}ActiveAppear`],
        enter: styles[`${key}Enter`],
        enterActive: styles[`${key}ActiveEnter`],
        exit: styles[`${key}Exit`],
        exitActive: styles[`${key}ActiveExit`]
      };
    };

    return this.shouldBeClosed() ? null : (
      <CSSTransition
        in={this.state.afterOpen && !this.state.beforeClose}
        timeout={closeTimeoutMS || this.state.defaultTimeout}
        classNames={getAniClassName('overlay')}
      >
        <div
          ref={this.setOverlayRef}
          className={
            overlayClassName || popup ? styles.overlayPopup : styles.overlay
          }
          style={{ ...this.props.style.overlay }}
          onClick={this.handleOverlayOnClick}
          onMouseDown={this.handleOverlayOnMouseDown}
        >
          <CSSTransition
            in={this.state.afterOpen && !this.state.beforeClose}
            timeout={closeTimeoutMS || this.state.defaultTimeout}
            classNames={getAniClassName('content')}
          >
            <div
              ref={this.setContentRef}
              style={{ ...this.props.style.content }}
              className={
                className || popup ? styles.contentPopup : styles.content
              }
              onMouseDown={this.handleContentOnMouseDown}
              onMouseUp={this.handleContentOnMouseUp}
              onClick={this.handleContentOnClick}
            >
              {this.props.children}
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    );
  }
}
