import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PoliceViolenceStateInfo from './PoliceViolenceStateInfo';
import PoliceViolenceArticleInfo from './PoliceViolenceArticleInfo';

export default class PoliceViolenceInfoBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const state_data = this.props.state_data;
        let state_data_div;
        if (state_data && state_data.length >= 1) {
            state_data_div = state_data.map((obj, i) =>
                <PoliceViolenceStateInfo key={i} race={obj.race} ratio={obj.ratio} />
            );
        }

        const article_data = this.props.article_data;
        let article_data_div;
        if (article_data && article_data.length >= 1) {
            article_data_div = article_data.map((obj, i) =>
                <PoliceViolenceArticleInfo key={i} name={obj.name} city={obj.city} article={obj.article} />
            );
        }

        return (
            <div id={this.props.id} style={this.props.divStyle}>
                <div style={{display: 'block'}}>
                    <span className="close" onClick={this.props.clickHandler}>&times;</span>
                    <p className="infoBoxTitle">{this.props.title}</p>
                    <p className="infoBoxText body">Total population: {this.props.total_population}, Total killings: {this.props.total_killings}</p>
                    <p className="infoBoxText" style={{marginBottom: '.25em'}}>Targeted races (with targeted ratio):</p>
                    <ul>
                        {state_data_div}
                    </ul>
                    <p className="infoBoxText body" style={{marginBottom: '.25em'}}>Sample articles:</p>
                    <ul>
                        {article_data_div}
                    </ul>
                </div>
            </div>
        );
    }
}
