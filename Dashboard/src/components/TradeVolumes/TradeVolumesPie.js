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
            if (loading) return <p>Loading data...</p>;

            return (
              <PieChart
                title={"Trade Volumes Pie"}
                keys={this.props.spendTypes}
                data={data.categorySummary}
                width={300}
                height={300}
                colors={["#3b5998", "#8b9dc3", "#536878", "#4279a3"]}
              />
            );
          }}
        </Query>
      </section>
    );
  }
}
