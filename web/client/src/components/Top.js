import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class Top extends React.Component {
	constructor(props) {
		super(props);
	}

	/* ---- Q1b (Dashboard) ---- */
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
		 <section id="top_title" class="bg-white py-5 d-flex flex-column justify-content-center h-100">
		    <div class="container">
		        <h2>Mapping Police Violence, Military Transfers and Budgets</h2>
		        <p class="lead">This is a project for 550 DataBases, University of Pennsylvania School of Engineering, Spring 2021</p>
		    </div>
		</section>
		);
	}
}


