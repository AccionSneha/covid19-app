const express = require('express');
const covidStatsCtrl = require('./covid_stats.controller');
const router = express.Router();

//Global COVID-19 cases summary for today
router.route('/global/summary').get(covidStatsCtrl.globalCovidSummary);

// Global COVID-19 Deaths and Confirmed cases
router.route('/global/deathsAndConfirmed').get(covidStatsCtrl.globalConfirmedNDeathStats);

// COVID-19 statistics for all countries
router.route('/countries/stats').get(covidStatsCtrl.allCountriesCovidStats);

// COVID-19 statistics wrt country
router.route('/country/:country').get(covidStatsCtrl.countryWiseCovidStats);

// Country wise COVID-19 Deaths and Confirmed Cases
router.route('/country/deathsAndConfirmed/:country').get(covidStatsCtrl.countryWiseConfirmedAndDeathStats);

module.exports = router;