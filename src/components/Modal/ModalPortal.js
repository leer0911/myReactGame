import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

// so that our CSS is statically analyzable
const CLASS_NAMES = {
  overlay: styles.overlay,
  overlayOpen: styles.overlayOpen,
  overlayClose: styles.overlayClose,
  content: styles.content,
  contentOpen: styles.contentOpen,
  contentClose: styles.contentClose
};

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
    contentRef: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      afterOpen: false,
      beforeClose: false
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
    if (this.props.closeTimeoutMS > 0) {
      this.closeWithTimeout();
    } else {
      this.closeWithoutTimeout();
    }
  };

  closeWithTimeout = () => {
    const closesAt = Date.now() + this.props.closeTimeoutMS;
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
      } else {
        this.focusContent();
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

  buildClassName = (which, additional) => {
    const classNames =
      typeof additional === 'object'
        ? additional
        : {
            base: CLASS_NAMES[which],
            afterOpen: `${CLASS_NAMES[`${which}Open`]}`,
            beforeClose: `${CLASS_NAMES[`${which}Close`]}`
          };
    let className = classNames.base;
    if (this.state.afterOpen) {
      className = `${className} ${classNames.afterOpen}`;
    }
    if (this.state.beforeClose) {
      className = `${className} ${classNames.beforeClose}`;
    }
    return typeof additional === 'string' && additional
      ? `${className} ${additional}`
      : className;
  };

  render() {
    const { className, overlayClassName } = this.props;

    return this.shouldBeClosed() ? null : (
      <div
        ref={this.setOverlayRef}
        className={this.buildClassName('overlay', overlayClassName)}
        style={{ ...this.props.style.overlay }}
        onClick={this.handleOverlayOnClick}
        onMouseDown={this.handleOverlayOnMouseDown}
      >
        <div
          ref={this.setContentRef}
          style={{ ...this.props.style.content }}
          className={this.buildClassName('content', className)}
          onMouseDown={this.handleContentOnMouseDown}
          onMouseUp={this.handleContentOnMouseUp}
          onClick={this.handleContentOnClick}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
