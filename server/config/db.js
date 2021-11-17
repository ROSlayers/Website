/**
 * connection to remote Database
 */
// async function main() {
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    host: '66.115.170.90',
    user: 'brandcur_roslayerDBuser',
    password: 'iijhlBNOz0LA',
    database: 'brandcur_roslayerDB'
  });
//   console.log(connection);
  // return connection;
// }
/*
connection.connect((err) => {
  if(err) {
    console.error('error connecting ', err.stack);
    return;
  }

  console.log('connected as id ', connection.threadId);
});
*/
module.exports = pool;
