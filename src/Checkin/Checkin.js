import React, { Component, Fragment } from 'react';
import styles from './Checkin.module.css';
import ModalContainer from '../components/Modal/ModalContainer';
import Modal from '../components/Modal/Modal';
import Toast from '../components/Toast/Toast';

class Checkin extends Component {
  render() {
    const checkList = () => {
      let items = [];
      for (let index = 1; index < 8; index++) {
        const element = (
          <section className={styles.checkItem}>
            <span className={styles.checkItemText}>{`${index}天`}</span>
          </section>
        );
        items.push(element);
      }
      return <section className={styles.checkList}>{items}</section>;
    };

    return (
      <Fragment>
        <ModalContainer>
          {modal => {
            return (
              <section>
                <Modal isOpen={modal.visible} onRequestClose={modal.hide}>
                  <section className={styles.title} />
                  <section className={styles.wrap}>
                    {checkList()}
                    <section className={styles.text}>
                      每周连续签满7天可开惊喜宝箱
                    </section>
                    <section className={styles.giftWrap}>
                      <section className={styles.gift1} />
                      <section className={styles.gift2} />
                      <section className={styles.gift3} />
                      <section className={styles.gift4} />
                    </section>
                    <section
                      className={styles.modalBtn}
                      onClick={() => {
                        modal.hide();
                        Toast.info('浇水成功!');
                      }}
                    >
                      签到领10g水
                    </section>
                  </section>
                  <section className={styles.closeBtn} onClick={modal.hide} />
                </Modal>
                <section className={styles.openBtn} onClick={modal.show} />
              </section>
            );
          }}
        </ModalContainer>
      </Fragment>
    );
  }
}

export default Checkin;
