const fs = require('fs');
const readline = require('readline');


const parseAndFormatDate = (dateString, filePath) => {
    const padZero = (num) => num.padStart(2, '0');

    let fullDate;
    if (filePath.endsWith('.csv')) {
        const [month, day, year] = dateString.split('/');
        fullDate = `${year}-${padZero(month)}-${padZero(day)}`;
    } else if (filePath.endsWith('.txt')) {
        const year = dateString.substring(4, 8);
        const month = padZero(dateString.substring(1, 2));
        const day = padZero(dateString.substring(2, 4));
        fullDate = `${year}-${month}-${day}`;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fullDate)) {
        fullDate = ' ';
    }

    return isNaN(Date.parse(fullDate)) ? null : fullDate;
};

const readCsv = async (filePath, cb) => {
    console.log('==> INSIDE CSV PROCESSING <==');

    if (!filePath) {
        cb(new Error('File Name is blank'));
        return;
    }

    const file = readline.createInterface({
        input: fs.createReadStream('./src/upload/' + filePath),
        console: false
    });

    let rowCount = 0;
    const fileData = [];

    try {
        console.log('File Name: ' + filePath);

        for await (const line of file) {
            const data = line.split(',');

            const billingCycle = parseInt(data[0]);
            rowCount++;

            if (billingCycle < 1 || billingCycle > 12) {
                throw new Error(`ERROR: Billing Cycle not on range at row ${rowCount}.`);
            }

            const startDate = parseAndFormatDate(data[1], filePath);
            if (!startDate) {
                throw new Error(`ERROR: Invalid Start Date format at row ${rowCount}.`);
            }

            const endDate = parseAndFormatDate(data[2], filePath);
            if (!endDate) {
                throw new Error(`ERROR: Invalid End Date format at row ${rowCount}.`);
            }

            fileData.push({
                'billing_cycle': billingCycle,
                'start_date': startDate,
                'end_date': endDate
            });
        }

        if (!fileData.length) {
            throw new Error('No request(s) to read from the input file.');
        }

        return fileData;
    } catch (err) {
        cb(err);
    }
}


const readTxt = async (filePath, cb) => {
    console.log('==> INSIDE TXT PROCESSING <==');
    if (filePath === '') {
        return new Error('File Name is blank');
    }

    const file = readline.createInterface({
        input: fs.createReadStream('./src/upload/' + filePath),
        console: false
    });

    let rowCount = 0;
    const fileData = [];

    try {
        console.log('File Name: ' + filePath);

        for await (const line of file) {
            const billingCycle = parseInt(line.substring(0, 2));
            rowCount++;

            if (billingCycle < 1 || billingCycle > 12) {
                throw new Error(`ERROR: Billing Cycle not on range at row ${rowCount}.`);
            }
            const startDate = parseAndFormatDate(line.substring(2, 10), filePath);
            if (!startDate) {
                throw new Error(`ERROR: Invalid Start Date format at row ${rowCount}.`);
            }

            const endDate = parseAndFormatDate(line.substring(10, 18), filePath);
            if (!endDate) {
                throw new Error(`ERROR: Invalid End Date format at row ${rowCount}.`);
            }

            fileData.push({
                'billing_cycle': billingCycle,
                'start_date': startDate,
                'end_date': endDate
            });
        }

        if (!fileData.length) {
            throw new Error('No request(s) to read from the input file.');
        }

        return fileData;
    } catch (err) {
        cb(err);
    }
}

module.exports = { readCsv, readTxt };
