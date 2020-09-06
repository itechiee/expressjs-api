var fs = require('fs');

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
        }
        else {
            callback(null, html);
        }
    });
};
module.exports = {
    readHTMLFile
}

// module.exports = readHTMLFile;