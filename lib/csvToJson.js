/**
 * 
 * @param {Array<Array<string>>} csv Array of arrays of csv rows first element in this array respresent columns
 * @example
 * ['name', 'age']
 * ['john doe', 30]
 * ['jane doe', 25]
 * @returns {Promise<Array<object>>} Array of objects where each object is json conversion of csv row form the input csv records list
 * @example
 * { "name": "john doe", "age": 30 }
 * { "name": "jane doe", "age": 25 }
 */
function convertCsvToJson(csv) {
    try {
        if(csv.length <= 1) return [];
        let columns = csv[0];
        // Each column maps to a propety in output json, there might be nested json paths
        const jsonPropertyPaths = convertDotNotationsToArrays(columns);
        let lastIndex = csv.length - 1;
        const result = [];
        for(let i = 1; i <= lastIndex; i++) {
            let row = csv[i];
            let jsonObj = convertCsvRowToJsonObj(columns, row, jsonPropertyPaths);
            result.push(jsonObj);
        }
        return result;
    }
    catch(err) {
        console.log(err);
        return [];
    }
}

/**
 * 
 * @param {array<string>} columns Array of columns from csv file
 * @example ['name', 'age', 'address.line1', 'address.line2']
 * @returns {array<array<string>>} Array of arrays of strings, it convert dot notation path to arrays
 * @example [['name'], ['age'], ['address', 'line1'], ['address', 'line2']]
 */
function convertDotNotationsToArrays(columns) {
    try {
        let result = [];
        for(let c of columns) {
            result.push(c.split('.'));
        }
        return result;
    }
    catch(err) {
        console.log(err);
        return [];
    }
}

/**
 * 
 * @param {Array<str>} csvColumns
 * @example ['name', 'age', 'address.line1', 'address.line2'] 
 * @param {Array} csvRow
 * @example ['john doe', 32, 'california', 'us']
 * @param {Array<Array<str>>>} jsonPropertyPaths
 * @example [['name'], ['age'], ['address', 'line1'], ['address', 'line2']]
 * @returns {object}
 * @example { "name": "john doe", "age": 32, "address": { "line1": "california", "line2": "us" } }
 */
function convertCsvRowToJsonObj(csvColumns, csvRow, jsonPropertyPaths) {
    try {
        let result = {};
        for(let i = 0; i < csvColumns.length; i++) {
            if(jsonPropertyPaths[i].length == 1) {
                // For paths that are not nested
                result[csvColumns[i]] = csvRow[i];
            }
            else {
                // For paths that are nested, a.b.c.d.e
                let value = csvRow[i];
                let path = jsonPropertyPaths[i];
                let propertyName = path[path.length - 1];
                let curr = result;
                for(let j = 0; j < path.length - 1; j++) {
                    // Getting the path to set the value, if a part of path is not present it will be created
                    // If path is a.b.c.d.e and value to set is 100, then we go to path a.b.c.d in this loop and also ensures that this path exists
                    let currPropertyName = path[j];
                    if(!curr.hasOwnProperty(currPropertyName)) curr[currPropertyName] = {};
                    curr = curr[currPropertyName];
                }
                // After loop exists we have handle to a.b.c.d if path is a.b.c.d.e, then we set e property of it with the desired value
                curr[propertyName] = value;
            }
        }
        return result;
    }
    catch(err) {
        console.log(err);
        return {};
    }
}

module.exports = { convertCsvToJson };