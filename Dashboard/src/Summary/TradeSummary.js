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
  standard:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"standard"){     
    
      tradeVolumes
      {
        total
        startMonth
        endMonth
      }
      transactionCount
      {
        total
        startMonth
        endMonth
      }
    } 
    disbursement:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"disbursement"){     
    
      tradeVolumes
      {
        total
        startMonth
        endMonth
      }
      transactionCount
      {
        total
        startMonth
        endMonth
      }
    } 
    agent_out:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"agent_out"){     
    
      tradeVolumes
      {
        total
        startMonth
        endMonth
      }
      transactionCount
      {
        total
        startMonth
        endMonth
      }
    } 
    reclamation:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"reclamation"){     
    
      tradeVolumes
      {
        total
        startMonth
        endMonth
      }
      transactionCount
      {
        total
        startMonth
        endMonth
      }
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
                <Col lg={3} className="tile tile-1">
                  <Tile
                    title={"Standard"}
                    icon={faMoneyBillAlt}
                    value1={format(".2s")(data.standard[0].tradeVolumes.total)}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.standard[0].tradeVolumes.startMonth,
                        data.standard[0].tradeVolumes.endMonth
                      ),
                      percent: this.percent(
                        data.standard[0].tradeVolumes.startMonth,
                        data.standard[0].tradeVolumes.endMonth
                      )
                    }}
                    value2={format(".2s")(
                      data.standard[0].transactionCount.total
                    )}
                    units2={"transactions"}
                    trend2={{
                      symbol: this.trend(
                        data.standard[0].transactionCount.startMonth,
                        data.standard[0].transactionCount.endMonth
                      ),
                      percent: this.percent(
                        data.standard[0].transactionCount.startMonth,
                        data.standard[0].transactionCount.endMonth
                      )
                    }}
                    toolTip={"Volumes of CICs traded"}
                  />
                </Col>
                <Col lg={3} className="tile tile-2">
                  <Tile
                    title={"Disbursement"}
                    icon={faExchangeAlt}
                    value1={format(".2s")(
                      data.disbursement[0].tradeVolumes.total
                    )}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.disbursement[0].tradeVolumes.startMonth,
                        data.disbursement[0].tradeVolumes.endMonth
                      ),
                      percent: this.percent(
                        data.disbursement[0].tradeVolumes.startMonth,
                        data.disbursement[0].tradeVolumes.endMonth
                      )
                    }}
                    value2={format(".2s")(
                      data.disbursement[0].transactionCount.total
                    )}
                    units2={"transactions"}
                    trend2={{
                      symbol: this.trend(
                        data.disbursement[0].transactionCount.startMonth,
                        data.disbursement[0].transactionCount.endMonth
                      ),
                      percent: this.percent(
                        data.disbursement[0].transactionCount.startMonth,
                        data.disbursement[0].transactionCount.endMonth
                      )
                    }}
                    toolTip={"Total no of Transactions"}
                  />
                </Col>
                <Col lg={3} className="tile tile-3">
                  <Tile
                    title={"Agent Out"}
                    icon={faExchangeAlt}
                    value1={format(".2s")(data.agent_out[0].tradeVolumes.total)}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.agent_out[0].tradeVolumes.startMonth,
                        data.agent_out[0].tradeVolumes.endMonth
                      ),
                      percent: this.percent(
                        data.agent_out[0].tradeVolumes.startMonth,
                        data.agent_out[0].tradeVolumes.endMonth
                      )
                    }}
                    value2={format(".2s")(
                      data.agent_out[0].transactionCount.total
                    )}
                    units2={"transactions"}
                    trend2={{
                      symbol: this.trend(
                        data.agent_out[0].transactionCount.startMonth,
                        data.agent_out[0].transactionCount.endMonth
                      ),
                      percent: this.percent(
                        data.agent_out[0].transactionCount.startMonth,
                        data.agent_out[0].transactionCount.endMonth
                      )
                    }}
                    toolTip={"Total no of Transactions"}
                  />
                </Col>
                <Col lg={3} className="tile tile-3">
                  <Tile
                    title={"Reclamation"}
                    icon={faExchangeAlt}
                    value1={format(".2s")(
                      data.reclamation[0].tradeVolumes.total
                    )}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.reclamation[0].tradeVolumes.startMonth,
                        data.reclamation[0].tradeVolumes.endMonth
                      ),
                      percent: this.percent(
                        data.reclamation[0].tradeVolumes.startMonth,
                        data.reclamation[0].tradeVolumes.endMonth
                      )
                    }}
                    value2={format(".2s")(
                      data.reclamation[0].transactionCount.total
                    )}
                    units2={"transactions"}
                    trend2={{
                      symbol: this.trend(
                        data.reclamation[0].transactionCount.startMonth,
                        data.reclamation[0].transactionCount.endMonth
                      ),
                      percent: this.percent(
                        data.reclamation[0].transactionCount.startMonth,
                        data.reclamation[0].transactionCount.endMonth
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
