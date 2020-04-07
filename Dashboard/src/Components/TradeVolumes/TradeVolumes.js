import React from "react";
import StackedBarChart from "../StackedBarChart/StackedBarChart";
import LineChart from "../LineChart/LineChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./TradeVolumes.scss";

const summary = gql(`
query MonthlySummary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!, $tradeType:String!){
  monthlySummaryData  (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, , request:$tradeType){ 
    value
  }
}
`);

export default class TradeVolumes extends React.Component {
  render() {
    return (
      <section id="tradeVolumes">
        <p className="title">TRADE VOLUMES</p>
        <Query
          query={summary}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender,
            txType: this.props.txType,
            tradeType: `tradevolumes-time-${this.props.tradeType}`
          }}
        >
          {({ loading, error, data }) => {
            const colors =
              this.props.tradeType === "gender"
                ? ["#3b5998", "#8b9dc3", "#536878", "#4279a3"]
                : [
                    "#38DCE2",
                    "#32AF93",
                    "#248890",
                    "#74D485",
                    "#68EEAB",
                    "#CAF270",
                    "#2FADB6",
                    "#66FCF1",
                    "#1A505B",
                    "#4472C4",
                    "#1B2A37",
                    "#8EBFF2"
                  ];
            if (loading) {
              return <p>Loading data...</p>;
            } else if (error) {
              return <p>API returned an error Please try again</p>;
            } else {
              const chartData = data.monthlySummaryData[0].value;
              if (chartData.length > 0) {
                return this.props.tradeType === "spendtype" ? (
                  <StackedBarChart
                    title={"Trade Volumes"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={900}
                    height={275}
                    startMonth={this.props.from}
                    endMonth={this.props.to}
                    colors={colors}
                  />
                ) : (
                  <LineChart
                    title={"Trade Volumes"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={900}
                    height={275}
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
