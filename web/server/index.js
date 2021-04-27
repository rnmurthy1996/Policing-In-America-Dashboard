const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */


app.get('/query1', routes.query1);

app.get('/policeViolence/:race/:minAge/:maxAge/:year', routes.query2A);

app.get('/policeViolenceStateStats/:state/:year', routes.query2B);

app.get('/policeViolenceFilterOptions', routes.queryFilterOptions);

app.get('/query2C/:_fillin_', routes.query2C);

app.get('/query2D/:_fillin_', routes.query2D);

app.get('/query3/:_fillin_', routes.query3);

app.get('/query4/:_fillin_', routes.query4);

app.get('/query5/:_fillin_', routes.query5);

app.get('/query6/:_fillin_', routes.query6);

app.get('/tbrquery/:city/:state/:year', routes.tbrquery);

app.get('/psrquery/:city/:state/:year', routes.psrquery);

app.get('/krquery/:city/:state/:year', routes.krquery);

app.get('/query8/:_fillin_', routes.query8);

app.get('/query9/:_fillin_', routes.query9);

app.get('/years/:state', routes.getAllAvailableYearsMiliTrans);

app.get('/firearmpurchases/:state/:year', routes.getAggItemTypeCostByStateYear);

app.get('/purchasedetails/:state/:year', routes.getItemTypeNameCostByStateYear);



app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
