import React, { Component } from 'react';
import ItemController from './ItemController';
import styles from './PhotoGallery.css';

class PhotoGallery extends Component {
  constructor() {
    super();
    this.state = {
      width: 200,
      ncol: 3,
      imageMeta: [],
    };
    this.fetchImageMeta = this.fetchImageMeta.bind(this);
  }

  componentDidMount() {
    this.fetchImageMeta();
  }

  fetchImageMeta() {
    window.fetch('http://localhost:5000/api/images', {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'application/json' },
    }).then(res => res.json(),
    ).then((json) => {
      const body = json;
      const colY = Array(this.state.ncol).fill(0);
      for (let i = 0; i < json.meta.length; i += 1) {
        const topVal = Math.min.apply(null, colY);
        const minCol = colY.indexOf(topVal);
        colY[minCol] += json.meta[i].height;
        body.meta[i] = {
          width: this.state.width,
          height: json.meta[i].height,
          url: json.meta[i].url,
          left: this.state.width * minCol,
          top: topVal,
        };
      }
      this.setState({ imageMeta: body.meta });
      console.log(body);
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    const rootStyle = {
      margin: 10,
      position: 'relative',
      width: this.state.ncol * this.state.width,
    };
    return (
      <div style={rootStyle}>
        {this.state.imageMeta.map(item => <ItemController meta={item} />)}
      </div>
    );
  }
}

export default PhotoGallery;
