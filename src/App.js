import React, { Component } from "react";
import TileBar from "./TileBar";
import Editor from "./Editor";

class App extends Component {
  render() {
    const styles = {
      box: { display: "flex" },
      left: { flex: "1", height: "100vh", maxWidth: "80%" },
      right: {
        minWidth: "20%",
        maxWidth: "40%",
        borderLeft: "3px solid blue",
        height: "100vh",
        overflowY: "auto"
      }
    };
    return (
      <div style={styles.box}>
        <div style={styles.left}>
          <Editor />
        </div>
        <div style={styles.right}>
          <TileBar />
        </div>
      </div>
    );
  }
}

export default App;
