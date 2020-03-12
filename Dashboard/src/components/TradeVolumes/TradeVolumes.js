import React from "react";

import StackedBarChart from "../StackedBarChart/StackedBarChart";
import PieChart from "../PieChat/PieChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import "./TradeVolumes.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $buisinessTypes:[String]!){
   monthlysummary (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$buisinessTypes, gender:[]){ 
    tradeVolumesSpendType
  }
}
`);

export default class TradeVolumes extends React.Component {
  colors = [
    "#000a0a",
    "#001e1e",
    "#003232",
    "#004545",
    "#005959",
    "#006c6c",
    "#008080",
    "#009494",
    "#00a7a7",
    "#00bbbb",
    "#00cece",
    "#00e2e2",
    "#00f6f6",
    "#3b4545",
    "#364a4a",
    "#314f4f",
    "#2c5454",
    "#196767",
    "#146c6c",
    "#0a7676"
  ];
  data = [
    {
      month: "January",
      Education: 7956.0,
      Energy: 2253.0,
      Environment: 56.0,
      Food: 37303.0,
      "General shop": 11093.0,
      Health: 232.0,
      Labour: 23301.0,
      Other: 77137.0,
      "Savings Group": 0.0,
      Transport: 1153.0,
      Water: 10037.0
    },
    {
      month: "February",
      Education: 37596.0,
      Energy: 7617.0,
      Environment: 1045.0,
      Food: 68754.0,
      "General shop": 31378.0,
      Health: 130.0,
      Labour: 33328.0,
      Other: 412288.0,
      Transport: 2047.0,
      Water: 10035.0
    },
    {
      month: "March",
      Education: 95753.0,
      Energy: 62781.0,
      Environment: 6584.0,
      Food: 372228.0,
      "General shop": 53104.0,
      Health: 1703.0,
      Labour: 97509.0,
      Other: 654530.0,
      Transport: 12555.0,
      Water: 49261.0
    },
    {
      month: "April",
      Education: 84862.0,
      Energy: 58574.0,
      Environment: 2698.0,
      Food: 308927.0,
      "General shop": 79448.0,
      Health: 996.0,
      Labour: 137307.0,
      Other: 648638.0,
      Transport: 35872.0,
      Water: 27622.0
    },
    {
      month: "May",
      Education: 330880.0,
      Energy: 36680.0,
      Environment: 2123.0,
      Food: 235692.0,
      "General shop": 65436.0,
      Health: 2335.0,
      Labour: 184471.0,
      Other: 664300.0,
      Transport: 34646.0,
      Water: 16704.0
    },
    {
      month: "June",
      Education: 35936.0,
      Energy: 18404.0,
      Environment: 655.0,
      Food: 150337.0,
      "General shop": 66223.0,
      Health: 3814.0,
      Labour: 202001.0,
      Other: 973838.0,
      Transport: 34444.0,
      Water: 8010.0
    },
    {
      month: "July",
      Education: 117737.0,
      Energy: 54442.0,
      Environment: 3390.0,
      Food: 458968.0,
      "General shop": 270638.0,
      Health: 18036.0,
      Labour: 796355.0,
      Other: 959306.0,
      Transport: 123481.0,
      Water: 19179.0
    },
    {
      month: "August",
      Education: 65393.0,
      Energy: 31500.0,
      Environment: 1288.0,
      Food: 262953.0,
      "General shop": 330991.0,
      Health: 2105.0,
      Labour: 952641.0,
      Other: 742580.0,
      Transport: 105679.0,
      Water: 32584.0
    },
    {
      month: "September",
      Education: 49706.0,
      Energy: 50775.0,
      Environment: 3435.0,
      Food: 356559.0,
      "General shop": 186805.0,
      Health: 8530.0,
      Labour: 608539.0,
      Other: 468161.0,
      Transport: 86747.0,
      Water: 28050.0
    },
    {
      month: "October",
      Education: 40139.0,
      Energy: 133738.0,
      Environment: 153.0,
      Food: 325107.0,
      "General shop": 367379.0,
      Health: 5402.0,
      Labour: 947014.0,
      Other: 989955.0,
      Transport: 58559.0,
      Water: 42575.0
    },
    {
      month: "November",
      Education: 31713.0,
      Energy: 70751.0,
      Environment: 8577.0,
      Food: 575939.0,
      "General shop": 597422.0,
      Health: 15314.0,
      Labour: 1411615.0,
      Other: 1311641.0,
      Transport: 137466.0,
      Water: 64754.0
    },
    {
      month: "December",
      Education: 20326.0,
      Energy: 130387.0,
      Environment: 7577.0,
      Food: 417689.0,
      "General shop": 513231.0,
      Health: 875.0,
      Labour: 1239144.0,
      Other: 689176.0,
      Transport: 74699.0,
      Water: 21473.0
    }
  ];

  render() {
    return (
      <section id="tradeVolumes">
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
                <div className="pie">
                  <PieChart
                    title={"Trade Volumes Pie"}
                    keys={this.props.buisinessTypes}
                    colors={this.color}
                  />
                </div>
                <div className="bar mt-3">
                  <StackedBarChart
                    title={"Trade Volumes"}
                    data={data.monthlysummary[0].tradeVolumesSpendType}
                    // data={this.data}
                    keys={Object.keys(
                      data.monthlysummary[0].tradeVolumesSpendType[0]
                    ).slice(1)}
                    colors={this.colors}
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
