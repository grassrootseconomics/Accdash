import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Layout from "./Layout/Layout";

class App extends React.Component {
  render() {
    return (
      <div className="app container-fluid">
        <Layout />
        {/* <Users
          year={this.state.year}
          from={this.state.from}
          to={this.state.to}
          tokens={this.state.selectedTokenNames}
          buisinessTypes={this.state.selectedSpendTypes}
        />
        <div className="trade">
          <TradeVolumes
            year={this.state.year}
            from={this.state.from}
            to={this.state.to}
            tokens={this.state.selectedTokenNames}
            buisinessTypes={this.state.selectedSpendTypes}
          />
          <Transactions
            year={this.state.year}
            from={this.state.from}
            to={this.state.to}
            tokens={this.state.selectedTokenNames}
            buisinessTypes={this.state.selectedSpendTypes}
          /> 
        </div>*/}
      </div>
    );
  }
}

export default App;
