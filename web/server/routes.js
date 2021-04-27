var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// function query1(req, res) {
//   const query = `
//   /    `
//   connection.query(query, function(err, rows, fields) {
//     if (err) console.log(err);
//     else {
//       res.json(rows)
//     }
//   })
// };

/*
----------------------QUERY 1:-----------------------
Count the number of deaths and the number of firearm
purchases joining on state, grouping by state and year,
ordering by both
-----------------------------------------------------
*/
function query1(req, res) {
  const query = `
  WITH
  guns AS (
    SELECT state, acq_year, COUNT(*) AS num_guns
    FROM mili_trans WHERE item_type = "gun" GROUP BY state, acq_year),
  deaths AS (
    SELECT state, year, COUNT(*) AS num_deaths FROM police_violence
    GROUP BY state, year
  )
  SELECT g.state, g.acq_year AS year, num_guns, COALESCE(num_deaths, "N/A") FROM guns g
    LEFT OUTER JOIN deaths d ON g.state = d.state AND g.acq_year = d.year
    ORDER BY g.state ASC, g.acq_year DESC;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};

/*
----------------------QUERY 2:-----------------------
Select the number of killings of a given race, grouped
by state, adjusted for state demographics
-----------------------------------------------------
*/
/*
----------------------QUERY 2A:-----------------------
This query returns the number of  police gun violence
victims per 1,000,000 within a given race and age range,
broken down by state, for a given year.
INPUTS: race, min_age, max_age, year
-----------------------------------------------------
*/   //? QUESTION: how to deal with ${year} etc..... if thats to be changed depending on input?
function query2A(req, res) { //LOOKUP THE MOVIES res. Q2 in HW
 var year = req.params.year;
 var race = req.params.race;
 var min_age = req.params.minAge;
 var max_age = req.params.maxAge;

 var raceQuery = (race === 'All') ? '' : ` AND race = '${race}'`
 var demRaceQuery;
 if (race === 'All') {
  demRaceQuery = ` AND origin = 'Total'`;
 } else if (race === 'Hispanic') {
  demRaceQuery = ` AND origin = 'hispanic'`;
 } else {
  demRaceQuery = ` AND origin = 'non_hispanic' AND race = '${race}'`;
 }

 const query = `
  WITH populations AS (
  SELECT state, SUM(year_${year}) AS population
  FROM demographics
  WHERE sex = 'Total'${demRaceQuery} AND ${min_age} < age AND ${max_age} > age
  GROUP BY (state)
  ),
  victims AS (
  SELECT state, COUNT(*) AS victim_count
  FROM police_violence
  WHERE year = ${year}${raceQuery} AND ${min_age} < age AND ${max_age} > age
  GROUP BY (state)
  )
  SELECT p.state, v.victim_count / p.population * 1000000 AS percentage, v.victim_count AS total_killings, p.population AS total_population
  FROM populations p LEFT OUTER JOIN victims v ON p.state = v.state;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};

/*
----------------------QUERY 2B:-----------------------

Note that two queries are executed in this call

This query returns statistics for each race for a given state 
and year, including "ratio", which says which race was
disproportionately targeted by police violence. Here,
"disproportionately targeted" means the percentage of
police violence cases which target a given race is greater
than that race's percentage of the population.
INPUTS: year, state

Query which returns 5 random articles about police violence
incidents which happened in a given state
-----------------------------------------------------
*/
function query2B(req, res) {
 var year = req.params.year;
var state = req.params.state;
const query = `
WITH population AS (
	SELECT race, SUM(year_${year}) AS race_population
	FROM demographics
	WHERE sex = 'Total' AND origin = 'Total' AND state = '${state}'
	GROUP BY race
),
killings AS (
  SELECT race, COUNT(*) AS race_killings
	FROM police_violence
	WHERE year = ${year} AND state = '${state}'
	GROUP BY race
),
total_pop AS (
	SELECT SUM(race_population) AS pop FROM population
),
killing_pop AS (
	SELECT SUM(race_killings) AS pop FROM killings
)
SELECT race, race_population, race_killings, 
(race_population / (SELECT pop FROM total_pop)) AS percent_race,
(race_killings / (SELECT pop FROM killing_pop)) AS percent_killings,
(race_killings / (SELECT pop FROM killing_pop)) /(race_population / (SELECT pop FROM total_pop)) AS ratio
FROM population NATURAL JOIN killings
ORDER BY ratio DESC;
`;

connection.query(query, function(err, state_data, fields) {
  if (err) console.log(err);
  else {
    const query2 = `
    SELECT name, city, article
    FROM police_violence
    WHERE state = '${state}' AND article <> 'NULL'
    ORDER BY RAND()
    LIMIT 5;
      `
    connection.query(query2, function(err, article_data, fields) {
      if (err) console.log(err);
      else {
        const result = {
          state_data: state_data,
          article_data: article_data
        }
        res.json(result)
      }
    })
  }
})
};

