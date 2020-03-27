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
// import { format } from "d3";
import "./Summary.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]! ){
  registeredUsers:summaryData  (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"registeredusers"){         
    total
    startMonth
    endMonth
  }
  traders:summaryData  (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"traders"){         
    total
    startMonth
    endMonth
  }
  frequentTraders:summaryData  (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"frequenttraders"){         
    total
    startMonth
    endMonth
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
                {/* <div className="tileTitle">
                  <p>USERS</p>
                </div> */}
                <Col lg={4} className="tile tile-1">
                  <Tile
                    title={"Registered Users"}
                    value={data.registeredUsers[0].total}
                    icon={faUsers}
                    trend={{
                      symbol: this.trend(
                        data.registeredUsers[0].startMonth,
                        data.registeredUsers[0].endMonth
                      ),
                      percent: this.percent(
                        data.registeredUsers[0].startMonth,
                        data.registeredUsers[0].endMonth
                      )
                    }}
                    toolTip={"No of Registered users"}
                  />
                </Col>
                <Col lg={4} className="tile tile-2 ">
                  <Tile
                    title={"Total Traders"}
                    value={data.traders[0].total}
                    icon={faUserTag}
                    trend={{
                      symbol: this.trend(
                        data.traders[0].startMonth,
                        data.traders[0].endMonth
                      ),
                      percent: this.percent(
                        data.traders[0].startMonth,
                        data.traders[0].endMonth
                      )
                    }}
                    toolTip={
                      "No of traders with at least 1 transaction in a month"
                    }
                  />
                </Col>
                <Col lg={4} className="tile tile-3 ">
                  <Tile
                    title={"Frequent Traders"}
                    value={data.frequentTraders[0].total}
                    icon={faUserCog}
                    trend={{
                      symbol: this.trend(
                        data.frequentTraders[0].startMonth,
                        data.frequentTraders[0].endMonth
                      ),
                      percent: this.percent(
                        data.frequentTraders[0].startMonth,
                        data.frequentTraders[0].endMonth
                      )
                    }}
                    toolTip={
                      "No of traders with over 4 trades on average in a month"
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
