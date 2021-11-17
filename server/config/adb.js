const pool = require('./db');
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

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err);
});


app.get('/api/get_char/:walletAdr', (req,res) => {

  async function main() {
    const mysql = require("mysql2/promise");

    const pool = mysql.createPool({
      host: '66.115.170.90',
      user: 'brandcur_roslayerDBuser',
      password: 'iijhlBNOz0LA',
      database: 'brandcur_roslayerDB',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    var response = [{success: false}];   // Response to be sent to frontend 
    var [resp] = await pool.query("SELECT 1");
    console.log("Res", res);

    var walletAdr = '0xAcD12ae8F8d0312e567C7Be02CB3D42734460939';
    var sql = "SELECT * FROM `char_reg_str` WHERE `value` = ?";
    var results;

    try {
      var [rows] = await pool.query(
        sql,
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
        response.push(options);

      } catch (err) {
        console.log("Error: " ,err)
      }
    }
      
    pool.end()
    res.json(response);
  }

  main();
});


app.post('/api/insert', (req,res) => {
  var data = req.body.data;
  // let rows;

  async function insertQuery(data) {

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
      (await pool).destroy();
      res.send({'success': true});
    } catch (err) {
      console.log("Error occurred during insert " + err);
      (await pool).destroy();
      res.send({'success': false});
    }
  }
});

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});