/*
----------------------QUERY 2C:-----------------------

This query finds the range of valid years and races that are available
in both the police violence and demographics database. This drives what
is populated in the filtering options on the police violence page.
-----------------------------------------------------
*/
function queryFilterOptions(req, res) {
  
 const query = `
WITH c AS (
SELECT COLUMN_NAME AS name
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'demographics'),
years AS (
SELECT SUBSTRING(name, 6, 4) AS year 
FROM c
WHERE name LIKE 'year_%'
)
SELECT year FROM years
WHERE year IN (SELECT DISTINCT year FROM police_violence);
 `;
 
 connection.query(query, function(err, years, fields) {
   if (err) console.log(err);
   else {
     const query2 = `
      SELECT DISTINCT race
      FROM police_violence
      WHERE race <> '' AND race <> 'Unknown'
      ORDER BY race;
       `
     connection.query(query2, function(err, races, fields) {
       if (err) console.log(err);
       else {
         const result = {
          years: years,
          races: races
         }
         res.json(result)
       }
     })
   }
 })
 };


/*
----------------------QUERY 2C:-----------------------
Query which returns 5 random articles about police violence
incidents which happened in a given city, and with a specified
ethod of violence. Method of violence will be selected from a
list of dropdowns, and both city and method of violence can be
set to ‘Any’.

INPUTS: city, method_of_violence(dropdown option offering one of
‘Gunshot’, ‘Taser’, ‘Pepper Spray’, ‘Physical Restraint’, ‘Vehicle’,
Asphyxiated’, ‘Beaten’, ‘Other’
-----------------------------------------------------
*/
function query2C(req, res) {
var state = req.params.state;
// var method_of_violence = req.params.method_of_violence;
const query = `
SELECT name, city, article
FROM police_violence
WHERE state = '${state}' AND article <> 'NULL'
ORDER BY RAND()
LIMIT 5;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 2D:-----------------------
Query which returns all cities where no police shooting
occurred (specifically a police violence incident which
involved a gun)
-----------------------------------------------------
*/
function query2D(req, res) {
 const query = `
 SELECT DISTINCT city
 FROM police_violence p
 WHERE city NOT IN (
 SELECT DISTINCT city
      FROM police_violence p2
      WHERE cause_of_death LIKE '%shot%'
 )
 ORDER BY city ASC;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 3:-----------------------
Select total cost spent on firearms and number of shootings,
joined on state and grouped by state
-----------------------------------------------------
*/
function query3(req, res) {
 const query = `
  WITH deaths AS (
      SELECT state, COUNT(*) AS num_deaths FROM police_violence
      GROUP BY state
    )
  SELECT m.state, ROUND(SUM(cost_per_item)) AS spent, num_deaths FROM mili_trans m
      JOIN deaths d on d.state = m.state AND item_type = "gun"
      GROUP BY m.state ORDER BY m.state;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 4:-----------------------
Select total cost of DOD purchases grouped by item
(i.e. firearm vs non-firearm)
INPUTS: automatically loads
-----------------------------------------------------
*/
function query4(req, res) {
 const query = `
  CREATE TEMPORARY TABLE Temp (
    SELECT SUM(total_purchase_cost) as non_violent
    FROM mili_trans
    WHERE DEMIL_code = 'A' OR DEMIL_code = 'B' OR
    DEMIL_code = 'Q'
      );

  SELECT SUM(T.total_purchase_cost) as violent, T2.non_violent
  FROM mili_trans T, Temp T2
  WHERE T.DEMIL_code = 'G' OR
  T.DEMIL_code = 'P' OR T.DEMIL_code = 'F' OR
  T.DEMIL_code = 'D' OR  T.DEMIL_code = 'C' OR
  T.DEMIL_code = 'E';

  DROP TEMPORARY TABLE Temp;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 5:-----------------------
Select most costly item purchased grouped by state
INPUT: automatically loads
-----------------------------------------------------
*/
function query5(req, res) {
 const query = `
SELECT DISTINCT m.state, m.item_name, MAX(total_purchase_cost)
FROM mili_trans m
GROUP BY state
ORDER BY total_purchase_cost DESC;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
}

/**
 * Returns all available years for selection from the military transfers table based on
 * which states (if any) have already been chosen
 *
 * @param req
 * @param res
 */
function getAllAvailableYearsMiliTrans(req, res) {
  console.log("In the years selection.")

  let whereClause = req.params.state == 'all' ? '' : ` WHERE state = '${req.params.state}'`;

  const query = `SELECT DISTINCT acq_year as year FROM mili_trans ${whereClause} ORDER BY year DESC`;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 6:-----------------------
Select percentage of violent equipment for each state
INPUTS:  helper functions
-----------------------------------------------------
*/
function query6(req, res) {
 const query = `
-- amount each state spend on violent
SELECT DISTINCT state, SUM(total_purchase_cost) as violent_spend
FROM mili_trans
WHERE DEMIL_code <> 'A' AND DEMIL_code <> 'B'
AND DEMIL_code <> 'Q'
GROUP BY state;

-- PERCENTAGE each state spend on violent equipment vs. non-violent
WITH Temp AS(
SELECT DISTINCT state, SUM(total_purchase_cost) as violent_spend
FROM mili_trans
WHERE DEMIL_code <> 'A' AND DEMIL_code <> 'B' AND DEMIL_code <> 'Q'
GROUP BY state)
SELECT DISTINCT m.state, T.violent_spend/SUM(m.total_purchase_cost) as percentage_violent
FROM mili_trans m, Temp T
WHERE T.state = m.state
GROUP BY state;

-- total each state spent on DOD transfer program
SELECT DISTINCT m.state, SUM(m.total_purchase_cost) -- as percentage_violent
FROM mili_trans m
GROUP BY state;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
}


function getItemTypeNameCostByStateYear(req, res) {
    const stateClause = req.params.state != "all" ? ` state = '${req.params.state}' ` : "";
    const yearClause = req.params.year != "all" ? ` acq_year = ${req.params.year} ` : "";
    let whereClause = ""
    if (stateClause.length > 0 && yearClause.length > 0) {
        whereClause = ` WHERE ${stateClause} AND ${yearClause}`;
    } else if (stateClause.length > 0) {
        whereClause = ` WHERE ${stateClause} `;
    } else if (yearClause.length > 0) {
        whereClause = ` WHERE ${yearClause} `;
    }

    const query = `
    SELECT item_type, item_name, cost_per_item * quantity as cost FROM mili_trans ${whereClause}
    GROUP BY item_type, item_name ORDER BY cost desc;
    `

    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows)
        }
    })
};


