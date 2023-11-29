const fs = require('fs');
const readline = require('readline');

const readCsv = async (filePath, cb) => {
    console.log('==> INSIDE CSV PROCESSING <==');
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

            const data = line.split(',');

            const billingCycle = parseInt(data[0]);
            rowCount++;

            if (billingCycle < 1 || billingCycle > 12) {
                return cb(new Error('ERROR: Billing Cycle not on range at row ' + rowCount + '.'));
            }
            const startDate = dateFormatCsvTxt(data[1], filePath);
            const startDateformater = new Date(startDate);

            if (isNaN(startDateformater)) {
                return cb(new Error('ERROR: Invalid Start Date format at row ' + rowCount + '.'));
            }
            const endDate = dateFormatCsvTxt(data[2], filePath);
            const endDateformater = new Date(endDate);
            if (isNaN(endDateformater)) {
                return cb(new Error('ERROR: Invalid End Date format at row ' + rowCount + '.'));
            }

            fileData.push({
                'billing_cycle': billingCycle,
                'start_date': startDateformater,
                'end_date': endDateformater
            });
        }
        if (fileData === null || fileData.length === 0 || fileData === undefined) {
            return cb(new Error('No request(s) to read from the input file.'));
        } else {
            return fileData;
        }
    } catch (err) {
        cb(err)
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
                return cb(new Error('ERROR: Billing Cycle not on range at row ' + rowCount + '.'));
            }

            const startDate = dateFormatCsvTxt(line.substring(2, 10), filePath);
            const startDateformater = new Date(startDate);
            console.log("startdateform: " + startDateformater);
            if (isNaN(startDateformater)) {
                return cb(new Error('ERROR: Invalid Start Date format at row ' + rowCount + '.'));
            }

            const endDate = dateFormatCsvTxt(line.substring(10, 18), filePath);
            const endDateformater = new Date(endDate);
            if (isNaN(endDateformater)) {
                return cb(new Error('ERROR: Invalid End Date format at row ' + rowCount + '.'));
            }

            fileData.push({
                'billing_cycle': billingCycle,
                'start_date': startDateformater,
                'end_date': endDateformater
            });
        }

        if (fileData === null || fileData.length === 0 || fileData === undefined) {
            return cb(new Error('No request(s) to read from the input file.'));
        } else {
            return fileData;
        }
    } catch (err) {
        cb(err)
    }
}

const padZero = (num) => num.padStart(2, '0');

const formatCsvDate = (date) => {
    const [month, day, year] = date.split('/');
    return `${year}-${padZero(month)}-${padZero(day)}`;
};

const formatTxtDate = (date) => {
    const year = date.substring(4, 8);
    const month = padZero(date.substring(1, 2));
    const day = padZero(date.substring(2, 4));
    return `${year}-${month}-${day}`;
};

const dateFormatCsvTxt = (date, fileName) => {
    let fullDate;

    if (fileName.endsWith('.csv')) {
        fullDate = formatCsvDate(date);
    } else if (fileName.endsWith('.txt')) {
        fullDate = formatTxtDate(date);
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(fullDate) ? fullDate : ' ';
};


module.exports = { readCsv, readTxt };
