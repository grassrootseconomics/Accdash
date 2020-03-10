import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Layout from "./components/Layout/Layout";
import TradeVolumes from "./components/TradeVolumes/TradeVolumes";
import Transactions from "./components/Transactions/Transactions";
import Users from "./components/Users/Users";

class App extends React.Component {
  state = {
    selectedYear: 2019,
    selectedCurrencies: ["CONGO", "LINDI", "GATINA"]
  };
  getSelectedYear = selectedOption => {
    this.setState({ selectedYear: selectedOption.value });
    console.log("!!!!!123452345!!!", this.state.selectedYear);
  };

  getSelectedCurrencies = selectedOptions => {
    this.setState({
      selectedCurrencies: selectedOptions.map(({ value }) => value)
    });

    console.log("$$$$$789452345$$$$", this.state.selectedCurrencies);
  };

  render() {
    console.log("$$$%%%", this.selectedCurrencies);
    console.log("$$$%%%££££", this.selectedYear);
    return (
      <div className="app container-fluid">
        <Layout
          yearsCallback={this.getSelectedYear}
          currenciesCallback={this.getSelectedCurrencies}
        />
        <Users
          year={this.state.selectedYear}
          currencies={this.state.selectedCurrencies}
        />

        <TradeVolumes
          year={this.state.selectedYear}
          currencies={this.state.selectedCurrencies}
        />
        <Transactions
          year={this.state.selectedYear}
          currencies={this.state.selectedCurrencies}
        />
      </div>
    );
  }
}

export default App;
