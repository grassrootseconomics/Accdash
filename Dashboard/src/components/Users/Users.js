import React from "react";
import "./Users.scss";

import LineChart from "../LineChart/LineChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const summaryQuery = gql(`
query MonthlySummary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!){
  monthlySummaryData  (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"users-time-totalvsfrequent"){ 
    value
  }
}
`);

export default class users extends React.Component {
  render() {
    let title =
      this.props.from === this.props.to
        ? "TOTAL TRADERS"
        : "TOTAL TRADERS vs FREQUENT TRADERS";
    return (
      <section id="users">
        <p className="title">{title}</p>
        <Query
          query={summaryQuery}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender,
            txType: this.props.txType
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Loading data...</p>;
            } else if (error) {
              return <p>API returned an error Please try again</p>;
            } else {
              const chartData = data.monthlySummaryData[0].value;
              if (chartData.length > 0) {
                if (this.props.from === this.props.to) {
                  chartData.forEach(element => {
                    delete element.Frequent;
                  });
                }
                return (
                  <LineChart
                    title={"Total Traders vs Frequent Traders"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={900}
                    height={300}
                    startMonth={this.props.from}
                    endMonth={this.props.to}
                    colors={["#4472C4", "#1B2A37"]}
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
