import React, { Component } from 'react';
import styles from './LightBox.css';

class LightBox extends Component {
  render() {
    return (
      <div>
        <div className={`${styles.innerBox} ${this.props.img.width > this.props.img.height ? styles.landscape : styles.portrait}`}>
          <div className={styles.navBox}>
            {this.props.head
            ? null
            :
            <div className={styles.button} onClick={() => this.props.change(false)}>
              <span>❮</span>
            </div>
            }
            {this.props.tail
            ? null
            :
            <div className={`${styles.button} ${styles.right}`} onClick={() => this.props.change(true)}>
              <span>❯</span>
            </div>
            }
          </div>
          <img src={this.props.img.origin} alt="" className={styles.img} />
        </div>
        <div className={styles.lightBox} onClick={this.props.close} />
      </div>
    );
  }
}

export default LightBox;
