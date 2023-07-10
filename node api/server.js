const express = require("express");
const app = express();
const routes = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");
const cors = require('cors');


app.use(cors())
app.listen(4000, () => {
  console.log("Server is runnig on 4000 port..");
});

app.use(express.json());

// to serve static file
app.use("/images", express.static(__dirname + "/uploads"));

// for parsing application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// register  routes...
app.use("/api", routes);

// global error handle middleware.
app.use(errorHandler);
