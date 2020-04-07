import React from "react";
import "./Sidebar.scss";
import MultiselectDropdown from "../MultiselectDropdown/MultiselectDropdown";
import MonthDropdown from "../MonthDropdown/MonthDropdown";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const filters = gql(`
  query{
    filters{
      yearMonthList
      tokenNameList
      spendTypeList
      genderList
      txTypeList      
    }
  }
`);

export default class Sidebar extends React.Component {
  getGender = selectedOptions => {
    this.props.gender(selectedOptions);
  };

  getTransactionTypes = selectedOptions => {
    this.props.transactionTypes(selectedOptions);
  };

  getSpendTypes = selectedOptions => {
    this.props.spendTypes(selectedOptions);
  };

  getTokens = selectedOptions => {
    this.props.tokens(selectedOptions);
  };

  getMonths = selectedOptions => {
    this.props.months(selectedOptions);
  };

  render() {
    return (
      <section id="sidebar" className={this.props.open ? "open" : "close"}>
        <Query query={filters}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading data...</p>;
            return (
              <div className="filters">
                <label className="title">
                  Months <span>(Select Date Range)</span>
                </label>
                <MonthDropdown
                  options={data.filters[0].yearMonthList}
                  callback={this.getMonths}
                  start={this.props.startDate}
                  end={this.props.endDate}
                />
                <label className="title">Spend Types</label>
                <MultiselectDropdown
                  options={data.filters[0].spendTypeList}
                  callback={this.getSpendTypes}
                />
                <label className="title">Transaction Type</label>
                <MultiselectDropdown
                  options={data.filters[0].txTypeList}
                  callback={this.getTransactionTypes}
                  selected={this.props.selectedTXType}
                />
                <label className="title">Gender</label>
                <MultiselectDropdown
                  options={data.filters[0].genderList}
                  callback={this.getGender}
                  selected={this.props.selectedGender}
                />
                <label className="title">Tokens</label>
                <MultiselectDropdown
                  options={data.filters[0].tokenNameList}
                  callback={this.getTokens}
                />
              </div>
            );
          }}
        </Query>
      </section>
    );
  }
}
