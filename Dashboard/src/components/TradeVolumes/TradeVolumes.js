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
            return loading ? (
              <p>Loading data...</p>
            ) : this.props.tradeType === "spendtype" ? (
              <StackedBarChart
                title={"Trade Volumes"}
                data={data.monthlySummaryData[0].value}
                keys={Object.keys(data.monthlySummaryData[0].value[0]).slice(1)}
                width={900}
                height={325}
              />
            ) : (
              <LineChart
                title={"Trade Volumes"}
                data={data.monthlySummaryData[0].value}
                keys={Object.keys(data.monthlySummaryData[0].value[0]).slice(1)}
                width={900}
                height={325}
              />
            );
          }}
        </Query>
      </section>
    );
  }
}
