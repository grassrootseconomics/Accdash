import React from "react";
import "./Users.scss";

import LineChart from "../LineChart/LineChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const summaryQuery = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $buisinessTypes:[String]!){ 
  monthlysummary (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$buisinessTypes, gender:[]){ 
    TradersVsFqtrader
  }
}
`);

export default class users extends React.Component {
  render() {
    return (
      <section id="users">
        <p className="title">Frequent Traders vs Total Traders</p>
        <Query
          query={summaryQuery}
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
              <LineChart
                title={"Traders vs Frequent Traders"}
                data={data.monthlysummary[0].TradersVsFqtrader}
                keys={["Frequent Traders", "Traders"]}
                colors={["#20c997", "#80bdff  "]}
              />
            );
          }}
        </Query>
      </section>
    );
  }
}
