import React, { Component } from 'react';
import Item from './Item';

class ItemController extends Component {
  render() {
    return (
      <Item meta={this.props.meta} />
    );
  }
}

export default ItemController;
