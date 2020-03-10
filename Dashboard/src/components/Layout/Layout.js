import React from "react";

import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Backdrop from "../../Backdrop/Backdrop";

export default class Layout extends React.Component {
  state = {
    showSidebar: false
  };

  getYearsCallback = selectedOption => {
    console.log("!!!!!2345!!!", selectedOption);
    this.props.yearsCallback(selectedOption);
  };

  getCurrenciesCallback = selectedOptions => {
    console.log("$$$$7895$$$", selectedOptions);
    this.props.currenciesCallback(selectedOptions);
  };

  sidebarCloseHandler = () => {
    this.setState({ showSidebar: false });
  };
  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };
  render() {
    return (
      <div>
        <Backdrop
          show={this.state.showSidebar}
          clicked={this.sidebarCloseHandler}
        />
        <Header toggleFilters={this.toggleSidebar} />
        {/* <Sidebar
          open={this.state.showSidebar}
          close={this.sidebarCloseHandler}
          yearsDropdown={this.getYearsCallback}
          currenciesDropdown={this.getCurrenciesCallback}
        /> */}
      </div>
    );
  }
}
