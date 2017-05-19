import React from 'react';

const Item = (props) => {
  const style = {
    position: 'absolute',
    height: props.meta.height,
    width: props.meta.width,
    left: props.meta.left,
    top: props.meta.top,
    boxShadow: 'rgba(0, 0, 0, 0.33) 0px 1px 3px 0px',
    cursor: 'pointer',
  };
  return (
    <div style={style}>
      <img src={props.meta.thumb} width={props.meta.width} alt="" onClick={() => props.click(props.meta.index)} />
    </div>
  );
};

export default Item;
