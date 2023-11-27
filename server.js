const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/db/mongoose');
const BillingModel = require('./src/model/billing');
const router = require('./src/utils/upload')

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

