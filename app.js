var mysql = require('mysql')
var connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'world'
});

connection.connect()

connection.query('SELECT * FROM city LIMIT 10',function(error,results,fields){
    if(error) throw error;
    console.log(results)
})
