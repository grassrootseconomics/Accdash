import React from "react";
import "./Sidebar.scss";
import Dropdown from "./../../Dropdown/Dropdown";
import MultiselectDropdown from "./../../MultiselectDropdown/MultiselectDropdown";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const filters = gql(`
  query{
    cicfilters{
      yearsList
      cicList      
    }
  }
`);

export default class Sidebar extends React.Component {
  getDropdown = selectedOption => {
    console.log("!!!!!!!!", selectedOption);
    this.props.yearsDropdown(selectedOption);
  };

  getMultiDropdown = selectedOptions => {
    console.log("$$$$$$$", selectedOptions);
    this.props.currenciesDropdown(selectedOptions);
  };

  render() {
    return (
      <section id="sidebar" className={this.props.open ? "open" : "close"}>
        <div className="sidebar-header">
          <h3 className="text-center">Filters</h3>
          <Query query={filters}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading data...</p>;
              return (
                <div>
                  <Dropdown
                    options={data.cicfilters[0].yearsList}
                    callback={this.getDropdown}
                  />
                  <MultiselectDropdown
                    options={data.cicfilters[0].cicList}
                    callback={this.getMultiDropdown}
                  />
                </div>
              );
            }}
          </Query>
        </div>
      </section>
    );
  }
}
