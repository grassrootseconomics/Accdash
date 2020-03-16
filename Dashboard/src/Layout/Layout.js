import React from "react";
import Header from ".././Components/Header/Header";
import Sidebar from ".././Components/Sidebar/Sidebar";
import Backdrop from "../Backdrop/Backdrop";
import Summary from "../Summary/Summary";
import Users from "../Components/Users/Users";
import TradeVolumes from "../Components/TradeVolumes/TradeVolumes";
import Transactions from "../Components/Transactions/Transactions";
import { Row, Col, Container } from "react-bootstrap";

export default class Layout extends React.Component {
  state = {
    showSidebar: false,
    from: "2018-11",
    to: "2020-03",
    selectedTokenNames: [],
    selectedSpendTypes: [],
    selectedGender: []
  };

  getGender = selectedOption => {
    this.setState({ selectedGender: selectedOption.value });
  };

  getTokens = selectedOptions => {
    this.setState({
      selectedTokenNames: selectedOptions.map(({ value }) => value)
    });
  };

  getSpendTypes = selectedOptions => {
    this.setState({
      selectedSpendTypes: selectedOptions.map(({ value }) => value)
    });
  };
  getMonths = selectedOption => {
    console.log("!!!!!2345!!!", selectedOption);
    this.setState({
      from: selectedOption.from,
      to: selectedOption.to
    });
  };

  sidebarCloseHandler = () => {
    this.setState({ showSidebar: false });
  };
  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };
  render() {
    return (
      <Container fluid="md">
        <Backdrop
          show={this.state.showSidebar}
          clicked={this.sidebarCloseHandler}
        />
        <Header toggleFilters={this.toggleSidebar} />
        <Sidebar
          open={this.state.showSidebar}
          close={this.sidebarCloseHandler}
          gender={this.getGender}
          tokens={this.getTokens}
          spendTypes={this.getSpendTypes}
          months={this.getMonths}
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
              gender={this.state.selectedGender}
            />
            <Transactions
              year={2019}
              from={this.state.from}
              to={this.state.to}
              tokens={this.state.selectedTokenNames}
              buisinessTypes={this.state.selectedSpendTypes}
              gender={this.state.selectedGender}
            />
          </Col>
          <Col xs={5}>
            <TradeVolumes
              year={2019}
              from={this.state.from}
              to={this.state.to}
              tokens={this.state.selectedTokenNames}
              buisinessTypes={this.state.selectedSpendTypes}
              gender={this.state.selectedGender}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
