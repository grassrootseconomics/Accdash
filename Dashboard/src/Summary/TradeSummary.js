import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faMoneyBillAlt,
  faExchangeAlt
} from "@fortawesome/free-solid-svg-icons";
import Tile from "../Components/Tile/Tile";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { format } from "d3";
import "./Summary.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]! ){
  tradeVolumes:summaryData (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"tradevolumes"){     
    total
    startMonth
    endMonth   
  }
  noTransactions:summaryData (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"transactioncount"){     
    total
    startMonth
    endMonth    
  }  
}
`);

export default class TradeSummary extends React.Component {
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
      <section id="tradeSummary">
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
                  <p>TRADES</p>
                </div> */}
                <Col lg={4} className="tile tile-1">
                  <Tile
                    title={"Standard Trades"}
                    value={format(".2s")(data.tradeVolumes[0].total)}
                    icon={faMoneyBillAlt}
                    trend={{
                      symbol: this.trend(
                        data.tradeVolumes[0].startMonth,
                        data.tradeVolumes.endMonth
                      ),
                      percent: this.percent(
                        data.tradeVolumes[0].startMonth,
                        data.tradeVolumes[0].endMonth
                      )
                    }}
                    toolTip={"Volumes of CICs traded"}
                  />
                </Col>
                <Col lg={4} className="tile tile-2">
                  <Tile
                    title={"Disbursement"}
                    value={format(".2s")(data.noTransactions[0].total)}
                    icon={faExchangeAlt}
                    trend={{
                      symbol: this.trend(
                        data.noTransactions[0].startMonth,
                        data.noTransactions[0].endMonth
                      ),
                      percent: this.percent(
                        data.noTransactions[0].startMonth,
                        data.noTransactions[0].endMonth
                      )
                    }}
                    toolTip={"Total no of Transactions"}
                  />
                </Col>
                <Col lg={4} className="tile tile-3">
                  <Tile
                    title={"Agent Out"}
                    value={format(".2s")(data.noTransactions[0].total)}
                    icon={faExchangeAlt}
                    trend={{
                      symbol: this.trend(
                        data.noTransactions[0].startMonth,
                        data.noTransactions[0].endMonth
                      ),
                      percent: this.percent(
                        data.noTransactions[0].startMonth,
                        data.noTransactions[0].endMonth
                      )
                    }}
                    toolTip={"Total no of Transactions"}
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
