var toDoge = require('../'),
    fs = require('fs');

fs.readFile(process.argv[2], function(error, data){
    console.log(toDoge(data.toString()));
});