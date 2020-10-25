const axios = require('axios');
const _ = require('lodash');
const {
    STATUS_CODES
} = require('../helpers/constants');
const config = require('../config/index')
const {
    getPastDate,
    maximumCountDay,
    getTodaysDate
} = require('../helpers/util');


/**
 * Get global covid19 statistics
 * @param {*} req 
 * @param {*} res
 * @param {*} next
 * @returns {JSON} 
 */
const globalCovidSummary = async (req, res, next) => {

    try {
        const endpoint = config.url.globalSummary
        const response = await axios.get(endpoint);
        const {
            Global
        } = response.data;

        res.json({
            message: "Data for global Covid-19 case summary found.",
            data: Global
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Get today's covid-19 max/min deaths and max/min confirmed cases amongst all countries
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 * @returns {JSON} 
 */
const globalConfirmedNDeathStats = async (req, res, next) => {
    try {
        let statsResponse = {
            maxTotalConfirmed: 0,
            minTotalConfirmed: 0,
            maxTotalDeaths: 0,
            minTotalDeaths: 0
        }

        const endpoint = config.url.globalSummary
        const response = await axios.get(endpoint);
        const {
            Countries
        } = response.data;

        if (!Countries.length) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "Data not found.",
                data: []
            });
        }

        statsResponse.maxTotalConfirmed = _.maxBy(Countries, 'TotalConfirmed');
        statsResponse.minTotalConfirmed = _.minBy(Countries, 'TotalConfirmed');
        statsResponse.maxTotalDeaths = _.maxBy(Countries, 'TotalDeaths');
        statsResponse.minTotalDeaths = _.minBy(Countries, 'TotalDeaths');

        res.json({
            message: "Data for global COVID-19 Deaths and Confirmed cases found.",
            data: statsResponse
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Get covid19 statistics for all countries
 * @param {*} req 
 * @param {*} res
 * @param {*} next
 * @returns {JSON} 
 */
const allCountriesCovidStats = async (req, res, next) => {
    try {
        const endpoint = config.url.globalSummary;
        const response = await axios.get(endpoint);
        const {
            Countries
        } = response.data;

        if (!Countries.length) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "Data not found.",
                data: []
            });
        }

        res.json({
            message: "Data for Covid-19 statistics for all countries found.",
            data: Countries
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Get today's covid19 statistics for requested country
 * @param {*} req : accepts country from params
 * @param {*} res 
 * @param {*} next
 * @returns {JSON} 
 */
const countryWiseCovidStats = async (req, res, next) => {
    try {

        let countryResponse = {};
        let {
            country
        } = req.params;

        // get past 20 days history
        const todayDate = getTodaysDate;
        const before20Days = getPastDate(20);
        const countryHistoryUrl = `${config.url.singleCountry}/${country}?from=${before20Days}&to=${todayDate}`

        const countryHistoryResponse = await axios.get(countryHistoryUrl)
        const countryHistoryData = countryHistoryResponse.data;

        if (!_.isArray(countryHistoryData)) {
            res.status(STATUS_CODES.NOT_FOUND).json({
                message: 'Data not found for requested country.',
                data: {}
            })
        } else {
            countryResponse.Past20DaysHistory = countryHistoryData;
        }

        // get country summary
        const countrySummaryUrl = config.url.globalSummary
        const countrySummaryResponse = await axios.get(countrySummaryUrl);
        const {
            Countries
        } = countrySummaryResponse.data;

        if (!Countries.length) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "Data not found.",
                data: []
            });
        }

        const countryStats = _.find(Countries, (x) => _.toLower(x.Country) === _.toLower(country));

        if (!countryStats) {
            res.status(STATUS_CODES.NOT_FOUND).json({
                message: "Data not found.",
                data: {}
            })
        }

        countryResponse = countryStats;

        res.json({
            message: "Data for COVID-19 statistics for a country found.",
            data: countryResponse
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Get covid-19 stats for a country where total deaths and confirmed were maimum
 * @param {*} req : accepts country in params
 * @param {*} res 
 * @param {*} next
 * @returns {JSON} 
 */
const countryWiseConfirmedAndDeathStats = async (req, res, next) => {
    try {
        let {
            country
        } = req.params;

        let maximumCountRecord = {
            maxDeaths: {},
            maxConfirmed: {}
        };

        const todayDate = getTodaysDate;
        const endpoint = `${config.url.singleCountry}/${country}?from=2020-01-01T00:00:00Z&to=${todayDate}`

        const response = await axios.get(endpoint)
     
        const data = response.data;
        if (!data || !data.length) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: "Data not found.",
                data: []
            });
        }
        // maximum death count for any day.
        maximumCountRecord.maxDeaths = maximumCountDay(data, 'Deaths');

        // maximum confirmed count for any day.
        maximumCountRecord.maxConfirmed = maximumCountDay(data, 'Confirmed');

        return res.json({
            message: "Data for maximum deaths and confirmed count for day found.",
            data: maximumCountRecord
        });

    } catch (error) {
        
        next(error)
    }
}


module.exports = {
    globalCovidSummary,
    allCountriesCovidStats,
    countryWiseCovidStats,
    globalConfirmedNDeathStats,
    countryWiseConfirmedAndDeathStats,
}