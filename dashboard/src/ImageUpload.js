import React, { Component } from 'react';
import styles from './ImageUpload.css';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { file: '', imagePreviewUrl: '' };
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new window.FormData();
    formData.append('image', this.state.file);
    window.fetch(this.props.remote, {
      method: 'POST',
      body: formData,
    }).then(res => res.json(),
    ).then((json) => {
      console.log(json);
    }).catch((err) => {
      console.error(err);
    });

    console.log('handle uploading-', this.state.file);
  }

  handleImageChange(e) {
    e.preventDefault();

    const reader = new window.FileReader();
    const selectedFile = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: selectedFile,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(selectedFile);
  }

  render() {
    const { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} alt="" />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="previewComponent">
        <form onSubmit={e => this.handleSubmit(e)}>
          <input
            className={styles.fileInput}
            type="file"
            onChange={e => this.handleImageChange(e)}
          />
          <button
            className="submitButton"
            type="submit"
            onClick={e => this.handleSubmit(e)}
          >Upload Image</button>
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>
      </div>
    );
  }
}

export default ImageUpload;
