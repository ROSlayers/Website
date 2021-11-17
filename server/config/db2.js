const { rollback } = require('./db');

(async () => {
  const [pool, mysql] = await require('./db');
  // console.log(pool);
  var walletAdr = '0xAcD12ae8F8d0312e567C7Be02CB3D42734460939';
  var charIDs = [];

  // Test query
  pool.query({
    sql: 'SELECT 1 + 1 AS SOLUTION',
    timeout: 500000,
    }, (err, results) => {
    if (err) {
      console.log('Error occurred during testing ', err)
      throw err;
    }
    console.log(results);
  });

  let sql, placeholders;
  pool.query(
    "SELECT * FROM char_reg_str WHERE value = ?",
    walletAdr,  
    function (err, results, fields) {
      if (err) throw err;
      charIDs = results.map(item => item.char_id);
      console.log('results: ', charIDs);
    
      charIDs = results.map(item => item.char_id);
      console.log("charIDs: ", charIDs);
      // console.log('esarr ', esarr);
      
      console.log("sql: ", sql);
      placeholders = charIDs.map(e =>'?').join(',');
      sql = `SELECT * FROM char WHERE char_id IN ( ${placeholders} )`;
      // sql = mysql.format(sql, charIDs);
      console.log('inQuery: ', sql);
    }
  );
  // charID = 150038;

  sql = sql;
  pool.query(//{
    sql,
    
    charIDs, 
  (err, results, fields) => {
      if (err) { 
        console.log("Error sql: ", sql);
        // console.log(msql.format)
        throw err;
      }
      // console.log('char_id', charID);
      // let options = [];
      //  = results[0];
      let options = results.map(item => ({ 
          char_id: item.char_id, 
          char_name: item.name 
        })  
      );
      console.log('Characters: ', options);
    }
  );

  /**/
  /*
  // Insert into db
  let formatDate = date => 
  `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  let data = {
    purchaseDate: formatDate(new Date()), //new Date('Y-m-d H:i:s'), //2001-03-10 15:35:03
    char_id: get_post_meta( $order->get_id(), 'charater-name', true ),
    name_id: 30008,
    redeemed: 0,
    redemption_date: formatDate(new Date())
  };

  pool.query(
    `INSERT INTO 'slyr_deposit' (nameid, quantity,char_id,redeemed,redemption_date,purchase_date) 
    VALUES ( ? )`,
    data,
    (err, results, fields) => {
      if (err) throw err;
      console.log('Inserted ' + results.affectedRows + 'rows');
    }
  )
  */

  pool.end();
})();

const pool1 = require('mysql2/promise').createPool({});

pool1.query('START TRANSACTION')
  .then(conn => {
    conn.quer
  })
/*
pool.getConnection()
  .then(conn => {
    return conn.query('START TRANSACTION'){
  conn.promise().query("")
  .then( ([rows,fields]) => {
    conn.promise().query("")
    .then( ([rows,fields]) => {

    })
    .catch(err => {
      console.log("")
    })
  })
  .catch(err => {
    return conn.rollback(() => {
      console.log("");
    });
  });
})
.catch(err => {
  console.log("Error");
})
*/