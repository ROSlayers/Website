const pool = require('./config/db');
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
// const conn = require("./config/db");
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err);
});


app.get("/", (req, res, next) => {
  // (async () => {
    // const [pool, mysql] = await require("./config/db");
    (async () => {
      try {
        var [rows] = await pool.query({
          sql: 'SELECT 1 + 1 AS Solution',
          timeout: 500000,
        });
        await pool.end();
        res.send(rows);
      } catch (err) {
        console.log('Error occurred during testing ', err);
        res.send("Error occurred");
      }
  })();
});


app.get('/api/get_char/:walletAdr', (req,res) => {

  async function main() {
    
    const walletAdr = req.params.walletAdr;
    var response = [{success: false}];   // Response to be sent to frontend 
    var [resp] = await pool.execute("SELECT 1");
    console.log("Res", res);

    //var walletAdr = '0xAcD12ae8F8d0312e567C7Be02CB3D42734460939';
    var query = "SELECT * FROM `char_reg_str` WHERE `value` = ?";
    var results;

    try {
      var [rows] = await pool.query(
        query,
        walletAdr
      );
      results = rows;
    } catch(err) {
      console.log("Error occured during 1st query", err);
    } 
    
    if(rows.length !== 0) {
      charIDs = rows.map(item => item.char_id);
      let placeholders = rows.map(e => '?').join(',');
      console.log('Placeholders: ' + placeholders);
      
      try {
        var [rows] = await pool.query(
          "SELECT * FROM `char` WHERE `char_id` IN ( " + placeholders+ " )",
          charIDs
        );
          
        let options = rows.map(item => ({
          char_id: item.char_id,
          char_name: item.name
        }));
  
        console.log("Options: " + Object.getOwnPropertyNames(options[0]));
        response[0].success = true;
        response.push({data: options});

      } catch (err) {
        console.log("Error: " ,err)
      }
    }
      
    // pool.end()
    res.json(response);
  }

  main();
});


app.post('/api/insert', (req,res,next) => {
  var data = req.body.data;
  // let rows;

  (async () => {

    const formatDate = date => {
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    data.redemption_date = formatDate(new Date());
    data.purchase_date = formatDate(new Date());

    var placeholders = data.map(e => '?').join(',');

    try {
      var [rows] = await pool.query(
        `INSERT INTO slyr_deposit (nameid,quantity,char_id,redeemed,redemption_date,purchase_date) VALUES ( ${placeholders} )`,
        data
      );
      await pool.end();
      res.send({'success': true});
    } catch (err) {
      console.log("Error occurred during insert " + err);
      await pool.end();
      res.send({'success': false});
    }
  })();
});

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});

/*
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const conn = require("./config/db");
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

// var pool, mysql;
//app.use(morgan('combined'));  // short, combined
/*
(async () => {
  [mysql, conn] = await require("./config/db");
  console.log
})();

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err);
});

app.get("/", (req, res, next) => {
  // (async () => {
    // const [pool, mysql] = await require("./config/db");
    conn.promise().query({
      sql: 'SHOW TABLES',
      timeout: 500000,
      })
    .then( ([rows, fields]) => {
      res.send(rows);
    })
    .catch(err => {
      console.log('Error occurred during testing ', err);
      res.send("Error occurred");
    });
    
    // res.send(rows);
    // })
  // })();
});


app.get("/api/get_char/:walletAdr", (req, res) => {
  const walletAdr = req.params.walletAdr;
  const query = 'SELECT * FROM `char_reg_str` WHERE `value` = ?';
  let charIDs = [];
  let options, rows;
  console.log('walletAdr ', walletAdr);

  conn.promise().beginTransaction(err => {
    // if (err) throw err;

    conn.promise().query(
      "SELECT * FROM char_reg_str WHERE value = ?",
      walletAdr, 
      (err, results, fields) => {
        if (err) {
          console.log("First query failed");
          return conn.rollback(() => {
            throw err;
          });
        }

        if(results.length===0) {
          return conn.rollback(() => {
            console.log('First query returned empty results');
            res.send([]);
          });
        }
        console.log('results ', results);
        
        charIDs = results.map(item => item.char_id);
        console.log('char_ids ', charIDs);
        let escaped = conn.escape("hello '--");
        
        let placeholders = results.map(e => '?').join(',');
        var query = `SELECT * FROM char WHERE char_id IN (${placeholders})`;
        query = mysql.format(query);
        // var query = `SELECT * FROM char WHERE char_id IN ( ${conn.escape(charIDs)} )`;

        var query = conn.query(
          "SELECT * FROM `char` WHERE `char_id` IN ( " + placeholders+ " )",
          charIDs,
          (err, results, fields) => {
            if (err) { 
              return conn.rollback(() => { 
                throw err;
              });
            }
            conn.commit(err => {
              if(err) {
                return conn.rollback(() => {
                  throw err;
                });
              }
              
              console.log('Results: ' + results + results.length);
              let options = results.map(item => ({
                char_id: item.char_id,
                char_name: item.name
              }));
              console.log('success ', options);
              res.send(options)
            });
            
            // res.send(options);
          }
        );
        console.log('query: ' + query.sql);
      }
    )
    .then( ([rows,fields]) => {

    })
    .catch(err => {
      return conn.rollback(() => {
        console.log("Rollback function");
      });
    });
  })
  .catch(err => {
    console.log("Unable to begin transaction", err);
  });  
});


app.post('/api/insert', (req,res) => {
  const data = req.body.data;
  let rows;

  // Date Format('Y-m-d H:i:s'),  e.g.: 2001-03-10 15:35:03
  const formatDate = date => {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  data.redemption_date = formatDate(new Date());
  data.purchase_date = formatDate(new Date());  
  
  let placeholders = data.map(e => '?').join(',');
  conn.query(
    "INSERT INTO `slyr_deposit` (`nameid`, `quantity`,`char_id`,`redeemed`,`redemption_date`,`purchase_date`) VALUES ( " + placeholders +" )",
    data,
    (err, results, fields) => {
      if (err) throw err;
      console.log('Inserted ' + results.affectedRows + 'rows');
      rows = results;
    }
  );
  conn.end(err => {
    console.log('conn is terminated now');
  });

  res.send(rows);
});


app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
})
*/