import React from "react";
import { Row, Col } from "react-bootstrap";
import SummaryTile from "../SummaryTile/SummaryTile";
import StackedBarChart from "../StackedBarChart/StackedBarChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faMoneyBillAlt
} from "@fortawesome/free-solid-svg-icons";
import "./Transactions.scss";
import { format } from "d3";
import Pie from "./../../resources/TradeVolumes_pie.JPG";

const summary = gql(`
query Summary($year:String!, $currencies:[String]!){
  summary (year:$year, month:["January","February"], tokenName:$currencies){      
    transactions      
  }
  monthlysummary (year:$year, tokenName:$currencies){ 
    transactions
  }
}
`);

export default class Transactions extends React.Component {
  trend = (current, previous) => {
    const symbol =
      Math.sign(current - previous) === -1
        ? faAngleDoubleDown
        : faAngleDoubleUp;

    return symbol;
  };

  render() {
    return (
      <div id="Transactions">
        <Query
          query={summary}
          variables={{
            year: this.props.year,
            currencies: this.props.currencies
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading data...</p>;
            return (
              <div>
                {/* <h4 className="text-center title">Trade Volumes</h4> */}
                <Row className="mt-2">
                  <Col xs={2}>
                    <div className="mt-1">
                      <SummaryTile
                        title={"Total Trade Volume"}
                        // subTitle={"Current Month"}
                        value={format(".2s")(
                          data.summary[0].transactions[1].value
                        )}
                        month={data.summary[0].transactions[1].month}
                        icon={faMoneyBillAlt}
                        trend={this.trend(
                          data.summary[0].transactions[1].value,
                          data.summary[0].transactions[0].value
                        )}
                        toolTip={"Volumes of CICs traded"}
                      />
                    </div>
                  </Col>
                  <Col xs={4}>
                    <img
                      src={Pie}
                      alt="Pie"
                      height="250"
                      width="400"
                      className="ml-5"
                    />
                  </Col>
                  <Col xs={6}>
                    <div className="mt-1">
                      <StackedBarChart
                        title={"Trade Volumes"}
                        data={data.monthlysummary[0].transactions}
                        keys={this.props.currencies}
                        colors={[
                          "#8bd1dc",
                          "#51b9ca",
                          "#17a2b8",
                          "#117a8a",
                          "#0c515c",
                          "#06292e",
                          "#03181c"
                        ]}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
