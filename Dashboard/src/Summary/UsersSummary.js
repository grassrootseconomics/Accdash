import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    newRegisteredUsers: summaryData (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"newregisteredusers")
  {
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
          <FontAwesomeIcon icon={faUsers} />
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
            const sameMonth = this.props.from === this.props.to ? true : false;

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
                    units1={"(total)"}
                    value2={format(".2s")(data.newRegisteredUsers[0].total)}
                    units2={"(new)"}
                    trend2={{
                      symbol: this.trend(
                        data.newRegisteredUsers[0].start,
                        data.newRegisteredUsers[0].end
                      ),
                      percent: this.percent(
                        data.newRegisteredUsers[0].start,
                        data.newRegisteredUsers[0].end
                      )
                    }}
                    toolTip={
                      "Total number of registered users from the start of the program to the max date selected"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-2 ">
                  <Tile
                    title={"Traders"}
                    value1={format(".2s")(data.traders[0].total)}
                    units1={"(total)"}
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
                    value2={format(".2s")(data.frequentTraders[0].total)}
                    units2={"(frequent)"}
                    trend2={{
                      symbol: this.trend(
                        data.frequentTraders[0].start,
                        data.frequentTraders[0].end
                      ),
                      percent: sameMonth
                        ? "NA"
                        : this.percent(
                            data.frequentTraders[0].start,
                            data.frequentTraders[0].end
                          )
                    }}
                    toolTip={
                      "Total number of users who have traded at least once in the time frame &  Frequent - Total number of users who have traded 4 times or more on average per month"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-3 ">
                  <Tile
                    title={"Supply & Reserve"}
                    value1={format(".2s")(data.frequentTraders[0].total)}
                    trend1={{
                      symbol: this.trend(
                        data.frequentTraders[0].start,
                        data.frequentTraders[0].end
                      ),
                      percent: sameMonth
                        ? "NA"
                        : this.percent(
                            data.frequentTraders[0].start,
                            data.frequentTraders[0].end
                          )
                    }}
                    // toolTip={}
                  />
                </Col>
                <Col lg={3} className="tile tile-3 ">
                  <Tile
                    title={"Balances"}
                    value1={format(".2s")(
                      data.summaryDataBalance[0].value[0].circulation
                    )}
                    units1={"(in circulation)"}
                    toolTip={"Total balance in circulation"}
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
