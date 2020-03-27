import React from "react";
import LineChart from "../LineChart/LineChart";
import StackedBarChart from "../StackedBarChart/StackedBarChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./Transactions.scss";

const summary = gql(`
query MonthlySummary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!, $tradeType:String!){
  monthlySummaryData  (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:$tradeType){ 
    value
  }
}
`);

export default class Transactions extends React.Component {
  render() {
    return (
      <section id="transactions">
        <p className="title">NO OF TRANSACTIONS</p>
        <Query
          query={summary}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender,
            txType: this.props.txType,
            tradeType: `transactioncount-time-${this.props.tradeType}`
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Loading data...</p>;
            } else if (error) {
              return <p>Section will be loaded shortly</p>;
            } else {
              const chartData = data.monthlySummaryData[0].value;
              if (chartData.length > 0) {
                return this.props.tradeType === "spendtype" ? (
                  <StackedBarChart
                    title={"Transactions"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={750}
                    height={325}
                  />
                ) : (
                  <LineChart
                    title={"Transactions"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={750}
                    height={325}
                  />
                );
              }
            }
          }}
        </Query>
      </section>
    );
  }
}
