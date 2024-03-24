const csvParser = require('../lib/csvParser');
const csvToJson = require('../lib/csvToJson');
const { User } = require('../models/users');
const fsPromises = require('fs/promises');
const sequelize = require('../lib/sequelize');
const { QueryTypes } = require('sequelize');

// Max file size is 100 mb
const maxFileSize = 100 * 1024 * 1024;
const requiredFields = new Set(['name', 'age', 'address']);

function prepareRowForInsertion(row) {
    const address = row['address'] ? row['address'] : null;
    const result = {
        name: row['name']['firstName'] + ' ' + row['name']['lastName'],
        age: row['age'],
        address: address,
        additional_info: {}
    };
    for(let k in row) {
        if(!requiredFields.has(k)) result['additional_info'][k] = row[k];
    }
    result['additional_info'] = result['additional_info'];
    return result;
}

function prepareRowsForInsertion(rows) {
    let result = [];
    for(let r of rows) {
        result.push(prepareRowForInsertion(r));
    }
    return result;
}

/**
 * Generates report for percentage for age groups(less than 20, 20-40, 40-60, greater than 60, print the report on the console)
 * @returns {void}
 */
async function generateReport() {
    try {
        const labels = {
            "less_than_20": "< 20",
            "20_to_40": "20-40",
            "40_to_60": "40-60",
            "greater_than_60": "> 60"
        }
        const query = `
        SELECT 
        COUNT(IF(age < 20, 1, NULL)) AS 'less_than_20',
        COUNT(IF(age >= 20 AND age < 40, 1, NULL)) AS '20_to_40',
        COUNT(IF(age >= 40 AND age <= 60, 1, NULL)) AS '40_to_60',
        COUNT(IF(age > 60, 1, NULL)) AS 'greater_than_60',
        COUNT(*) AS total
        FROM users`;
        const [ageReport] = await sequelize.query(query, { type: QueryTypes.SELECT });
        const tableToPrint = [];
        for(let k in ageReport) {
            if(k != 'total') {
                let percentage = (ageReport[k]/ageReport['total']) * 100;
                tableToPrint.push({ "Age-Group": labels[k], "% Distribution": percentage });
            }
        }
        console.table(tableToPrint);
    }
    catch(err) {
        console.log(err);
        return [];
    }
}

module.exports = {
    csvFileToJsonConvertor: async (req, res, next) => {
        try {
            const records = await csvParser.parseCSVFile(req.file.path);
            const jsonResult = csvToJson.convertCsvToJson(records);
            await User.bulkCreate(prepareRowsForInsertion(jsonResult));
            await fsPromises.rm(req.file.path);
            await generateReport();
            return res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
        }
    },
    uploadValidator: async (req, res, next) => {
        try {
            console.log(req.file);
            if(!req.file) return res.status(400).send('File is missing');
            if(req.file.size > maxFileSize) return res.status(400).send('Only files upto 100 mb are allowed');
            if(req.file.mimetype != 'text/csv') return res.status(400).send('Only csv files are supported');
            next();
        }
        catch(err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }
}