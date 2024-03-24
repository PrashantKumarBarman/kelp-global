const fs = require('fs');

function initTasks() {
    try {
        const path = __dirname + '/uploads'
        if(!fs.existsSync(path)) fs.mkdirSync(path);
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = { initTasks };