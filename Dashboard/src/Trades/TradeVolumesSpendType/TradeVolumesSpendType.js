import React from "react";
import HBarChart from "../../Components/HBarChart/HBarChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import "./TradeVolumesSpendType.scss";

export const summaryQuery = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!){  
  categorySummary (
    fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"tradevolumes-category-spendtype"
    ){
      label
      value
    }
}
`);

export default class TradeVolumesSpendType extends React.Component {
  render() {
    return (
      <section id="tradeVolumesSpendType">
        <p className="title">TRADE VOLUMES BY SPEND TYPE</p>
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
              return <p data-testid="loading">Loading data...</p>;
            } else if (error) {
              return (
                <p data-testid="apiError">
                  API returned an error Please try again
                </p>
              );
            } else {
              const chartData = data.categorySummary;
              if (chartData.length > 0) {
                return (
                  <HBarChart
                    title={"Trade Volumes Bar"}
                    keys={this.props.spendTypes}
                    data={data.categorySummary}
                    width={250}
                    height={250}
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
