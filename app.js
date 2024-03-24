require('dotenv').config();
const express = require('express');
const multer = require('multer');
const csvToJsonController = require('./controllers/csvToJson');
const { initTasks } = require('./initTasks');

const app = express();

initTasks();

// Max file size limit 100 mb
const upload = multer({ 
    dest: __dirname + '/uploads'
});

const PORT = process.env.PORT || 3000;

app.post('/csv-to-json', upload.single('file'), csvToJsonController.uploadValidator, csvToJsonController.csvFileToJsonConvertor);

app.use((err, req, res, next) => {
    console.log(err);
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(PORT);
console.log(`Server is listening on ${PORT}`);