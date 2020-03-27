import React from "react";
import Header from ".././Components/Header/Header";
import Sidebar from ".././Components/Sidebar/Sidebar";
import Backdrop from "../Backdrop/Backdrop";
import UsersSummary from "../Summary/UsersSummary";
import TradeSummary from "../Summary/TradeSummary";
import Users from "../Components/Users/Users";
import TradeVolumes from "../Components/TradeVolumes/TradeVolumes";
import TradeVolumesPie from "../Components/TradeVolumes/TradeVolumesPie";
import Transactions from "../Components/Transactions/Transactions";
import TradeVolumesSpendType from "../Components/TradeVolumes/TradeVolumesSpendType";
import { Row, Col, Container } from "react-bootstrap";
import "./Layout.scss";

export default class Layout extends React.Component {
  state = {
    showSidebar: false,
    from: "2019-03",
    to: "2020-02",
    selectedTokenNames: [],
    selectedSpendTypes: [],
    selectedGender: [],
    selectedTransactionType: [],
    toggleGraphs: "spendtype"
  };

  getGender = selectedOptions => {
    selectedOptions !== null
      ? this.setState({
          selectedGender: selectedOptions.map(({ value }) => value)
        })
      : this.setState({
          selectedGender: []
        });
  };

  getTokens = selectedOptions => {
    selectedOptions !== null
      ? this.setState({
          selectedTokenNames: selectedOptions.map(({ value }) => value)
        })
      : this.setState({
          selectedTokenNames: []
        });
  };

  getSpendTypes = selectedOptions => {
    selectedOptions !== null
      ? this.setState({
          selectedSpendTypes: selectedOptions.map(({ value }) => value)
        })
      : this.setState({
          selectedSpendTypes: []
        });
  };

  getMonths = selectedOption => {
    this.setState({
      from: selectedOption.from,
      to: selectedOption.to
    });
  };

  getTransactionType = selectedOptions => {
    selectedOptions !== null
      ? this.setState({
          selectedTransactionType: selectedOptions.map(({ value }) => value)
        })
      : this.setState({
          selectedTransactionType: []
        });
  };

  sidebarCloseHandler = () => {
    this.setState({ showSidebar: false });
  };
  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  toggleTrade = e => {
    if (this.state.toggleGraphs !== e.currentTarget.value) {
      this.setState({ toggleGraphs: e.currentTarget.value });
    }
  };
  render() {
    return (
      <Container fluid="md">
        <Backdrop
          show={this.state.showSidebar}
          clicked={this.sidebarCloseHandler}
        />
        <Header
          toggleFilters={this.toggleSidebar}
          dateRangeFrom={this.state.from}
          dateRangeTo={this.state.to}
        />
        <Sidebar
          open={this.state.showSidebar}
          close={this.sidebarCloseHandler}
          gender={this.getGender}
          tokens={this.getTokens}
          spendTypes={this.getSpendTypes}
          months={this.getMonths}
          transactionTypes={this.getTransactionType}
        />
        <div id="body">
          <Row id="summarySection">
            <Col lg={6}>
              <UsersSummary
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokenNames}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
            <Col lg={6}>
              <TradeSummary
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokenNames}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
          </Row>
          <Row id="dataSection">
            <Col lg={6}>
              <Users
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokenNames}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
            <Col lg={2}>
              <TradeVolumesSpendType
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokenNames}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
            <Col className="col" lg={2}>
              <TradeVolumesPie
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokenNames}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
          </Row>
          <Row id="toggleSection">
            <Col className="col" lg={1}>
              <div
                className="btn-group-vertical btn-group-toggle"
                data-toggle="buttons"
              >
                <label className="btn btn-secondary active">
                  <input
                    type="radio"
                    name="options"
                    id="option"
                    value="spendtype"
                    onChange={this.toggleTrade}
                  />
                  SPEND TYPES
                </label>
                <label className="btn btn-secondary">
                  <input
                    type="radio"
                    name="options"
                    id="option"
                    value="txsubtype"
                    onChange={this.toggleTrade}
                  />
                  TRANSACTION
                </label>
                <label className="btn btn-secondary">
                  <input
                    type="radio"
                    name="options"
                    id="option"
                    value="gender"
                    onChange={this.toggleTrade}
                  />
                  GENDER
                </label>
              </div>
            </Col>
            <Col className="col" lg={5}>
              <Transactions
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokenNames}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
                tradeType={this.state.toggleGraphs}
              />
            </Col>
            <Col className="col" lg={6}>
              <TradeVolumes
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokenNames}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
                tradeType={this.state.toggleGraphs}
              />
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}
