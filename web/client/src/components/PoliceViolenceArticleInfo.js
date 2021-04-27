import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PoliceViolenceArticleInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li key={this.props.name}>
                <a href={this.props.article} target="_blank">{this.props.name}, {this.props.city}</a>    
            </li>
        );
    }
}
