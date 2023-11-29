const fs = require('fs');
const readline = require('readline');

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

            console.log("WHOLE DATAAA: " + data);

            const billingCycle = parseInt(data[0]);
            rowCount++;

            if (billingCycle < 1 || billingCycle > 12) {
                throw new Error(`ERROR: Billing Cycle not on range at row ${rowCount}.`);
            }

            const startDate = parseDate(data[1], filePath);
            if (!startDate) {
                throw new Error(`ERROR: Invalid Start Date format at row ${rowCount}.`);
            }

            const endDate = parseDate(data[2], filePath);
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

            const startDate = parseDate(line.substring(2, 10), filePath);
            if (!startDate) {
                throw new Error(`ERROR: Invalid Start Date format at row ${rowCount}.`);
            }

            const endDate = parseDate(line.substring(10, 18), filePath);
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


const parseDate = (dateString, filePath) => {
    const date = dateFormatCsvTxt(dateString, filePath);
    const dateObject = new Date(date);
    return isNaN(dateObject) ? null : dateObject;
};

const padZero = (num) => num.padStart(2, '0');

const formatCsvDate = (date) => {
    const [month, day, year] = date.split('/');
    return `${year}-${padZero(month)}-${padZero(day)}`;
};

const formatTxtDate = (date) => {
    const year = date.substring(4, 8);
    console.log("year: " + year);
    const month = padZero(date.substring(1, 2));
    console.log("month: " + month);
    const day = padZero(date.substring(2, 4));
    console.log("date: " + day);
    return `${year}-${month}-${day}`;
};

const dateFormatCsvTxt = (date, fileName) => {
    let fullDate;

    if (fileName.endsWith('.csv')) {
        fullDate = formatCsvDate(date);
    } else if (fileName.endsWith('.txt')) {
        fullDate = formatTxtDate(date);
        console.log("FULLDATE: " + fullDate);
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(fullDate) ? fullDate : ' ';
};


module.exports = { readCsv, readTxt };
