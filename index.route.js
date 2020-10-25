const express = require('express');
const covidStatsRoutes = require('./api/covid_stats.route');
const router = express.Router();

router.get('/check-api', (req, res) =>
  res.send('OK')
);

router.use('/', covidStatsRoutes);

module.exports = router;