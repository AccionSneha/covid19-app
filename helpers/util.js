const _ = require('lodash');

/**
 * Get past date from today.
 * @param {*} noOfDays : no of days to subtract from today's date to get the past date.
 * @returns {Date}  : return date in iso string format
 */
exports.getPastDate = (noOfDays) => {
    let date = new Date(new Date().setHours(0, 0, 0, 0));
    date.setDate(date.getDate() - noOfDays);
    return date.toISOString();
}

/**
 * Get todays date in iso string format.
 */
exports.getTodaysDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

/**
 * Get the maximum case count in a day wrt status
 * @param {*} statsList : Array of all the stats till now
 * @param {*} status : Confirmed / Deaths
 * @returns {JSON} : Single matching record from the statsList array
 */
exports.maximumCountDay = (statsList, status) => {

    let maxDayRecord = {};

    try {
        let maxCount = 0;
        let prevInstanceCount = 0;

        _.forEach(statsList, (record) => {

            let currentInstanceCount = record[status] - prevInstanceCount
            if (currentInstanceCount > maxCount) {
                maxCount = currentInstanceCount;
                maxDayRecord = record

                //maximum case count for a particular day is stored in maxDayCount variable
                maxDayRecord.MaxDayCount = currentInstanceCount
            }
            prevInstanceCount = record[status]
        });

    } catch (error) {
        console.log(error);
    }

    return maxDayRecord;
};