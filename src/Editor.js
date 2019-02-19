import React, { Component } from "react";
import NumberFormat from "react-number-format";
import editorStyles from "./Editor.module.css";
import TileSelector from "./TileSelector";
import { connect } from "react-redux";
import FileSaver from "file-saver";
import store from "./states";

class TileOperation extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidMount() {
    this.ref.current.focus();
  }
  loseFocus = () => {
    this.ref.current.blur();
    this.props.close();
  };
  renderSelect() {
    let { x, y } = this.props;
    return (
      <div>
        <TileSelector close={this.loseFocus} x={x} y={y} />
      </div>
    );
  }
  handleDelete = e => {
    e.stopPropagation();
    let { x, y } = this.props;
    store.dispatch.editorModel.clearCategory({ x, y });
    this.loseFocus();
  };
  render() {
    const styles = {
      container: {
        padding: "10px"
      }
    };
    return (
      <div
        className={editorStyles.tileOperation}
        style={styles.container}
        ref={this.ref}
        tabIndex="-1"
        onBlur={this.props.close}
      >
        <div>
          <div onClick={this.handleDelete}>delete</div>
        </div>
        <div>
          <div>copy</div>
        </div>
        <div>
          <div>paste</div>
        </div>
        <div>{this.renderSelect()}</div>
      </div>
    );
  }
}

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

  showOperation = () => {
    this.setState({ showPopup: true });
  };
  hideOperation = () => {
    this.setState({ showPopup: false });
  };
  renderPopup() {
    const popupStyle = {
      position: "absolute",
      transform: "translate(40px,-40px)",
      backgroundColor: "#d0e0e3",
      boxShadow: "10px 10px 5px #888888",
      borderRadius: "5px"
    };
    let { x, y } = this.props;
    return (
      <div style={popupStyle}>
        <TileOperation x={x} y={y} close={this.hideOperation} />
      </div>
    );
  }
  renderEmpty() {
    const alignCenter = {
      textAlign: "center",
      lineHeight: "80px",
      backgroundColor: "white"
    };
    return <div style={alignCenter}>empty</div>;
  }
  renderImage(src) {
    const styles = { width: "100%", height: "100%" };
    return <img src={src} alt="" style={styles} />;
  }
  render() {
    let { src } = this.props;
    let { showPopup } = this.state;
    const container = {
      width: "80px",
      height: "80px",
      cursor: "pointer"
    };
    if (showPopup) {
      container.position = "static";
    }
    return (
      <div
        style={container}
        className={editorStyles.tile}
        onClick={this.showOperation}
      >
        {src ? this.renderImage(src) : this.renderEmpty()}
        {showPopup && this.renderPopup()}
      </div>
    );
  }
}

class EditorPanel extends Component {
  getArray(x) {
    let array = [];
    for (let i = 0; i < x; i++) {
      array.push(i);
    }
    return array;
  }
  renderTile(category, x, y) {
    let { categories } = this.props;
    let cc =
      category >= 0 && categories.length > 0 ? categories[category] : null;
    return <Tile key={`${x}-${y}`} x={x} y={y} src={cc && cc.src} />;
  }
  renderCol(colIndex, rowArray) {
    const rolStyle = {
      display: "flex"
    };

    return (
      <div style={rolStyle} key={colIndex}>
        {rowArray.map((category, row) =>
          this.renderTile(category, colIndex, row)
        )}
      </div>
    );
  }
  render() {
    let { matrix } = this.props;
    return <div>{matrix.map((e, col) => this.renderCol(col, e))}</div>;
  }
}

class Editor extends Component {
  state = { x: 5, y: 5, size: { x: 5, y: 5 } };
  handleSizeChange = () => {
    let { x, y } = this.state;
    if (x < 5 || y < 5) {
      alert("x,y should be no less than 5");
      return;
    }
    this.setState({ size: { x, y } });
    let { dispatch } = this.props;
    dispatch.setSize({ x, y });
  };
  handleClearAll = () => {
    let { dispatch } = this.props;
    dispatch.setSize(this.state.size);
  };
  handleSave = () => {
    let { matrix, categories } = this.props;
    matrix = matrix.map(row => row.map(e => (e === -1 ? 0 : e)));
    categories = categories.map((v, i) => ({ category: i, filename: v.name }));
    var file = new File(
      [JSON.stringify({ categories, example: matrix })],
      "example.json",
      { type: "text/plain;charset=utf-8" }
    );
    FileSaver.saveAs(file);
  };
  componentWillMount() {
    let { dispatch } = this.props;
    dispatch.setSize(this.state.size);
  }
  render() {
    const styles = {
      container: {
        padding: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box"
      },
      title: { display: "flex", borderBottom: "3px solid black" },
      toolbox: {
        flex: "1",
        display: "flex",
        alignItems: "center",
        padding: "10px"
      },
      editorPanel: {
        width: "100%",
        flex: "1",
        overflow: "auto",
        display: "flex",
        justifyContent: "center"
      }
    };
    let { size } = this.state;
    let { matrix, categories } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.title}>
          <h1>Edit Examples</h1>
          <div style={styles.toolbox}>
            <div>
              size:{" "}
              <NumberFormat
                allowNegative={false}
                onValueChange={value =>
                  this.setState({
                    x: value.formattedValue
                  })
                }
                defaultValue={5}
              />
              *
              <NumberFormat
                allowNegative={false}
                onValueChange={value =>
                  this.setState({
                    y: value.formattedValue
                  })
                }
                defaultValue={5}
              />
              <button onClick={this.handleSizeChange}>submit</button>
            </div>
            <div>
              <button onClick={this.handleClearAll}>clear all</button>
              <button onClick={this.handleSave}>save matrix</button>
            </div>
          </div>
        </div>
        <div style={styles.editorPanel}>
          <EditorPanel size={size} matrix={matrix} categories={categories} />
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  matrix: state.editorModel.matrix.map(v => v.slice()),
  categories: [...state.editorModel.categories]
});

const mapDispatch = dispatch => ({
  dispatch: dispatch.editorModel
});

export default connect(
  mapState,
  mapDispatch
)(Editor);
