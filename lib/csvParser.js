const fs = require('fs');
const readLine = require('readline');

/**
 * Reads CSV file from the path and returns array of objects where each object represent a row from csv file whose keys are column names and values are the column values from the csv file
 * @param {string} filePath Path for the csv file
 * @returns {Promise<Array<object>>}
 */
function parseCSVFile(filePath) {
    try {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);
            const readlineInterface = readLine.createInterface({ input: stream });
            const result = [];
            
            // Runs on each new line
            readlineInterface.on('line', (line) => {
                const row = line.split(',');
                result.push(row.map((r) => r.trim()));
            });

            // Done reading the file
            readlineInterface.on('close', () => {
                resolve(result);
            });

            // Some error occured while reading
            readlineInterface.on('error', (err) => {
                reject(err);
            });
        });
    }
    catch(err) {
        console.log(err);
        return [];
    }
}

module.exports = { parseCSVFile };