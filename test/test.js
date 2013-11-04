var toDoge = require('../'),
    fs = require('fs');

fs.readFile(process.argv[2], function(error, data){
    toDoge(data.toString(), function(error, doge){
        console.log(error || doge);
    });
});