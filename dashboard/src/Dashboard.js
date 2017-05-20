import React, { Component } from 'react';
import ImageUpload from './ImageUpload';

// const hostname = 'http://localhost:5000';
const hostname = '';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      imageMeta: [],
    };
    this.fetchImageMeta = this.fetchImageMeta.bind(this);
  }

  componentDidMount() {
    this.fetchImageMeta();
  }

  fetchImageMeta() {
    window.fetch(`${hostname}/api/images`, {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'application/json' },
    }).then(res => res.json(),
    ).then((json) => {
      const body = json;
      const colY = Array(this.state.ncol).fill(0);
      let max = this.state.maxHeight;
      this.setState({ width: json.width });
      for (let i = 0; i < json.meta.length; i += 1) {
        const topVal = Math.min.apply(null, colY);
        const minCol = colY.indexOf(topVal);
        colY[minCol] += (json.meta[i].height + this.state.margin);
        if (max < topVal + json.meta[i].height) {
          max = topVal + json.meta[i].height;
        }
        body.meta[i] = {
          hidden: true,
          width: this.state.width,
          height: json.meta[i].height,
          thumb: hostname + json.meta[i].thumb,
          origin: hostname + json.meta[i].origin,
          left: (this.state.width + this.state.margin) * minCol,
          top: topVal,
          index: i,
        };
      }
      this.setState({ imageMeta: body.meta, maxHeight: max });
      for (let i = 0; i < this.state.imageMeta.length; i += 1) {
        setTimeout(() => {
          const meta = this.state.imageMeta;
          meta[i].hidden = false;
          this.setState({ imageMeta: meta });
        }, Math.random() * 1000);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        <ImageUpload remote={`${hostname}/api/images`} />
      </div>
    );
  }
}

export default Dashboard;
