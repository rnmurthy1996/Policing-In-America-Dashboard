import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PoliceViolenceStateInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li key={this.props.race}>{this.props.race}: {this.props.ratio}</li>
        );
    }
}
