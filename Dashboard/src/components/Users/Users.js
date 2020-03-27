import React from "react";
import "./Users.scss";

import LineChart from "../LineChart/LineChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const summaryQuery = gql(`
query MonthlySummary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!){
  monthlySummaryData  (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"tradevolumes-time-totalvsfrequent"){ 
    value
  }
}
`);

export default class users extends React.Component {
  render() {
    return (
      <section id="users">
        <p className="title">FREQUENT TRADERS vs TOTAL TRADERS</p>
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
            if (loading) return <p>Loading data...</p>;
            return (
              <LineChart
                title={"Traders vs Frequent Traders"}
                data={data.monthlySummaryData[0].value}
                keys={Object.keys(data.monthlySummaryData[0].value[0]).slice(1)}
                colors={["#66FCF1", "#4472C4"]}
                width={900}
                height={300}
              />
            );
          }}
        </Query>
      </section>
    );
  }
}
