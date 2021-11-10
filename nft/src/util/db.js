/**
 * Connection to remote Database
 */

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '66.115.170.90',
  user: 'brandcur_roslayerDBuser',
  password: 'iijhlBNOz0LA',
  database: 'brandcur_roslayerDB'
});

connection.connect((err) => {
  if(err) {
    console.error('error connecting ', err.stack);
    return;
  }

  console.log('connected as id ', connection.threadId);
});
/*
connection.query('SELECT 1 + 1 AS solution', function(error, result, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});
*/
connection.end();