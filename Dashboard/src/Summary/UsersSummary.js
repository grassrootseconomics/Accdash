import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faUserTag,
  faUserCog,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import Tile from "../Components/Tile/Tile";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { format } from "d3";
import "./Summary.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]! ){
    registeredUsers:summaryData  (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"registeredusers"){         
      total
      start
      end
    }
    traders:summaryData  (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"traders"){         
      total
      start
      end
    }
    frequentTraders:summaryData  (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"frequenttraders"){         
      total
      start
      end
    }  
    summaryDataBalance (gender:$gender)
    {
      value
    }
  }
`);

export default class UsersSummary extends React.Component {
  trend = (previous, current) => {
    const symbol =
      Math.sign(current - previous) === -1
        ? faAngleDoubleDown
        : faAngleDoubleUp;

    return symbol;
  };

  percent = (previous, current) => {
    return previous !== 0
      ? Math.abs(Math.round(((current - previous) / previous) * 100))
      : current;
  };

  render() {
    return (
      <section id="usersSummary">
        <div className="tileTitle">
          <p>USERS</p>
        </div>
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
            if (loading) {
              return <p>Loading data...</p>;
            } else if (error) {
              return <p>Section will be loaded shortly</p>;
            }
            return (
              <Row id="tiles">
                <Col lg={3} className="tile tile-1">
                  <Tile
                    title={"Registered Users"}
                    value1={format(".2s")(data.registeredUsers[0].total)}
                    icon={faUsers}
                    trend1={{
                      symbol: this.trend(
                        data.registeredUsers[0].start,
                        data.registeredUsers[0].end
                      ),
                      percent: this.percent(
                        data.registeredUsers[0].start,
                        data.registeredUsers[0].end
                      )
                    }}
                    toolTip={
                      "Total number of registered users from the start of the program to the max date selected"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-2 ">
                  <Tile
                    title={"Total Traders"}
                    value1={format(".2s")(data.traders[0].total)}
                    icon={faUserTag}
                    trend1={{
                      symbol: this.trend(
                        data.traders[0].start,
                        data.traders[0].end
                      ),
                      percent: this.percent(
                        data.traders[0].start,
                        data.traders[0].end
                      )
                    }}
                    toolTip={
                      "Total number of users who have traded at least once in the time frame"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-3 ">
                  <Tile
                    title={"Frequent Traders"}
                    value1={format(".2s")(data.frequentTraders[0].total)}
                    icon={faUserCog}
                    trend1={{
                      symbol: this.trend(
                        data.frequentTraders[0].start,
                        data.frequentTraders[0].end
                      ),
                      percent: this.percent(
                        data.frequentTraders[0].start,
                        data.frequentTraders[0].end
                      )
                    }}
                    toolTip={
                      "Total number of users who have traded 4 times or more on average per month"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-3 ">
                  <Tile
                    title={"Balances"}
                    value1={format(".2s")(
                      data.summaryDataBalance[0].value[0].total
                    )}
                    units1={"(total)"}
                    icon={faUserCog}
                    value2={format(".2s")(
                      data.summaryDataBalance[0].value[0].circulation
                    )}
                    units2={"(in circulation)"}
                    toolTip={
                      "Total balance available & Total balance in circulation "
                    }
                  />
                </Col>
              </Row>
            );
          }}
        </Query>
      </section>
    );
  }
}
