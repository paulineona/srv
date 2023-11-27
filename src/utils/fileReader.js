const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile)


const adjustForTimezone = (date) => {
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
    return date;
}

const formatCsvData = (data) => {
    console.log("==> INSIDE CSV PROCESSING <==");
    const lines = data.split('\n');
    return lines.map((line, index) => { // include index
        const [billingCycleStr, startDateStr, endDateStr] = line.split(',');
        const billingCycle = parseInt(billingCycleStr);
        // console.log(billingCycle);
        if (isNaN(billingCycle) || billingCycle < 1 || billingCycle > 12) {
            throw new Error(`Invalid billing cycle at row ${index + 1}`);
        }
        // const startDate = new Date(startDateSt);
        // const endDate = new Date(endDateStr));
        const startDate = adjustForTimezone(new Date(startDateStr));
        const endDate = adjustForTimezone(new Date(endDateStr));
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error(`Invalid date at row ${index + 1}`);
        }

        console.log(`QUERY`);
        console.log({
            billing_cycle: billingCycle,
            start_date: startDate,
            end_date: endDate
        });

        return {
            billing_cycle: billingCycle,
            // start_date: startDate.toLocaleDateString('en-CA'), // 'en-CA' format is 'yyyy/mm/dd'
            // end_date: endDate.toLocaleDateString('en-CA'), // 'en-CA' format is 'yyyy/mm/dd'
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        };
    });
}

const formatTxtData = (data) => {
    console.log("==> INSIDE TXT PROCESSING <==");
    const lines = data.split('\n');
    return lines.map((line, index) => {
        line = line.replace(/\r/g, '').replace(/\s/g, '');
        const billingCycleStr = line.substring(0, 2);
        const billingCycle = parseInt(billingCycleStr);
        // console.log(billingCycle);
        if (isNaN(billingCycle) || billingCycle < 1 || billingCycle > 12) {
            throw new Error(`Invalid billing cycle at row ${index + 1}`);
        }
        const restOfLine = line.substring(2);
        const startDateStr = restOfLine.substring(0, restOfLine.length / 2);
        // console.log("start : " + startDateStr);
        const endDateStr = restOfLine.substring(restOfLine.length / 2);
        // console.log("end : " + endDateStr);
        // console.log('srtr' + startDateStr.length);
        // console.log('end' + endDateStr.length);
        if (startDateStr.length !== 8 || endDateStr.length !== 8) {
            throw new Error(`Invalid date format at row ${index + 1}`);
        }
        // const startDate = new Date(startDateStr.substring(4, 8), startDateStr.substring(0, 2) - 1, startDateStr.substring(2, 4));
        // const endDate = new Date(endDateStr.substring(4, 8), endDateStr.substring(0, 2) - 1, endDateStr.substring(2, 4));
        const startDate = adjustForTimezone(new Date(startDateStr.substring(4, 8), startDateStr.substring(0, 2) - 1, startDateStr.substring(2, 4)));
        const endDate = adjustForTimezone(new Date(endDateStr.substring(4, 8), endDateStr.substring(0, 2) - 1, endDateStr.substring(2, 4)));
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error(`Invalid date at row ${index + 1}`);
        }

        console.log(`QUERY`);
        console.log({
            billing_cycle: billingCycle,
            start_date: startDate,
            end_date: endDate
        });

        return {
            billing_cycle: billingCycle,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            // start_date: startDate.toLocaleDateString('en-CA'), // 'en-CA' format is 'yyyy/mm/dd'
            // end_date: endDate.toLocaleDateString('en-CA'), // 'en-CA' format is 'yyyy/mm/dd'
        };
    });
}

const readCsv = async (filePath) => {
    try {
        const data = await readFile(filePath, 'utf8');
        const records = formatCsvData(data);
        return records;
    } catch (error) {
        throw error;
    }
}

const readTxt = async (filePath) => {
    try {
        const data = await readFile(filePath, 'utf8');
        const records = formatTxtData(data);
        return records;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    readCsv,
    readTxt,
};