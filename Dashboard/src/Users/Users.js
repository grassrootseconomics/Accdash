import React from "react";
import "./Users.scss";

import LineChart from "../Components/LineChart/LineChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const summaryQuery = gql(`
query MonthlySummary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!, $graphType:String!){
  monthlySummaryData  (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:$graphType){ 
    value
  }
}

`);

export default class users extends React.Component {
  render() {
    return (
      <section id="users">
        <p className="title">TRADERS</p>
        <Query
          query={summaryQuery}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender,
            txType: this.props.txType,
            graphType: this.props.registeredUsers
              ? "registeredusers-cumulative"
              : "users-time-totalvsfrequent"
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <p data-testid="loading">Loading data...</p>;
            } else if (error) {
              return (
                <p data-testid="apiError">
                  API returned an error Please try again
                </p>
              );
            } else {
              const chartData = data.monthlySummaryData[0].value;
              if (chartData.length > 0) {
                // colors based on selection (registed users)
                const colors = this.props.registeredUsers
                  ? ["#32AF93"]
                  : ["#4472C4", "#1B2A37"];
                return (
                  <LineChart
                    title={"Total Traders vs Frequent Traders"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={900}
                    height={250}
                    startMonth={this.props.from}
                    endMonth={this.props.to}
                    colors={colors}
                  />
                );
              }
              return <p>There is no data for the current selection</p>;
            }
          }}
        </Query>
      </section>
    );
  }
}
