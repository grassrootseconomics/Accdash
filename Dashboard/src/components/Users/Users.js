import React from "react";
import "./Users.scss";
import { Row, Col } from "react-bootstrap";
import SummaryTile from "./../SummaryTile/SummaryTile";
import LineChart from "./../LineChart/LineChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import * as icons from "@fortawesome/free-solid-svg-icons";

const summaryQuery = gql(`
query Summary($year:Int!, $tokenName:[String]!){
  summary (year:$year, month:["January","February"], tokenName:$tokenName){      
   traders
   registeredUsers
   frequentTraders
  }
  monthlysummary (year:$year, tokenName:$tokenName){ 
  activeUsers
  activeVsRegUsers
  }
}
`);

export default class users extends React.Component {
  year = this.props.year;
  currencies = this.props.currencies;

  trend = (current, previous) => {
    return Math.sign(current - previous) === -1
      ? icons.faAngleDoubleDown
      : icons.faAngleDoubleUp;
  };

  render() {
    return (
      <div id="users">
        <Query
          query={summaryQuery}
          variables={{
            year: this.props.year,
            tokenName: this.props.currencies
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading data...</p>;

            return (
              <div className="mt-3">
                <Row className="mt-4">
                  <Col xs={2}>
                    <div className="mt-2 tile-1">
                      <SummaryTile
                        title={"Total Traders"}
                        // subTitle={"Current Month"}
                        value={
                          4253
                          // data.summary[0].activeUsers[1].value
                        }
                        month={"February"}
                        // month={data.summary[0].activeUsers[1].month}
                        icon={icons.faUserCog}
                        trend={this.trend(
                          256,
                          453
                          // data.summary[0].activeUsers[1].value,
                          // data.summary[0].activeUsers[0].value
                        )}
                        toolTip={
                          "No of users with at least 4 transactions in a month"
                        }
                      />
                    </div>
                  </Col>
                  <Col xs={2}>
                    <div className="mt-2 tile-2">
                      <SummaryTile
                        title={"Frequent Traders"}
                        // subTitle={"Current Month"}
                        value={
                          78234
                          // data.summary[0].activeUsers[1].value
                        }
                        month={"February"}
                        // month={data.summary[0].activeUsers[1].month}
                        icon={icons.faUserCog}
                        trend={this.trend(
                          78554,
                          3453
                          // data.summary[0].activeUsers[1].value,
                          // data.summary[0].activeUsers[0].value
                        )}
                        toolTip={
                          "No of users with at least 4 transactions in a month"
                        }
                      />
                    </div>
                  </Col>
                  <Col xs={2}>
                    <div className="mt-2 tile-3">
                      <SummaryTile
                        title={"Registered Traders"}
                        // subTitle={"Current Month"}
                        value={
                          2342
                          // data.summary[0].registeredUsers[1].value
                        }
                        month={"February"}
                        // month={data.summary[0].registeredUsers[1].month}
                        icon={icons.faUserTag}
                        trend={this.trend(
                          232,
                          789
                          // data.summary[0].registeredUsers[1].value,
                          // data.summary[0].registeredUsers[0].value
                        )}
                        toolTip={"No of new Registered users"}
                      />
                    </div>
                  </Col>
                  {/* <Col xs={4}>
                    <img
                      src={Pie}
                      alt="Pie"
                      height="400"
                      width="600"
                      className="mt-5 ml-4"
                    />
                  </Col> */}
                  <Col xs={6}>
                    {/* <div className="mt-2">
                      <StackedBarChart
                        title={"Active Users"}
                        data={data.monthlysummary[0].activeUsers}
                        keys={this.props.currencies}
                        colors={[
                          "#90e4cb",
                          "#58d7b1",
                          "#20c997",
                          "#189771",
                          "#10654c",
                          "#083226",
                          "#051e17"
                        ]}
                      />
                    </div> */}
                    <div className="mt-2">
                      <LineChart
                        title={"Registered vs Active Users"}
                        data={data.monthlysummary[0].activeVsRegUsers}
                        keys={["Active", "Registered"]}
                        colors={["#20c997", "#80bdff  "]}
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
