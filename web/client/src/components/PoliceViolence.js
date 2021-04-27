import React from 'react';
import '../style/PoliceViolence.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PoliceViolenceInfoBox from './PoliceViolenceInfoBox';
import NavigationBar from "./NavigationBar";
import Header from "./Header";

import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
am4core.useTheme(am4themes_animated);

export default class PoliceViolence extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      race: "All",
      minAge: 0,
      maxAge: 100,
      year: 2013,
      infoBoxDiv: '',
      option: 'heatMap',
      races: [],
      years: []
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  // Map util to convert from state abbr to Name
  stateAbbrMap = {
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
  }

  // React function that is called when the page load.
  componentDidMount() {
    this.createMap();
    this.fetchData();
    this.getFilterOptions();
  }

  /**
   * Gets the valid options for race and year in order to populate the filter dropdown menus
   */
  getFilterOptions() {
    fetch(`http://localhost:8081/policeViolenceFilterOptions`,
      {
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(result => {
        if (!result || result.length < 1) return;
        let years = result.years.map((obj, i) =>
					<option key={i} value={obj.year}>{obj.year}</option>
				);
        this.setState({
					years: years
				});
        let races = result.races.map((obj, i) =>
					<option key={i} value={obj.race}>{obj.race}</option>
				);
        this.setState({
					races: races
				});

      }, err => {
        console.log(err);
      });
  }

  /**
   * Creates the div of the USA map, imported from AM Charts: https://www.amcharts.com/download/
   */
  createMap() {
    let usaMap = am4core.create("mapdiv", am4maps.MapChart);

    usaMap.geodata = am4geodata_usaLow;
    usaMap.projection = new am4maps.projections.Miller();
    usaMap.paddingTop = 20; // Define padding to the top

    usaMap.zoomControl = new am4maps.ZoomControl();
    usaMap.zoomControl.disabled = true;
    usaMap.zoomControl.tapToActivate = false;

    usaMap.seriesContainer.draggable = false;
    usaMap.seriesContainer.resizable = false;
    // Disabling zoom capability
    usaMap.maxZoomLevel = 1;

    let polygonSeries = this.createpolygonSeries();
    this.createpolygonTemplate(polygonSeries);
    usaMap.series.push(polygonSeries);
    this.chart = usaMap;
  }

  // Creates the polygon series
  createpolygonSeries() {
    let polygonSeries = new am4maps.MapPolygonSeries();
    polygonSeries.exclude = ["US-AK", "US-HI"]; // Excluding these for now since they throw off the scale of the map
    polygonSeries.useGeodata = true;

    // Define the heatmap rule
    polygonSeries.heatRules.push({
      "property": "fill",
      "target": polygonSeries.mapPolygons.template,
      "min": am4core.color("#f8f9fa"),
      "max": am4core.color("#212529")
    });

    return polygonSeries;
  }

  // Creates the polygon template
  createpolygonTemplate(polygonSeries) {
    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}\n{description}"; // Tooltip defines what shows up when you hover your cursor over a state
    polygonTemplate.fill = am4core.color("#f8f9fa");

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#00055c");


    // This defines the click event on a given state. This can be used to send queries to the server
    polygonTemplate.events.on("hit", function (ev) {

      let state;
      for (const s in this.stateAbbrMap) {
        if (this.stateAbbrMap[s] === ev.target.dataItem.dataContext.name) {
          state = s;
        }
      }

      fetch(`http://localhost:8081/policeViolenceStateStats/${state}/${this.state.year}`,
        {
          method: 'GET'
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(result => {

          let total_killings;
          let total_population;
          const clickedState = ev.target.dataItem.dataContext.name;
          for (const state of this.chart.series._values[0].data) {
            if (state.name === clickedState) {
              total_killings = state.total_killings;
              total_population = state.total_population;
              break;
            }
          }

          // Creates a new info box
          let infoBox = <PoliceViolenceInfoBox
            id='infoBox'
            title={clickedState}
            divStyle={{ top: ev.point.y, left: ev.point.x }}
            clickHandler={this.handleInfoBoxCloseClick.bind(this)}
            total_killings={total_killings}
            total_population={total_population}
            state_data = {result.state_data}
            article_data = {result.article_data}
          />;
          this.setState({
            infoBoxDiv: infoBox
          });

        }, err => {
          console.log(err);
        });

    }.bind(this));

  }


  handleInfoBoxCloseClick() {
    this.setState({
      infoBoxDiv: ''
    });
  }


  // Fetches data on number of deaths for certain race, age etc
  fetchData() {
    fetch(`http://localhost:8081/policeViolence/${this.state.race}/${this.state.minAge}/${this.state.maxAge}/${this.state.year}`,
      {
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(result => {
        if (!result || result.length < 1) return;
        this.updateHeatMap(result);
      }, err => {
        console.log(err);
      });
  }

  // Uses values returned by the server to create a heatmap of deaths across all states
  updateHeatMap(data) {
    let stateArray = [];

    for (const state of data) {
      const obj = {
        "id": `US-${state["state"]}`,
        "name": this.stateAbbrMap[state["state"]],
        "name_abbr": state["state"],
        "value": state["percentage"] === null ? 0 : state["percentage"],
        "description": `${state["percentage"]} incidents per 1,000,000`,
        "total_killings": state["total_killings"] === null ? 0 : state["total_killings"],
        "total_population": state["total_population"] === null ? 0 : state["total_population"]
      }
      stateArray.push(obj);
    }

    // This grabs the polygon series and updates it
    this.chart.series._values[0].data = stateArray;
    this.setState({
      infoBoxDiv: ''
    });
  }

  /**
   * Handles a change in one of the filter inputs, including race, min and max age, and year
   */
  handleFilterChange(e) {
    const id = e.target.id;
    const value = e.target.value
    this.setState({
      [`${id}`]: value
    }, () => {
      this.fetchData();
    });
  }

  /**
   * Handles a change in selected option
   */
  handleOptionChange(e) {
    const id = e.target.id;
    const value = e.target.value
    console.log(e.target);
    console.log(id);
    this.setState({
      option: id
    }, () => {
      this.fetchData();
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Header label="Police Violence in the US" />
        <NavigationBar />

        <div>
          <div id="mapdiv" style={{ width: "100%", height: "600px" }}></div>
          {this.state.infoBoxDiv}
        </div>

        <div className="row pt-5 pl-3">

          <p id="filter" className="pl-4 h2">Filter:</p>

          <div className="px-3">
            <select className="policeViolenceSelect" id="race" onChange={this.handleFilterChange}>
              <option value="All">All</option>
              {this.state.races}
            </select>
          </div>

          <div className="px-3 row d-flex">
            <input className="policeViolenceSelectAge" onChange={this.handleFilterChange} type="number" id="minAge" placeholder="Min Age" name="Min Age" min="1" max="100" />
            <p id="dash">-</p>
            <input className="policeViolenceSelectAge" onChange={this.handleFilterChange} type="number" id="maxAge" placeholder="Max Age" name="Max Age" min="1" max="100" />
          </div>

          <div className="px-3">
            <select className="policeViolenceSelect" id="year" onChange={this.handleFilterChange}>
              {this.state.years}
            </select>
          </div>

        </div>

      </div>
    )
  }
}
