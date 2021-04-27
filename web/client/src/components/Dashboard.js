import React from 'react';
// import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./NavigationBar";
import Top from "./Top";
import Middle from "./Middle";
import Bottom from "./Bottom";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

  }

  // React function that is called when the page load.
  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        <NavigationBar />
        <Top />
        <Middle />
        <Bottom />
      </div>
    )
  }
}
