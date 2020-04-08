import React from "react";
import Header from ".././Components/Header/Header";
import Sidebar from ".././Components/Sidebar/Sidebar";
import Backdrop from "../Backdrop/Backdrop";
import UsersSummary from "../Summary/UsersSummary";
import TradeSummary from "../Summary/TradeSummary";
import Users from "../Users/Users";
import TradeVolumes from "../Trades/TradeVolumes/TradeVolumes";
import Traders from "../Trades/Traders/Traders";
import TradeVolumesGender from "../Trades/TradeVolumesGender/TradeVolumesGender";
import Transactions from "../Trades/Transactions/Transactions";
import TradeVolumesSpendType from "../Trades/TradeVolumesSpendType/TradeVolumesSpendType";
import { Row, Col, Container } from "react-bootstrap";
import "./Layout.scss";

export default class Layout extends React.Component {
  state = {
    showSidebar: false,
    from: "2019-04",
    to: "2020-03",
    selectedTokens: [],
    selectedSpendTypes: [],
    selectedGender: ["Male", "Female"],
    selectedTransactionType: ["STANDARD"],
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
          selectedTokens: selectedOptions.map(({ value }) => value)
        })
      : this.setState({
          selectedTokens: []
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
      <Container fluid>
        <Backdrop
          show={this.state.showSidebar}
          clicked={this.sidebarCloseHandler}
        />
        <Header
          toggleFilters={this.toggleSidebar}
          dateRangeFrom={this.state.from}
          dateRangeTo={this.state.to}
          selectedGender={this.state.selectedGender}
          selectedTXType={this.state.selectedTransactionType}
          selectedSpendType={this.state.selectedSpendTypes}
          selectedTokens={this.state.selectedTokens}
        />
        <Sidebar
          open={this.state.showSidebar}
          close={this.sidebarCloseHandler}
          gender={this.getGender}
          tokens={this.getTokens}
          spendTypes={this.getSpendTypes}
          months={this.getMonths}
          transactionTypes={this.getTransactionType}
          startDate={this.state.from}
          endDate={this.state.to}
          selectedGender={this.state.selectedGender}
          selectedTXType={this.state.selectedTransactionType}
        />
        <div id="body">
          <Row id="summarySection">
            <Col className="col" lg={6}>
              <UsersSummary
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokens}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
            <Col className="col" lg={6}>
              <TradeSummary
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokens}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
          </Row>

          <Row id="dataSection">
            <Col className="column users" lg={6}>
              <Users
                from={this.state.from}
                to={this.state.to}
                tokens={this.state.selectedTokens}
                spendTypes={this.state.selectedSpendTypes}
                gender={this.state.selectedGender}
                txType={this.state.selectedTransactionType}
              />
            </Col>
            <Col className="column trades" lg={6}>
              <Row>
                <Col className="column spend" lg={4}>
                  <TradeVolumesSpendType
                    from={this.state.from}
                    to={this.state.to}
                    tokens={this.state.selectedTokens}
                    spendTypes={this.state.selectedSpendTypes}
                    gender={this.state.selectedGender}
                    txType={this.state.selectedTransactionType}
                  />
                </Col>
                <Col className="column gender" lg={4}>
                  <TradeVolumesGender
                    from={this.state.from}
                    to={this.state.to}
                    tokens={this.state.selectedTokens}
                    spendTypes={this.state.selectedSpendTypes}
                    gender={this.state.selectedGender}
                    txType={this.state.selectedTransactionType}
                  />
                </Col>
                <Col className="column traders" lg={4}>
                  <Traders
                    from={this.state.from}
                    to={this.state.to}
                    tokens={this.state.selectedTokens}
                    spendTypes={this.state.selectedSpendTypes}
                    gender={this.state.selectedGender}
                    txType={this.state.selectedTransactionType}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="togglableSection">
            <Row id="toggleGroup">
              <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <label
                  className={`btn btn-secondary ${
                    this.state.toggleGraphs === "spendtype" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="options"
                    id="option"
                    value="spendtype"
                    onChange={this.toggleTrade}
                  />
                  Spend Types
                </label>
                <label
                  className={`btn btn-secondary ${
                    this.state.toggleGraphs === "txsubtype" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="options"
                    id="option"
                    value="txsubtype"
                    onChange={this.toggleTrade}
                  />
                  Transactions
                </label>
                <label
                  className={`btn btn-secondary ${
                    this.state.toggleGraphs === "gender" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="options"
                    id="option"
                    value="gender"
                    onChange={this.toggleTrade}
                  />
                  Gender
                </label>
              </div>
            </Row>
            <Row id="toggleGraphs">
              <Col className="column" lg={6}>
                <Transactions
                  from={this.state.from}
                  to={this.state.to}
                  tokens={this.state.selectedTokens}
                  spendTypes={this.state.selectedSpendTypes}
                  gender={this.state.selectedGender}
                  txType={this.state.selectedTransactionType}
                  tradeType={this.state.toggleGraphs}
                />
              </Col>
              <Col className="column" lg={6}>
                <TradeVolumes
                  from={this.state.from}
                  to={this.state.to}
                  tokens={this.state.selectedTokens}
                  spendTypes={this.state.selectedSpendTypes}
                  gender={this.state.selectedGender}
                  txType={this.state.selectedTransactionType}
                  tradeType={this.state.toggleGraphs}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    );
  }
}
