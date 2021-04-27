import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class Middle extends React.Component {
	constructor(props) {
		super(props);
	}

	   
render() {
        return (
                 <section id="colors" class="bg-white py-5 d-flex flex-column justify-content-center h-100">
            <div class="container">
    
                <div class="row mx-0">
                    <div class="col bg-light p-4">
                        <div class="page-content page-container" id="page-content">
    <div class="padding">
        <div class="row container d-flex justify-content-center">
            <div class="col-lg-8 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-description"> Current databases: </h4>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><a href="/police_violence/" style={{"color": "black", "text-decoration": "none"}} class="row-link">US Map of Police Violence</a></td>
                                        <td><a href="/police_violence/" tabindex="-1" class="row-link">
  <img src="https://img.icons8.com/ios-filled/50/000000/usa-map.png"></img>
</a> </td>
                                        <td><a href="/police_violence/" tabindex="-1" class="row-link"><label class="badge badge-danger">#police-violence-map</label></a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/firearm_purchases" style={{"color": "black", "text-decoration": "none"}} class="row-link">Map of Military Transfers to Police</a></td>
                                        <td><a href="/firearm_purchases">
  <img src="https://img.icons8.com/ios-filled/50/000000/submachine-gun.png"></img>
</a></td>
                                        <td><a href="/firearm_purchases" tabindex="-1" class="row-link"><label class="badge badge-warning">#military-purchases</label></a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="/budget/" style={{"color": "black", "text-decoration": "none"}} class="row-link">Overview of Local County Budgets</a></td>
                                        <td><a href="budget/">
  <img src="https://img.icons8.com/ios-filled/50/000000/ledger.png"></img>
</a></td>
                                        <td><a href="budget/"><label class="badge badge-info">#budget-allocation</label></a></td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                    </div>

                </div>
            </div>
        </section>
        );
    }
}


