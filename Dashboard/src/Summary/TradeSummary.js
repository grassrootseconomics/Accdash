import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tile from "../Components/Tile/Tile";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./Summary.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]! ){
  standard:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"standard"){     
    
      tradeVolumes
      {
        total
        start
        end
      }
      transactionCount
      {
        total
        start
        end
      }
    } 
    disbursement:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"disbursement"){     
    
      tradeVolumes
      {
        total
        start
        end
      }
      transactionCount
      {
        total
        start
        end
      }
    } 
    agent_out:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"agent_out"){     
    
      tradeVolumes
      {
        total
        start
        end
      }
      transactionCount
      {
        total
        start
        end
      }
    } 
    reclamation:summaryDataSubtype(fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:"reclamation"){     
    
      tradeVolumes
      {
        total
        start
        end
      }
      transactionCount
      {
        total
        start
        end
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
        <div className="tileTitle">
          <FontAwesomeIcon icon={faChartLine} />
          <p>TRADES</p>
        </div>
        <Query
          query={summary}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender,
            txType: []
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
                    title={"Standard"}
                    value1={data.standard[0].tradeVolumes.total}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.standard[0].tradeVolumes.start,
                        data.standard[0].tradeVolumes.end
                      ),
                      percent: this.percent(
                        data.standard[0].tradeVolumes.start,
                        data.standard[0].tradeVolumes.end
                      )
                    }}
                    value2={data.standard[0].transactionCount.total}
                    units2={"TXs"}
                    trend2={{
                      symbol: this.trend(
                        data.standard[0].transactionCount.start,
                        data.standard[0].transactionCount.end
                      ),
                      percent: this.percent(
                        data.standard[0].transactionCount.start,
                        data.standard[0].transactionCount.end
                      )
                    }}
                    toolTip={
                      "Volume and number of transactions involving the transfer of goods and/or services between users"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-2">
                  <Tile
                    title={"Disbursement"}
                    value1={data.disbursement[0].tradeVolumes.total}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.disbursement[0].tradeVolumes.start,
                        data.disbursement[0].tradeVolumes.end
                      ),
                      percent: this.percent(
                        data.disbursement[0].tradeVolumes.start,
                        data.disbursement[0].tradeVolumes.end
                      )
                    }}
                    value2={data.disbursement[0].transactionCount.total}
                    units2={"TXs"}
                    trend2={{
                      symbol: this.trend(
                        data.disbursement[0].transactionCount.start,
                        data.disbursement[0].transactionCount.end
                      ),
                      percent: this.percent(
                        data.disbursement[0].transactionCount.start,
                        data.disbursement[0].transactionCount.end
                      )
                    }}
                    toolTip={
                      "Volume and number of transactions involving the distribution of tokens from the system to users"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-3">
                  <Tile
                    title={"Agent Out"}
                    value1={data.agent_out[0].tradeVolumes.total}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.agent_out[0].tradeVolumes.start,
                        data.agent_out[0].tradeVolumes.end
                      ),
                      percent: this.percent(
                        data.agent_out[0].tradeVolumes.start,
                        data.agent_out[0].tradeVolumes.end
                      )
                    }}
                    value2={data.agent_out[0].transactionCount.total}
                    units2={"TXs"}
                    trend2={{
                      symbol: this.trend(
                        data.agent_out[0].transactionCount.start,
                        data.agent_out[0].transactionCount.end
                      ),
                      percent: this.percent(
                        data.agent_out[0].transactionCount.start,
                        data.agent_out[0].transactionCount.end
                      )
                    }}
                    toolTip={
                      "Volume and number of transactions involving the exchange of tokens for national currency"
                    }
                  />
                </Col>
                <Col lg={3} className="tile tile-3">
                  <Tile
                    title={"Reclamation"}
                    value1={data.reclamation[0].tradeVolumes.total}
                    units1={"(KES)"}
                    trend1={{
                      symbol: this.trend(
                        data.reclamation[0].tradeVolumes.start,
                        data.reclamation[0].tradeVolumes.end
                      ),
                      percent: this.percent(
                        data.reclamation[0].tradeVolumes.start,
                        data.reclamation[0].tradeVolumes.end
                      )
                    }}
                    value2={data.reclamation[0].transactionCount.total}
                    units2={"TXs"}
                    trend2={{
                      symbol: this.trend(
                        data.reclamation[0].transactionCount.start,
                        data.reclamation[0].transactionCount.end
                      ),
                      percent: this.percent(
                        data.reclamation[0].transactionCount.start,
                        data.reclamation[0].transactionCount.end
                      )
                    }}
                    toolTip={
                      "Volume and number of tokens reclaimed to the system for later disbursement"
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
