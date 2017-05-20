import React from 'react';
import PropTypes from 'prop-types';
import meta from './Item';
import styles from './LightBox.css';

const LightBox = (props) => {
  const prevButton = props.head
    ? null
    : (
      <div className={styles.button} onClick={() => props.change(false)}>
        <span>❮</span>
      </div>
    );
  const nextButton = props.tail
    ? null
    : (
      <div className={`${styles.button} ${styles.right}`} onClick={() => props.change(true)}>
        <span>❯</span>
      </div>
    );
  const imgOrientation = props.meta.width > props.meta.height ? styles.landscape : styles.portrait;
  const keyDown = (event) => {
    const e = event;
    if (e.key === 'Escape') {
      e.preventDefault();
      props.close();
    }
  };
  let div = null;

  return (
    <div
      tabIndex="0"
      onKeyDown={keyDown}
      ref={(item) => { div = item; }}
      onLoad={() => { div.focus(); }}
    >
      <div className={`${styles.innerBox} ${imgOrientation}`}>
        <img src={props.meta.origin} alt="" className={styles.img} />
      </div>
      <div className={styles.navBox}>
        {prevButton}
        {nextButton}
      </div>
      <div className={styles.lightBox} onClick={props.close} />
    </div>
  );
};

LightBox.propTypes = {
  head: PropTypes.bool.isRequired,
  tail: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  meta: PropTypes.shape(meta).isRequired,
};

export default LightBox;
