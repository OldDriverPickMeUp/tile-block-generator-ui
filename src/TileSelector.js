import React, { Component } from "react";
import { connect } from "react-redux";

class TileSelector extends Component {
  handleSelect = category => {
    let { x, y, dispatch } = this.props;
    dispatch.setCategory({ x, y, category });
    this.props.close();
  };
  renderTile(src, category) {
    const imgStyle = { height: "80px", width: "80px" };
    return (
      <div key={category}>
        <img
          style={imgStyle}
          src={src}
          onClick={e => {
            e.stopPropagation();
            this.handleSelect(category);
          }}
          alt=""
        />
        {category}
      </div>
    );
  }
  render() {
    const containerStyle = {
      maxWidth: "400px",
      overflowX: "auto",
      display: "flex",
      flexWrap: "wrap"
    };
    let { categories } = this.props;
    return (
      <div style={containerStyle}>
        {categories.map((v, i) => this.renderTile(v.src, i))}
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
)(TileSelector);
