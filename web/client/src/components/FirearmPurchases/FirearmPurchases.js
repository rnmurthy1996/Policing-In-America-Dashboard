import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "../NavigationBar";
import Header from "../Header";
import Map from "../Map";
import IconSet from "./IconSet";
import FirearmYearSelect from "./FirearmYearSelect";
import FirearmTable from "./FirearmTable";

/**
 * This class houses all of the sub-components of the FirearmPurchasing tab.
 */
export default class FirearmPurchases extends React.Component {

    /**
     * Do initial setup for the page, including initializing state.
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        const temp = {total: 1, arr: [{type: 'other', cost: 1}]};

        this.state = {
            selectedState: 'all',
            selectedYear: 'all',
            data: [],
            queryData: temp,
            map: <Map width="100%" height="500px" handleChange={this.handleChange} selectedState={'all'} />,
            iconSet: <IconSet selectedState={'all'} queryData={temp} height={"80px"} width={"80px"} />
        }
    }

    /**
     * Once state is setup, run this quickly to set data to all/all (state/year)
     */
    componentDidMount() {
        this.handleChange('state', 'all');
    }

    /**
     * Handler for setting a state or year. This gets passed to FirearmYearSelect and Map, which
     * handle the actual state setting via this handler. A simple key is used to determine which
     * is being set
     *
     * @param key 'state' or 'year'
     * @param val the value to be set
     */
    handleChange(key, val) {
        let state = this.state.selectedState;
        let year = this.state.selectedYear;
        if (key === 'state') {
            state = val;
        } else if (key === 'year') {
            year = val;
        }

        // Do the query, get the data back, then update the state
        const query = `http://localhost:8081/firearmpurchases/${state}/${year}`;
        fetch(query, { method: 'GET' }).then(res => {
            return res.json();
        }, err => {
            console.log(err)
        }).then(data => {
            // Get the top types for icons
            let sortObj = {}
            let total = 0
            data.forEach((item, index) => {
                if (!sortObj[item.type]) {
                    sortObj[item.type] = {
                        totalCost: item.cost,
                        type: item.type
                    };
                } else {
                    sortObj[item.type].totalCost = sortObj[item.type].totalCost + item.cost;
                }
                total += item.cost;
            })

            let arr = Object.values(sortObj)
            arr.sort((a, b) => {
                return b.totalCost - a.totalCost;
            })
            const queryData = { total: total, arr: arr.slice(0, 5) }

            this.setState({
                selectedState: state,
                selectedYear: year,
                queryData: queryData,
                iconSet: <IconSet selectedState={'all'} queryData={queryData} height={"120px"} width={"120px"} />
            })
        })
    }

    /**
     * Render the final product
     * @returns {*}
     */
    render() {
        return (
            <wrapper>
                <Header label={this.state.selectedState ? `Firearm Purchases: ${this.state.selectedState}` : "Firearm Purchases: All States"} />
                <NavigationBar activePage={"firearm_purchases"} />
                <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>

                    <div>
                        <div style={{padding: "2%"}}>
                            {this.state.map}
                        </div>
                        <div>
                            {this.state.iconSet}
                        </div>
                    </div>

                    <div>
                        <FirearmYearSelect handleChange={this.handleChange} selectedState={this.state.selectedState} />
                        <FirearmTable selectedYear={this.state.selectedYear} selectedState={this.state.selectedState} />
                    </div>
                </div>
            </wrapper>
        )
    }
}