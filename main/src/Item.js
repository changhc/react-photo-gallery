import React from 'react';
import PropTypes from 'prop-types';
import styles from './Item.css';

const Item = (props) => {
  const style = {
    height: props.meta.height,
    width: props.meta.width,
    left: props.meta.left,
    top: props.meta.top,
  };

  return (
    <div style={style} className={styles.item}>
      <img
        className={styles.img}
        src={props.meta.thumb}
        width={props.meta.width}
        alt=""
        onClick={() => props.click(props.meta.index)}
      />
    </div>
  );
};

const meta = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  thumb: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired,
};

Item.propTypes = {
  meta: PropTypes.shape(meta).isRequired,
  click: PropTypes.func.isRequired,
};

export { Item, meta };
