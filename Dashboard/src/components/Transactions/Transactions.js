import React from "react";

import StackedBarChart from "../StackedBarChart/StackedBarChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import "./Transactions.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $buisinessTypes:[String]!){ 
  monthlysummary (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$buisinessTypes, gender:[]){ 
    noTransactionsSpendType
  }
}
`);

export default class Transactions extends React.Component {
  // colors = [
  //   "#01090a",
  //   "#03181c",
  //   "#06292e",
  //   "#05272e",
  //   "#07363f",
  //   "#094651",
  //   "#0b5563",
  //   "#0c6475",
  //   "#0e7386",
  //   "#108298",
  //   "#1291aa",
  //   "#14a1bb",
  //   "#16b0cd",
  //   "#18bfdf",
  //   "#35cce9",
  //   "#46d1eb",
  //   "#58d5ed",
  //   "#6adaef",
  //   "#7cdef1",
  //   "#8de3f3"
  // ];
  colors = [
    "#00000a",
    "#00001e",
    "#000032",
    "#000045",
    "#000059",
    "#00006c",
    "#000080",
    "#000094",
    "#0000a7",
    "#0000bb",
    "#0000ce",
    "#0000e2",
    "#0000f6",
    "#1e1eff",
    "#3232ff",
    "#4545ff",
    "#5959ff",
    "#6c6cff",
    "#8080ff",
    "#9494ff"
  ];
  render() {
    return (
      <section id="transactions">
        <Query
          query={summary}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            buisinessTypes: this.props.buisinessTypes
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading data...</p>;
            return (
              <div className="mt-3">
                <StackedBarChart
                  title={"Transactions"}
                  data={data.monthlysummary[0].noTransactionsSpendType}
                  keys={Object.keys(
                    data.monthlysummary[0].noTransactionsSpendType[0]
                  ).slice(1)}
                  colors={this.colors}
                />
              </div>
            );
          }}
        </Query>
      </section>
    );
  }
}
