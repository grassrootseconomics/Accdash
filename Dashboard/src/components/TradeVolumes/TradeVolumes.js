import React from "react";

import StackedBarChart from "../StackedBarChart/StackedBarChart";
import PieChart from "../PieChart/PieChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import "./TradeVolumes.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $buisinessTypes:[String]!, $gender:[String!]){
   monthlysummary (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$buisinessTypes, gender:$gender){ 
    tradeVolumesSpendType
  }
  spendtypesummary(
    fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$buisinessTypes, gender:$gender
    ){
      label
      value
    }
}
`);

export default class TradeVolumes extends React.Component {
  render() {
    return (
      <section id="tradeVolumes">
        <p className="title">Trade Volumes</p>
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
              <div id="charts">
                <div id="bar">
                  <StackedBarChart
                    title={"Trade Volumes"}
                    data={data.monthlysummary[0].tradeVolumesSpendType}
                    keys={Object.keys(
                      data.monthlysummary[0].tradeVolumesSpendType[0]
                    ).slice(1)}
                    colors={this.colors}
                  />
                </div>
                <div id="pie">
                  <PieChart
                    title={"Trade Volumes Pie"}
                    keys={this.props.buisinessTypes}
                    colors={this.color}
                    data={data.spendtypesummary}
                  />
                </div>
              </div>
            );
          }}
        </Query>
      </section>
    );
  }
}