/**
 * Returns the aggregate item type, cost by state by year depending on which states/year has been
 * selected
 *
 * @param req
 * @param res
 */
function getAggItemTypeCostByStateYear(req, res) {
  const stateClause = req.params.state != "all" ? ` state = '${req.params.state}' ` : "";
  const yearClause = req.params.year != "all" ? ` acq_year = ${req.params.year} ` : "";
  let whereClause = ""
  if (stateClause.length > 0 && yearClause.length > 0) {
    whereClause = ` WHERE ${stateClause} AND ${yearClause}`;
  } else if (stateClause.length > 0) {
    whereClause = ` WHERE ${stateClause} `;
  } else if (yearClause.length > 0) {
    whereClause = ` WHERE ${yearClause} `;
  }

  const query = `
    SELECT item_type AS type, state, acq_year AS year, SUM(cost_per_item * quantity) AS cost FROM mili_trans ${whereClause} 
    GROUP BY item_type, state, year ORDER BY state asc, year desc, cost desc;
  `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 7.1:-----------------------
Select percentage of the city budget spent on police
for a given city in a specific year
-----------------------------------------------------
*/
function tbrquery(req, res) {

  var inputCity = req.params.city;
  var inputState = req.params.state;
  var inputYear = req.params.year;

  const query = `
  SELECT police_spending_city/total_spending_city AS TSR
  FROM budgets
  WHERE city_name = '${inputCity}' AND city_state = '${inputState}' AND year = '${inputYear}'
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 7.2:-----------------------
Select percentage of the city public safety budget
spent on police for a given city in a specific year
-----------------------------------------------------
*/
function psrquery(req, res) {

  var inputCity = req.params.city;
  var inputState = req.params.state;
  var inputYear = req.params.year;

  const query = `
  SELECT police_spending_city/public_safety_spending_city AS PSR
  FROM budgets
  WHERE city_name = '${inputCity}' AND city_state = '${inputState}' AND year = '${inputYear}'
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 7.3:-----------------------
Select the number of deaths per 1000 people in a
given city in a specific year
-----------------------------------------------------
*/
function krquery(req, res) {

  var inputCity = req.params.city;
  var inputState = req.params.state;
  var inputYear = req.params.year;

  const query = `
  WITH total_pop AS (
	SELECT city_population
	FROM budgets
	WHERE city_name = '${inputCity}' AND city_state = '${inputState}' AND year = '${inputYear}'
  ),
  killings AS (
  	SELECT COUNT(*) AS killcnt
  	FROM police_violence
  	WHERE city = '${inputCity}' AND state = '${inputState}' AND year = '${inputYear}'
  )
  SELECT killcnt/city_population*1000 AS KR
  FROM total_pop, killings
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 8:-----------------------
Select total amount spent on weapons and ammo as well as the
number of deaths for a given state in the years that there
were police-related deaths
INPUT: {state_input}.
-----------------------------------------------------
*/
function query8(req, res) {
 const query = `
WITH
  guns AS (
    SELECT acq_year, ROUND(SUM(cost_per_item)) AS guns_cost
    FROM mili_trans WHERE item_type = "gun" AND state = {state_input} GROUP BY acq_year),
  ammo AS (
    SELECT acq_year, ROUND(SUM(cost_per_item)) AS ammo_cost
    FROM mili_trans WHERE item_type = "ammo" AND state = {state_input} GROUP BY acq_year),
  deaths AS (
    SELECT year, COUNT(*) AS num_deaths
    FROM police_violence WHERE state = {state_input} GROUP BY year
  )
  SELECT d.year, num_deaths, ammo_cost, guns_cost FROM deaths d
    JOIN (SELECT g.acq_year, guns_cost, ammo_cost FROM guns g
          JOIN ammo a ON g.acq_year = a.acq_year
          GROUP BY g.acq_year) x
    ON d.year = x.acq_year
    GROUP BY d.year ORDER BY d.year DESC;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};


/*
----------------------QUERY 9:-----------------------
Drill into what types of purchases a given state has made
over all years on record (split by percentage). The percentage
part can be done in the server code rather than through the
query
INPUT: {state_input}
-----------------------------------------------------
*/
function query9(req, res) {
 const query = `
  SELECT item_type, ROUND(SUM(cost_per_item)) AS cost FROM mili_trans
  WHERE state = {state_input} GROUP BY item_type;
   `
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows)
    }
  })
};



// The exported functions, which can be accessed in index.js.
module.exports = {
  query1: query1,
  queryFilterOptions: queryFilterOptions,
  query2A: query2A,
  query2B: query2B,
  query2C: query2C,
  query2D: query2D,
  query3: query3,
  query4: query4,
  query5: query5,
  query6: query6,
  tbrquery: tbrquery,
  psrquery: psrquery,
  krquery: krquery,
  query8: query8,
  query9: query9,
  getAggItemTypeCostByStateYear: getAggItemTypeCostByStateYear,
  getItemTypeNameCostByStateYear: getItemTypeNameCostByStateYear,
  getAllAvailableYearsMiliTrans: getAllAvailableYearsMiliTrans,
}
