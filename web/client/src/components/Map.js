import React from "react";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
am4core.useTheme(am4themes_animated);

export default class Map extends React.Component {

    /**
     * Constructor
     */
    constructor(props) {
        super(props);

        this.state = {
            chart: am4core.create("mapdiv", am4maps.MapChart),
            stateAbbrMap: {
                "AL": "Alabama",
                "AK": "Alaska",
                "AS": "American Samoa",
                "AZ": "Arizona",
                "AR": "Arkansas",
                "CA": "California",
                "CO": "Colorado",
                "CT": "Connecticut",
                "DE": "Delaware",
                "DC": "District Of Columbia",
                "FL": "Florida",
                "GA": "Georgia",
                "HI": "Hawaii",
                "ID": "Idaho",
                "IL": "Illinois",
                "IN": "Indiana",
                "IA": "Iowa",
                "KS": "Kansas",
                "KY": "Kentucky",
                "LA": "Louisiana",
                "ME": "Maine",
                "MD": "Maryland",
                "MA": "Massachusetts",
                "MI": "Michigan",
                "MN": "Minnesota",
                "MS": "Mississippi",
                "MO": "Missouri",
                "MT": "Montana",
                "NE": "Nebraska",
                "NV": "Nevada",
                "NH": "New Hampshire",
                "NJ": "New Jersey",
                "NM": "New Mexico",
                "NY": "New York",
                "NC": "North Carolina",
                "ND": "North Dakota",
                "OH": "Ohio",
                "OK": "Oklahoma",
                "OR": "Oregon",
                "PA": "Pennsylvania",
                "RI": "Rhode Island",
                "SC": "South Carolina",
                "SD": "South Dakota",
                "TN": "Tennessee",
                "TX": "Texas",
                "UT": "Utah",
                "VT": "Vermont",
                "VA": "Virginia",
                "WA": "Washington",
                "WV": "West Virginia",
                "WI": "Wisconsin",
                "WY": "Wyoming"
            },
            activeState: undefined,
        }

        this.createpolygonSeries = this.createpolygonSeries.bind(this);
        this.createpolygonTemplate = this.createpolygonTemplate.bind(this);
    }

    /**
     * Initial post-constructor setup
     */
    componentDidMount() {
        // Map util to convert from state abbr to Name
        let usaMap = am4core.create("mapdiv", am4maps.MapChart);

        /**
         * Creates the div of the USA map, imported from AM Charts: https://www.amcharts.com/download/
         */
        usaMap.geodata = am4geodata_usaLow;
        usaMap.projection = new am4maps.projections.Miller();
        usaMap.paddingTop = 20; // Define padding to the top

        let polygonSeries = this.createpolygonSeries();
        this.createpolygonTemplate(polygonSeries);
        usaMap.series.push(polygonSeries);

        const chart = usaMap;

        // Uses values returned by the server to create a heatmap of deaths across all states
        const updateHeatMap = data => {
            let stateArray = [];

            for (const state of data) {
                const obj = {
                    "id": `US-${state["state"]}`,
                    "name": this.state.stateAbbrMap[state["state"]],
                    "value": state["percentage"] === null ? 0 : state["percentage"]
                }
                stateArray.push(obj);
            }

            // This grabs the polygon series and updates it
            chart.series._values[0].data = stateArray;
        }

        this.setState({
            chart: chart
        })
    }

    /**
     * Creates the polygon series, sets up initial state and color scheme
     *
     * @returns {MapPolygonSeries}
     */
    createpolygonSeries() {
        let polygonSeries = new am4maps.MapPolygonSeries();
        polygonSeries.exclude = ["US-AK", "US-HI"]; // Excluding these for now since they throw off the scale of the map
        polygonSeries.useGeodata = true;

        // Define the heatmap rule
        polygonSeries.heatRules.push({
            "property": "fill",
            "target": polygonSeries.mapPolygons.template,
            "min": am4core.color("#2F4F4F"),
            "max": am4core.color("#B22222")
        });

        return polygonSeries;
    }

    /**
     * Creates the polygon template on top of the series. Adds listeners, states
     *
     * @param polygonSeries
     */
    createpolygonTemplate(polygonSeries) {
        // Configure series
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}"; // Tooltip defines what shows up when you hover your cursor over a state
        polygonTemplate.fill = am4core.color("#212529");

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#00055c");

        // Create active state
        let activeState = polygonTemplate.states.create("active");
        activeState.properties.fill = am4core.color("#00055c");

        // for (let elt in polygonTemplate.chi)

        // This defines the click event on a given state. This can be used to send queries to the server
        polygonTemplate.events.on("hit", function(ev) {
            if (this.state.activeState) {
                if (this.state.activeState !== ev.target) {
                    this.state.activeState.isActive = false;
                }
            }

            ev.target.isActive = !ev.target.isActive;
            this.setState({activeState: ev.target})
            this.props.handleChange('state', ev.target.isActive ? ev.target.dataItem.dataContext.id.split('-')[1] : 'all')
            console.log(" ==== NOW !Active state is as follows:" + this.state.activeState);

        }.bind(this));
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
        return (
            <div id="mapdiv" style={{width: `${this.props.width}`, height: `${this.props.height}`}}></div>
        )
    }
}