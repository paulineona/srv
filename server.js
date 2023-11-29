const express = require('express');

const router = require('./src/utils/upload')

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

