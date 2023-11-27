const express = require('express');
const multer = require('multer');
const BillingModel = require('../model/billing');
require('../db/mongoose');

const router = express.Router();
const { readCsv, readTxt } = require('./fileReader');

const formatDate = date => new Date(date).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

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
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', upload.single('upload'), async (req, res) => {

    let data;

    if (req.file === undefined || req.file.size === 0) {
        console.log('No request(s) to be read from the input file!');
        return res.status(400).send({ error: 'No request(s) to be read from the input file!' });
    }

    try {

        if (req.file.mimetype === 'text/csv') {
            data = await readCsv(req.file.path);
        } else if (req.file.mimetype === 'text/plain') {
            data = await readTxt(req.file.path);
        } else {
            return res.status(400).send({ error: 'Unsupported file type' });
        }

        // console.log('File contents:', data);
        // res.status(200).send({ message: 'File uploaded successfully!', fileContents: data });

    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).send({ error: error.message });
    }

    let billingEntries = [];

    for (const record of data) {
        try {
            let billingEntry = await BillingModel.findOne({
                start_date: record.start_date,
                end_date: record.end_date,
            }).select('id billing_cycle start_date end_date amount account.account_name account.customer.first_name account.customer.last_name');

            if (!billingEntry) {

                billingEntry = new BillingModel({
                    billing_cycle: record.billing_cycle,
                    start_date: record.start_date,
                    end_date: record.end_date,
                    amount: record.amount,
                    account: {
                        account_name: record.account.account_name,
                        customer: {
                            first_name: record.account.customer.first_name,
                            last_name: record.account.customer.last_name,
                        }
                    }
                });

                await billingEntry.save();
            }

            // billingEntry = billingEntry.toObject();
            // billingEntry.start_date = formatDate(billingEntry.start_date);
            // billingEntry.end_date = formatDate(billingEntry.end_date);
            // billingEntry.account_name = billingEntry.account.account_name;
            // billingEntry.first_name = billingEntry.account.customer.first_name;
            // billingEntry.last_name = billingEntry.account.customer.last_name;

            // delete billingEntry.account;

            // billingEntries.push(billingEntry);

            const formattedBillingEntry = {
                id: billingEntry._id,
                billing_cycle: billingEntry.billing_cycle,
                start_date: formatDate(billingEntry.start_date),
                end_date: formatDate(billingEntry.end_date),
                amount: billingEntry.amount,
                account_name: billingEntry.account.account_name,
                first_name: billingEntry.account.customer.first_name,
                last_name: billingEntry.account.customer.last_name,
            };

            billingEntries.push(formattedBillingEntry);

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).send({ error: error.message });
        }
    }

    console.log({ Message: 'Successfully processed Request File!', Requests: billingEntries });
    res.status(200).send({ Message: 'Successfully processed Request File', Request: billingEntries });

}, (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
});


module.exports = router;