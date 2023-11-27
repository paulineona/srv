const express = require('express');
const multer = require('multer');
require('../db/mongoose');

const router = express.Router();
const { readCsv, readTxt } = require('./fileReader');



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

    if (req.file === undefined || req.file.size === 0) {
        console.log('No request(s) to be read from the input file!');
        return res.status(400).send({ error: 'No request(s) to be read from the input file!' });
    }

    try {
        let data;
        if (req.file.mimetype === 'text/csv') {
            data = await readCsv(req.file.path);
        } else if (req.file.mimetype === 'text/plain') {
            data = await readTxt(req.file.path);
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