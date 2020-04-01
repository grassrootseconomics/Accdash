import React from "react";
import PieChart from "../PieChart/PieChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import "./TradeVolumesPie.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!){  
  categorySummary (
    fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"tradevolumes-category-gender"
    ){
      label
      value
    }
}
`);

export default class TradeVolumesPie extends React.Component {
  render() {
    return (
      <section id="tradeVolumesPie">
        <p className="title">TRADE VOLUMES BY GENDER</p>
        <Query
          query={summary}
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
              const chartData = data.categorySummary;
              if (chartData.length > 0) {
                return (
                  <PieChart
                    title={"Trade Volumes Pie"}
                    data={chartData}
                    width={300}
                    height={300}
                    colors={["#3b5998", "#8b9dc3", "#536878", "#4279a3"]}
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
