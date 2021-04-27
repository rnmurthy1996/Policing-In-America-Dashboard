import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Budget from "./Budget";
import FirearmPurchases from "./FirearmPurchases/FirearmPurchases";
import PoliceViolence from "./PoliceViolence";
// import Recommendations from './Recommendations';
// import BestGenres from './BestGenres';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/police_violence"
							render={() => (
								<PoliceViolence />
							)}
						/>
						<Route
							path="/firearm_purchases"
							render={() => (
								<FirearmPurchases />
							)}
						/>
						<Route
							path="/budget"
							render={() => (
								<Budget />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}