import React, { Component, createRef } from 'react';
import styles from './App.module.css';
import Decoration from '../Decoration/Decoration';
import Tree from '../Tree/Tree';
import Checkoutin from '../Modals/Checkoutin';
import ModalContainer from '../components/Modal/ModalContainer';
import Modal from '../components/Modal/Modal';

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
        <ModalContainer>
          {modal => {
            return (
              <div>
                <Modal isOpen={modal.visible} onRequestClose={modal.hide} popup>
                  <Checkoutin />
                </Modal>
                <button onClick={modal.show}>点击打开1</button>
              </div>
            );
          }}
        </ModalContainer>
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
