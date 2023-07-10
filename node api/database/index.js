const mysql = require("mysql");
// Localhost
const con = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "productdb",
  dateStrings: "date",
});

module.exports = con;
