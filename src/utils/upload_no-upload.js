const express = require('express');
const multer = require('multer');
require('../db/mongoose');

const router = express.Router();
const { readCsv, readTxt } = require('./fileReader');
let fileName = '';

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'text/plain') {
        cb(null, true);
    } else {
        console.log('File is not supported for processing!');
        cb(new Error('File is not supported for processing!'), false);
    }
}



const upload = multer({ storage: multer.memoryStorage(), fileFilter: fileFilter });

router.post('/upload', upload.single('upload'), async (req, res) => {

    if (req.file === undefined || req.file.size === 0) {
        console.log('No request to be read from the input file!');
        return res.status(400).send({ error: 'No request to be read from the input file!' });
    }

    console.log('File name:', req.file.originalname);
    const fileContents = req.file.buffer.toString('utf8');
    console.log('File contents:\n', fileContents);

    try {
        let data;
        if (req.file.mimetype === 'text/csv') {
            data = await readCsv(fileContents);
        } else if (req.file.mimetype === 'text/plain') {
            data = await readTxt(fileContents);
        } else {
            return res.status(400).send({ error: 'Unsupported file type' });
        }

        console.log('File contents:', data);
        res.status(200).send({ message: 'File uploaded successfully!', fileContents: data });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send({ error: 'Error processing file' });
    }


}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});


module.exports = router;