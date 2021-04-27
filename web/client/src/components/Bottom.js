import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class Bottom extends React.Component {
	constructor(props) {
		super(props);
	}

	/* ---- Q1b (Dashboard) ---- */
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
<section id="colors" class="bg-white py-5 d-flex flex-column justify-content-center h-100">
    <div class="container">
        <h4>About</h4>
        <p class="lead">This application takes a closer look at police related deaths across America, as well as potentially related data sets including firearm purchases and budget allocations at the state and county level. Users will be able to get detailed statistics on police violence cases in the recent decade, filtering by state, county, race of the victim, and other fields. Articles detailing these incidents will also be made available to the user, providing information at both an aggregated state-by-state level and also on a case-by-case basis.</p>
        <p class="lead">Data will be joined with related datasets to provide the user with further context to these crimes. These include datasets of firearm and related equipment purchases made by police departments, and budget allocations at a city and county level. Using these data, users of our application will be able to discover potentially meaningful correlations between police violence, firearm purchases, and police funding.</p>
        <p class="lead"><strong>Project Creators: </strong>Christian Morrow, Kai Kleinbard, Patrick McCauley, Rohan Murthy </p>
        <p class="lead"><strong>Data Sources: </strong> <a href="https://www.kaggle.com/jpmiller/police-violence-racial-equity">City Budgets</a>, <a href="https://www.kaggle.com/jpmiller/police-violence-in-the-us">Police Shootings (MPV)</a>, <a href="https://www.kaggle.com/jpmiller/police-violence-in-the-us">Police Shootings (Washington Post)</a>, <a href="https://github.com/datahoarder/leso_1033">Military Surplus Pre Ferguson (1)</a>, <a href="https://data.world/gene/military-surplus-2014-police/workspace/file?filename=1033-program-foia-may-2014.csv">Military Surplus Pre Ferguson (2)</a>, <a href="https://github.com/BuzzFeedNews/2020-06-leso-1033-transfers-since-ferguson">Military Surplus Post Ferguson</a>, <a href="https://www.kaggle.com/jpmiller/police-violence-in-the-us">US Police Violence (Kaggle)</a></p>
        <div class="row mx-0">
            <div class="col bg-dark p-4">
                &nbsp;
            </div>

        </div>
    </div>
</section>
		);
	}
}


