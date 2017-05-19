import React, { Component } from 'react';
import Item from './Item';

class ItemController extends Component {
  render() {
    return (
      <Item meta={this.props.meta} click={this.props.click} />
    );
  }
}

export default ItemController;
