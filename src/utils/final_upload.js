const express = require('express');
const multer = require('multer');
const { readCsv, readTxt } = require('../utils/fileReader');
const Billing = require('../model/billing');
const router = express.Router();

require('../db/mongoose');

let fileName = '';

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'text/plain') {
        cb(null, true);
    } else {
        console.log('File is not supported for processing!');
        cb(new Error('File is not supported for processing!'), false);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload');
    },
    filename: function (req, file, cb) {
        fileName = file.originalname;
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

const formatDate = date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

router.post('/upload', upload.single('file'), async (req, res) => {
    console.log('File Uploaded Successfully!');

    let data;
    let errorMessage = '';

    if (req.file === undefined || req.file.size === 0) {
        console.log('No request(s) to read from the input file');
        return res.status(400).send({ error: 'No request(s) to read from the input file' });
    }

    if (req.file.mimetype === 'text/csv') {
        data = await readCsv(fileName, (err) => {
            if (err) {
                errorMessage = err.message;
            }
        });
    } else if (req.file.mimetype === 'text/plain') {
        data = await readTxt(fileName, (err) => {
            if (err) {
                errorMessage = err.message;
            }
        });
    }

    if (errorMessage) {
        console.log(errorMessage);
        return res.status(400).send({ error: errorMessage });
    }

    console.log('==> Data from uploaded file <==');
    const dataLog = data.map(entry => ({
        billing_cycle: entry.billing_cycle,
        start_date: formatDate(entry.start_date),
        end_date: formatDate(entry.end_date),
    }));

    console.log(dataLog);

    const billingEntries = [];

    for await (const billing of data) {
        try {
            const record = await Billing.findOne(billing);
            if (record) {
                const formattedBillingEntry = {
                    id: record._id,
                    billing_cycle: record.billing_cycle,
                    start_date: formatDate(record.start_date),
                    end_date: formatDate(record.end_date),
                    amount: record.amount,
                    account_name: record.account.account_name,
                    first_name: record.account.customer.first_name,
                    last_name: record.account.customer.last_name,

                };
                billingEntries.push(formattedBillingEntry)
                console.log('==> Query Log From Database <==');
                console.log(record);
            }
        } catch (error) {
            res.send({ error: error.message });
        }
    }

    if (!billingEntries || billingEntries.length === 0) {
        console.log('No record(s) to write to the output file. No Record Found!');
        res.send({ message: 'No Record Found!' });
    } else {
        console.log('==> Display Final Data <==');
        console.log('Successfully processed Request File');
        console.log(billingEntries);
        res.send({
            message: 'Successfully processed Request File',
            count: billingEntries.length,
            data: billingEntries
        });
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

module.exports = router;