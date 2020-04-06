import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Table from "../Table/Table";
import { format } from "d3";
import "./Traders.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!){  
    summaryDataTopTraders (fromDate:$from, toDate:$to,  tokenName:$tokens, businessType:$spendTypes, gender:$gender){
     
      value
    }
}
`);

export default class Traders extends React.Component {
  render() {
    return (
      <section id="topTraders">
        <p className="title">TOP TRADERS</p>
        <Query
          query={summary}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Loading data...</p>;
            } else if (error) {
              return <p>API returned an error Please try again</p>;
            } else {
              const chartData = data.summaryDataTopTraders[0].value;
              if (chartData.length > 0) {
                let tableData = data.summaryDataTopTraders[0].value.map(
                  (d, i) => ({
                    ...d,
                    Volume: format(".2s")(d.volume),
                    TXs: format(".2s")(d.count),
                    BusinessType: d.s_business_type,
                    Gender: d.s_gender,
                    url: `https://blockscout.com/poa/xdai/address/${d.source}/transactions`,
                    No: i + 1
                  })
                );
                return (
                  <Table
                    title={"Top Traders"}
                    keys={["No", "BusinessType", "Gender", "Volume", "TXs"]}
                    data={tableData}
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
