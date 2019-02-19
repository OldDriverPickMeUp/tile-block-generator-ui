import React, { Component } from "react";
import { connect } from "react-redux";

class TileBlock extends Component {
  renderOperations() {
    let { category, name, onDelete } = this.props;
    const styles = { container: { padding: "10px" } };
    return (
      <div style={styles.container}>
        <div>category: {category}</div>
        <div>file name: {name}</div>
        {category !== 0 && <button onClick={onDelete}>delete</button>}
      </div>
    );
  }
  render() {
    let { src, zoomRatio } = this.props;
    zoomRatio = zoomRatio?zoomRatio: 1;
    let fontSize = zoomRatio * 14;
    const styles = {
      container: {
        display: "flex",
        width:"100%",
        padding: `${zoomRatio * 10}px`,
        fontSize: `${fontSize < 10 ? 10 : fontSize}px`,
        borderBottom: "1px dashed gray"
      },
      right: { maxWidth: `${100-80 * zoomRatio}%` },
      left: {
        maxWidth: `${80 * zoomRatio}%`
      },
      leftImage: {
        maxWidth: "100%"
      }
    };
    return (
      <div style={styles.container}>
        <div style={styles.left}>
          <img src={src} style={styles.leftImage} alt="" />
        </div>
        <div style={styles.right}>{this.renderOperations()}</div>
      </div>
    );
  }
}

class TileBar extends Component {
  state = {
    zoomRatio: 1
  };
  upload = e => {
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      let reader = new FileReader();
      reader.onload = e => {
        let blockData = { src: e.target.result, name: f.name };
        let { dispatch } = this.props;
        dispatch.addCategory(blockData);
      };
      reader.readAsDataURL(files[i]);
    }
  };
  handleZoom = zoomIn => {
    let { zoomRatio } = this.state;
    zoomRatio += zoomIn ? 0.1 : -0.1;
    zoomRatio = zoomRatio > 1 ? 1 : zoomRatio < 0.1 ? 0.1 : zoomRatio;
    this.setState({ zoomRatio });
  };
  deleteTile = index => {
    let { dispatch } = this.props;
    dispatch.deleteCategory(index);
  };
  render() {
    const styles = {
      container: { padding: "20px" }
    };
    let { zoomRatio } = this.state;
    let { categories } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <input type="file" onChange={this.upload} multiple="multiple" />
          {categories.length > 0 && (
            <div>
              <button onClick={e => this.handleZoom(true)}>Zoom In</button>
              {Math.round(zoomRatio * 100)}%
              <button onClick={e => this.handleZoom(false)}>Zoom Out</button>
            </div>
          )}
          {categories.map(({ name, src }, index) => (
            <TileBlock
              key={name}
              src={src}
              category={index}
              name={name}
              zoomRatio={zoomRatio}
              onDelete={() => this.deleteTile(index)}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  categories: [...state.editorModel.categories]
});

const mapDispatch = dispatch => ({
  dispatch: dispatch.editorModel
});

export default connect(
  mapState,
  mapDispatch
)(TileBar);
