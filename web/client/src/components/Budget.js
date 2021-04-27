import React from 'react';
// import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./NavigationBar";
import Header from "./Header";
import Util from "./FirearmPurchases/Util";
import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Budget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      year: "",
      state: "",
      city: "",
      clickedtbr: "",
      clickedpsr: "",
      clickedkr: "",
      tbrDiff: 0,
      psrDiff: 0,
      krDiff: 0,
      tbrHL: "",
      psrHL: "",
      krHL: "",
      textStyle: "none",
      graphView: false,
      graphTitle: "",
      graphTitle2: "",
      middleText: "",
      currentkr: 0,
      lines: 0,
      labelFont: 0
    };

    this.buttonClick = this.buttonClick.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
      console.log("Querying!")
    fetch(`http://localhost:8081/query1`, {
        method: 'GET'
    }).then(res => {
        console.log("Received something back")
        return res.json();
    }, err => {
        console.log(err)
    }).then(json => console.log(json));
  }

  populate() {

    var cities = {
        AK:['Anchorage','Fairbanks'],
        AL:['Birmingham','Gadsden','Mobile','Montgomery'],
        AR:['Ft. Smith','Little Rock','Pine Bluff'],
        AZ:['Mesa','Phoenix','Tucson'],
        CA:['Anaheim','Bakersfield','Fremont','Fresno','Huntington Beach','Long Beach','Los Angeles','Modesto','Oakland','Riverside','Sacramento','San Diego','San Francisco','San Jose','Santa Ana'],
        CO:['Aurora','Colorado Springs','Denver'],
        CT:['Bridgeport','Hartford','New Haven'],
        DC:['Washington'],
        DE:['Dover','Wilmington'],
        FL:['Ft. Lauderdale','Hialeah','Jacksonville','Miami','Orlando','St. Petersburg','Tallahassee','Tampa'],
        GA:['Atlanta','Columbus','Savannah'],
        HI:[],
        IA:['Cedar Rapids','Des Moines'],
        ID:['Boise','Nampa'],
        IL:['Aurora','Chicago','Decatur','East St. Louis','Rock Island'],
        IN:['Anderson','East Chicago','Ft. Wayne','Gary','Hammond','Indianapolis','South Bend','Terre Haute'],
        KS:['Kansas City','Topeka','Wichita'],
        KY:['Covington','Lexington','Louisville'],
        LA:['Baton Rouge','New Orleans','Shreveport'],
        MA:['Boston','Fall River','Holyoke','Lawrence','Lynn','New Bedford','Pittsfield','Springfield','Worcester'],
        MD:['Baltimore','Frederick'],
        ME:['Lewiston','Portland'],
        MI:['Bay City','Dearborn','Dearborn Heights','Detroit','Flint','Grand Rapids','Hamtramck','Jackson','Lincoln Park','Pontiac','Roseville','Saginaw','Taylor','Warren'],
        MN:['Duluth','Minneapolis','St. Paul'],
        MO:['Kansas City','St. Joseph','St. Louis','University City'],
        MS:['Gulfport','Jackson'],
        MT:['Billings','Missoula'],
        NC:['Charlotte','Durham','Greensboro','Raleigh'],
        ND:['Bismarck','Fargo'],
        NE:['Lincoln','Omaha'],
        NH:['Manchester','Nashua'],
        NJ:['Atlantic City','Bayonne','Camden','Trenton'],
        NM:['Albuquerque','Las Cruces'],
        NV:['Las Vegas','Reno'],
        NY:['Albany','Binghamton','Buffalo','New York','Niagara Falls','Rochester','Rome','Schenectady','Syracuse','Troy','Utica','Yonkers'],
        OH:['Akron','Canton','Cincinnati','Cleveland','Cleveland Heights','Columbus','Dayton','Euclid','Lima','Springfield','Toledo','Warren','Youngstown'],
        OK:['Oklahoma','Tulsa'],
        OR:['Eugene','Portland','Salem'],
        PA:['Altoona','Chester','Erie','Harrisburg','Johnstown','Mckeesport','Philadelphia','Pittsburgh','Reading','Scranton','Wilkes-Barre','York'],
        RI:['Providence','Warwick'],
        SC:['Charleston','Columbia'],
        SD:['Rapid City','Sioux Falls'],
        TN:['Chattanooga','Knoxville','Memphis','Nashville'],
        TX:['Arlington','Austin','Corpus Christi','Dallas','El Paso','Ft. Worth','Galveston','Garland','Houston','Lubbock','San Antonio'],
        UT:['Provo','Salt Lake City'],
        VA:['Chesapeake','Danville','Norfolk','Richmond','Virginia Beach'],
        VT:['Burlington','Rutland'],
        WA:['Seattle','Spokane','Tacoma'],
        WI:['Madison','Milwaukee'],
        WV:['Charleston','Huntington','Wheeling'],
        WY:['Casper','Cheyenne']
    }

    var s1 = document.getElementById("state-dropdown");
    var s2= document.getElementById("city-dropdown");
    s2.innerHTML = "";
    var optionArray;

    for(var v in cities) {
      var key = v;
      var val = cities[v];
      if(s1.value == key) {
        optionArray = val;
      }
    }

    var index;
    for (index = 0; index < optionArray.length; index++) {
      var newOption = document.createElement("option");
      newOption.value = optionArray[index];
      newOption.innerHTML = optionArray[index];
      s2.options.add(newOption);
    }
  }

  buttonClick() {

    this.setState({city : document.getElementById("city-dropdown").value});
    this.setState({state : document.getElementById("state-dropdown").value});
    this.setState({year : document.getElementById("year-dropdown").value});

    var city2 = document.getElementById("city-dropdown").value;
    var state2= document.getElementById("state-dropdown").value;
    var year2 = document.getElementById("year-dropdown").value;

    this.setState({textStyle: "block"});
    this.setState({graphView: true});
    this.setState({middleText: city2 + ", " + state2 + ": " + year2});
    this.setState({graphTitle: "Budget Breakdown"});
    this.setState({graphTitle2: "Police Killings / 1,000,000 People"});
    this.setState({lines: 1});
    this.setState({labelFont: 16});

    var tbr13 = 0.12473;
    var tbr14 = 0.12451;
    var tbr15 = 0.12788;
    var tbr16 = 0.12888;
    var tbr17 = 0.12826;

    var psr13 = 0.57412;
    var psr14 = 0.57314;
    var psr15 = 0.57213;
    var psr16 = 0.57237;
    var psr17 = 0.57534;

    var kr13 = 0.005422;
    var kr14 = 0.004796;
    var kr15 = 0.006658;
    var kr16 = 0.006158;
    var kr17 = 0.005509;

    //fetch methods
    // Send an HTTP request to the server.
    fetch
    (
      "http://localhost:8081/tbrquery/"+city2+"/"+state2+"/"+year2,
      {method: 'GET'}
    ).then
    (
      res => {return res.text();},
      err => {console.log(err);}
    ).then
    (
      result => {
        this.setState({clickedtbr: result.substring(8,result.length-2)});
        if(this.state.year == "2013") {this.setState({tbrDiff: ((parseFloat(this.state.clickedtbr))-tbr13)/tbr13*100});}
        if(this.state.year == "2014") {this.setState({tbrDiff: ((parseFloat(this.state.clickedtbr))-tbr14)/tbr14*100});}
        if(this.state.year == "2015") {this.setState({tbrDiff: ((parseFloat(this.state.clickedtbr))-tbr15)/tbr15*100});}
        if(this.state.year == "2016") {this.setState({tbrDiff: ((parseFloat(this.state.clickedtbr))-tbr16)/tbr16*100});}
        if(this.state.year == "2017") {this.setState({tbrDiff: ((parseFloat(this.state.clickedtbr))-tbr17)/tbr17*100});}
        if(this.state.tbrDiff >= 0) {this.setState({tbrHL: "higher"});}
        else if(this.state.tbrDiff < 0) {this.setState({tbrHL: "lower"});}
      },
      err => {console.log(err);}
    );


    fetch
    (
      "http://localhost:8081/psrquery/"+city2+"/"+state2+"/"+year2,
      {method: 'GET'}
    ).then
    (
      res => {return res.text();},
      err => {console.log(err);}
    ).then
    (
      result => {
        this.setState({clickedpsr: result.substring(8,result.length-2)});
        if(this.state.year == "2013") {this.setState({psrDiff: ((parseFloat(this.state.clickedpsr))-psr13)/psr13*100});}
        if(this.state.year == "2014") {this.setState({psrDiff: ((parseFloat(this.state.clickedpsr))-psr14)/psr14*100});}
        if(this.state.year == "2015") {this.setState({psrDiff: ((parseFloat(this.state.clickedpsr))-psr15)/psr15*100});}
        if(this.state.year == "2016") {this.setState({psrDiff: ((parseFloat(this.state.clickedpsr))-psr16)/psr16*100});}
        if(this.state.year == "2017") {this.setState({psrDiff: ((parseFloat(this.state.clickedpsr))-psr17)/psr17*100});}
        if(this.state.psrDiff >= 0) {this.setState({psrHL: "higher"});}
        else if(this.state.psrDiff < 0) {this.setState({psrHL: "lower"});}
      },
      err => {console.log(err);}
    );

    fetch
    (
      "http://localhost:8081/krquery/"+city2+"/"+state2+"/"+year2,
      {method: 'GET'}
    ).then
    (
      res => {return res.text();},
      err => {console.log(err);}
    ).then
    (
      result => {
        this.setState({clickedkr: result.substring(7,result.length-2)});
        if(this.state.year == "2013") {this.setState({krDiff: ((parseFloat(this.state.clickedkr))-kr13)/kr13*100}); this.setState({currentkr: kr13});}
        if(this.state.year == "2014") {this.setState({krDiff: ((parseFloat(this.state.clickedkr))-kr14)/kr14*100}); this.setState({currentkr: kr14});}
        if(this.state.year == "2015") {this.setState({krDiff: ((parseFloat(this.state.clickedkr))-kr15)/kr15*100}); this.setState({currentkr: kr15});}
        if(this.state.year == "2016") {this.setState({krDiff: ((parseFloat(this.state.clickedkr))-kr16)/kr16*100}); this.setState({currentkr: kr16});}
        if(this.state.year == "2017") {this.setState({krDiff: ((parseFloat(this.state.clickedkr))-kr17)/kr17*100}); this.setState({currentkr: kr17});}
        if(this.state.krDiff >= 0) {this.setState({krHL: "higher"});}
        else if(this.state.krDiff < 0) {this.setState({krHL: "lower"});}
      },
      err => {console.log(err);}
    );
  }

  render() {

    const options = {
          //width: 600,
    			animationEnabled: true,
    			title: {
    				text: this.state.graphTitle
    			},
    			subtitles: [{
    				text: this.state.middleText,
    				verticalAlign: "center",
    				fontSize: 14,
    				dockInsidePlotArea: true
    			}],
    			data: [{
            visible: this.state.graphView,
    				type: "doughnut",
    				showInLegend: false,
    				indexLabel: "{name}: {y}",
    				yValueFormatString: "#,###.#'%'",
    				dataPoints: [
    					{ name: "Police", y: parseFloat(this.state.clickedtbr)*100 },
    					{ name: "Public Safety (Excluding Police)", y: ((parseFloat(this.state.clickedtbr) / parseFloat(this.state.clickedpsr)) - parseFloat(this.state.clickedtbr))*100 },
    					{ name: "Other", y: (1 -  parseFloat(this.state.clickedtbr) - ((parseFloat(this.state.clickedtbr) / parseFloat(this.state.clickedpsr) - parseFloat(this.state.clickedtbr))))*100}
    				]
    			}]
    		}

      const options2 = {
        //width: 600,
        title: {
          text: this.state.graphTitle2,
        },
        axisY: {
           minimum: 0,
           lineThickness: this.state.lines,
           gridThickness: this.state.lines,
           labelFontSize: this.state.labelFont,
           tickLength: 0
         },
         axisX: {
            lineThickness: this.state.lines
          },
        data: [{
                  visible: this.state.graphView,
                  type: "column",
                  dataPoints: [
                      { label: this.state.middleText,  y: this.state.clickedkr*1000  },
                      { label: "National Average: " + this.state.year, y: this.state.currentkr*1000  }
                  ]
         }]
       }


    return (

        <wrapper>

            <Header label="Budget"/>
            <NavigationBar activePage={"budget"}/>

            <br />

            <div style={{ textAlign: 'center' }}>
              <select id="year-dropdown"  name="year">
                      <option selected disabled>Select Year</option>
                      <option value = "2013">2013</option>
                      <option value = "2014">2014</option>
                      <option value = "2015">2015</option>
                      <option value = "2016">2016</option>
                      <option value = "2017">2017</option>
              </select>

              <select id="state-dropdown" name="state"  onChange={this.populate}>
                      <option selected disabled>Select State</option>
                      <option value = "AL">Alabama</option>
                      <option value = "AK">Alaska</option>
                      <option value = "AZ">Arizona</option>
                      <option value = "AR">Arkansas</option>
                      <option value = "CA">California</option>
                      <option value = "CO">Colorado</option>
                      <option value = "CT">Connecticut</option>
                      <option value = "DC">Washington, D.C. </option>
                      <option value = "DE">Delaware</option>
                      <option value = "FL">Florida</option>
                      <option value = "GA">Georgia</option>
                      <option value = "HI">Hawaii</option>
                      <option value = "ID">Idaho</option>
                      <option value = "IL">Illinois</option>
                      <option value = "IN">Indiana</option>
                      <option value = "IA">Iowa</option>
                      <option value = "KS">Kansas</option>
                      <option value = "KY">Kentucky</option>
                      <option value = "LA">Louisiana</option>
                      <option value = "ME">Maine</option>
                      <option value = "MD">Maryland</option>
                      <option value = "MA">Massachusetts</option>
                      <option value = "MI">Michigan</option>
                      <option value = "MN">Minnesota</option>
                      <option value = "MS">Mississippi</option>
                      <option value = "MO">Missouri</option>
                      <option value = "MT">Montana</option>
                      <option value = "NE">Nebraska</option>
                      <option value = "NV">Nevada</option>
                      <option value = "NH">New Hampshire</option>
                      <option value = "NJ">New Jersey</option>
                      <option value = "NM">New Mexico</option>
                      <option value = "NY">New York</option>
                      <option value = "NC">North Carolina</option>
                      <option value = "ND">North Dakota</option>
                      <option value = "OH">Ohio</option>
                      <option value = "OK">Oklahoma</option>
                      <option value = "OR">Oregon</option>
                      <option value = "PA">Pennsylvania</option>
                      <option value = "RI">Rhode Island</option>
                      <option value = "SC">South Carolina</option>
                      <option value = "SD">South Dakota</option>
                      <option value = "TN">Tennessee</option>
                      <option value = "TX">Texas</option>
                      <option value = "UT">Utah</option>
                      <option value = "VT">Vermont</option>
                      <option value = "VA">Virginia</option>
                      <option value = "WA">Washington</option>
                      <option value = "WV">West Virginia</option>
                      <option value = "WI">Wisconsin</option>
                      <option value = "WY">Wyoming</option>
              </select>

              <select id="city-dropdown"name="city">
                <option selected disabled>Select City</option>
              </select>

              <button onClick={this.buttonClick}>
                      Enter
              </button>
            </div>

            <br />
            <br />
            <div style={{ id: 'text1', textAlign: 'center', display: this.state.textStyle }}>{this.state.city}, {this.state.state} spent {(parseFloat(this.state.clickedtbr)*100).toFixed(2)}% of its total budget on the police force in {this.state.year}.
            This was {Math.abs(this.state.tbrDiff).toFixed(2)}% {this.state.tbrHL} than the national average for {this.state.year}.</div>
            <br />
            <div style={{ id: 'text2', textAlign: 'center', display: this.state.textStyle }}>{this.state.city}, {this.state.state} spent {(parseFloat(this.state.clickedpsr)*100).toFixed(2)}% of its public safety budget on the police force in {this.state.year}.
            This was {Math.abs(this.state.psrDiff).toFixed(2)}% {this.state.psrHL} than the national average for {this.state.year}.</div>
            <br />
            <div style={{ id: 'text3', textAlign: 'center', display: this.state.textStyle }}>{this.state.city}, {this.state.state} had {(this.state.clickedkr*1000).toFixed(2)} police killings per 1,000,000 people in year {this.state.year}.
            This was {Math.abs(this.state.krDiff).toFixed(2)}% {this.state.krHL} than the national average for {this.state.year}.</div>

            <br />
            <br />

            <div style={{width: "45%",  height: "300px", display: "inline-block"}}>
                <CanvasJSChart options = {options}/>
            </div>

            <div style={{width: "45%",  height: "300px", display: "inline-block"}}>
                <CanvasJSChart options = {options2}/>
            </div>

        </wrapper>
    )
  }
}
