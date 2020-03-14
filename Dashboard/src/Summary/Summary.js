import React from "react";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faMoneyBillAlt,
  faUserTag,
  faExchangeAlt,
  faUserCog
} from "@fortawesome/free-solid-svg-icons";
import Tile from "../Components/Tile/Tile";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { format } from "d3";
import "./Summary.scss";

const summary = gql(`
query Summary($from:String!, $to:String!, $tokens:[String]!, $buisinessTypes:[String]!){
  summary (fromDate:$from, toDate:$to, tokenName:$tokens, spendType:$buisinessTypes, gender:[]){     
    tradeVolumes
    registeredUsers
    traders
    frequentTraders
    noTransactions      
  }
  
}
`);

export default class Summary extends React.Component {
  trend = (previous, current) => {
    const symbol =
      Math.sign(current - previous) === -1
        ? faAngleDoubleDown
        : faAngleDoubleUp;

    return symbol;
  };

  percent = (previous, current) =>
    Math.abs(Math.round(((current - previous) / previous) * 100));

  render() {
    return (
      <section id="summary">
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
              <div id="tiles">
                <div className="tile tile-1">
                  <Tile
                    title={"Registered Users"}
                    // subTitle={"Current Month"}
                    value={data.summary[0].registeredUsers.total}
                    month={"February"}
                    // month={data.summary[0].registeredUsers[1].month}
                    icon={faUserTag}
                    trend={{
                      symbol: this.trend(
                        data.summary[0].registeredUsers.start_month,
                        data.summary[0].registeredUsers.end_month
                      ),
                      percent: this.percent(
                        data.summary[0].registeredUsers.start_month,
                        data.summary[0].registeredUsers.end_month
                      )
                    }}
                    toolTip={"No of new Registered users"}
                  />
                </div>
                <div className="tile tile-2 ">
                  <Tile
                    title={"Total Traders"}
                    // subTitle={"Current Month"}
                    value={data.summary[0].traders.total}
                    month={"February"}
                    // month={data.summary[0].activeUsers[1].month}
                    icon={faUserCog}
                    trend={{
                      symbol: this.trend(
                        data.summary[0].traders.start_month,
                        data.summary[0].traders.end_month
                      ),
                      percent: this.percent(
                        data.summary[0].traders.start_month,
                        data.summary[0].traders.end_month
                      )
                    }}
                    toolTip={
                      "No of users with at least 4 transactions in a month"
                    }
                  />
                </div>
                <div className="tile tile-3 ">
                  <Tile
                    title={"Frequent Traders"}
                    // subTitle={"Current Month"}
                    value={data.summary[0].frequentTraders.total}
                    month={"February"}
                    // month={data.summary[0].activeUsers[1].month}
                    icon={faUserCog}
                    trend={{
                      symbol: this.trend(
                        data.summary[0].frequentTraders.start_month,
                        data.summary[0].frequentTraders.end_month
                      ),
                      percent: this.percent(
                        data.summary[0].frequentTraders.start_month,
                        data.summary[0].frequentTraders.end_month
                      )
                    }}
                    toolTip={
                      "No of users with at least 4 transactions in a month"
                    }
                  />
                </div>
                <div className="tile tile-4 ">
                  <Tile
                    title={"Total Trade Volume"}
                    // subTitle={"Current Month"}
                    value={format(".2s")(data.summary[0].tradeVolumes.total)}
                    month={"February"}
                    // month={data.summary[0].tradeVolumes[1].month}
                    icon={faMoneyBillAlt}
                    trend={{
                      symbol: this.trend(
                        data.summary[0].tradeVolumes.start_month,
                        data.summary[0].tradeVolumes.end_month
                      ),
                      percent: this.percent(
                        data.summary[0].tradeVolumes.start_month,
                        data.summary[0].tradeVolumes.end_month
                      )
                    }}
                    toolTip={"Volumes of CICs traded"}
                  />
                </div>
                <div className="tile tile-5 ">
                  <Tile
                    title={"Total Transactions"}
                    // subTitle={"Current Month"}
                    value={format(".2s")(data.summary[0].noTransactions.total)}
                    month={"February"}
                    icon={faExchangeAlt}
                    trend={{
                      symbol: this.trend(
                        data.summary[0].noTransactions.start_month,
                        data.summary[0].noTransactions.end_month
                      ),
                      percent: this.percent(
                        data.summary[0].noTransactions.start_month,
                        data.summary[0].noTransactions.end_month
                      )
                    }}
                    toolTip={"Total no of Transactions"}
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
