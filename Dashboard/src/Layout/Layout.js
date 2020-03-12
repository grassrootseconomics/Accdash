import React from "react";
import Header from ".././Components/Header/Header";
import Sidebar from ".././Components/Sidebar/Sidebar";
import Backdrop from "../Backdrop/Backdrop";
import Summary from "../Summary/Summary";
import Users from "../Components/Users/Users";
import TradeVolumes from "../Components/TradeVolumes/TradeVolumes";
import Transactions from "../Components/Transactions/Transactions";
import { Row, Col } from "react-bootstrap";

export default class Layout extends React.Component {
  state = {
    showSidebar: false,
    from: "2018-11",
    to: "2020-02",
    selectedTokenNames: [],
    selectedSpendTypes: []
  };

  getSelectedYear = selectedOption => {
    this.setState({ selectedYear: selectedOption.value });
    console.log("!!!!!123452345!!!", this.state.selectedYear);
  };

  getselectedTokenNames = selectedOptions => {
    this.setState({
      selectedTokenNames: selectedOptions.map(({ value }) => value)
    });

    console.log("$$$$$789452345$$$$", this.state.selectedTokenNames);
  };

  getYearsCallback = selectedOption => {
    console.log("!!!!!2345!!!", selectedOption);
    this.props.yearsCallback(selectedOption);
  };

  getCurrenciesCallback = selectedOptions => {
    console.log("$$$$7895$$$", selectedOptions);
    this.props.currenciesCallback(selectedOptions);
  };

  sidebarCloseHandler = () => {
    this.setState({ showSidebar: false });
  };
  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };
  render() {
    return (
      <div>
        <Backdrop
          show={this.state.showSidebar}
          clicked={this.sidebarCloseHandler}
        />
        <Header toggleFilters={this.toggleSidebar} />
        <Sidebar
          open={this.state.showSidebar}
          close={this.sidebarCloseHandler}
          yearsDropdown={this.getYearsCallback}
          currenciesDropdown={this.getCurrenciesCallback}
        />
        <Row>
          <Col xs={2}>
            <Summary
              from={this.state.from}
              to={this.state.to}
              tokens={this.state.selectedTokenNames}
              buisinessTypes={this.state.selectedSpendTypes}
            />
          </Col>
          <Col xs={5}>
            <Users
              year={2019}
              from={this.state.from}
              to={this.state.to}
              tokens={this.state.selectedTokenNames}
              buisinessTypes={this.state.selectedSpendTypes}
            />
            <Transactions
              year={2019}
              from={this.state.from}
              to={this.state.to}
              tokens={this.state.selectedTokenNames}
              buisinessTypes={this.state.selectedSpendTypes}
            />
          </Col>
          <Col xs={5}>
            <TradeVolumes
              year={2019}
              from={this.state.from}
              to={this.state.to}
              tokens={this.state.selectedTokenNames}
              buisinessTypes={this.state.selectedSpendTypes}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
