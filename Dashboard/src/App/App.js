import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Layout from "../Layout/Layoutyout";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Layout />
      </div>
    );
  }
}

export default App;
