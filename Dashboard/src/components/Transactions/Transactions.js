import React from "react";

import StackedBarChart from "../StackedBarChart/StackedBarChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import "./Transactions.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $buisinessTypes:[String]!, $gender:[String!]){
  monthlysummary (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$buisinessTypes, gender:$gender){ 
    noTransactionsSpendType
  }
}
`);

export default class Transactions extends React.Component {
  render() {
    return (
      <section id="transactions">
        <p className="title">Transactions</p>
        <Query
          query={summary}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            buisinessTypes: this.props.buisinessTypes,
            gender: this.props.gender
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading data...</p>;
            return (
              <StackedBarChart
                title={"Transactions"}
                data={data.monthlysummary[0].noTransactionsSpendType}
                keys={Object.keys(
                  data.monthlysummary[0].noTransactionsSpendType[0]
                ).slice(1)}
                colors={this.colors}
              />
            );
          }}
        </Query>
      </section>
    );
  }
}
