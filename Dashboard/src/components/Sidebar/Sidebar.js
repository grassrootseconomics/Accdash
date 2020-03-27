import React from "react";
import "./Sidebar.scss";
// import Dropdown from "../Dropdown/Dropdown";
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
        <div className="sidebar-header">
          <h3 className="text-center">Filters</h3>
          <Query query={filters}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading data...</p>;
              return (
                <div className="filters">
                  <h6 className="title">Months</h6>
                  <MonthDropdown
                    options={data.filters[0].yearMonthList}
                    callback={this.getMonths}
                  />
                  <h6 className="title">Spend Types</h6>
                  <MultiselectDropdown
                    options={data.filters[0].spendTypeList}
                    callback={this.getSpendTypes}
                  />
                  <h6 className="title">Transaction Type</h6>
                  <MultiselectDropdown
                    options={data.filters[0].txTypeList}
                    callback={this.getTransactionTypes}
                  />
                  <h6 className="title">Gender</h6>
                  <MultiselectDropdown
                    options={data.filters[0].genderList}
                    callback={this.getGender}
                  />
                  <h6 className="title">Tokens</h6>
                  <MultiselectDropdown
                    options={data.filters[0].tokenNameList}
                    callback={this.getTokens}
                  />
                </div>
              );
            }}
          </Query>
        </div>
      </section>
    );
  }
}
