import productController from "./controllers/productController";
import purchaseController from "./controllers/purchaseController";
import ticketController from "./controllers/ticketController";
import userController from "./controllers/userController";

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

const app = express();

// view engine setup
app.set("views", __dirname);
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userController);
app.use("/purchase", purchaseController);
app.use("/product", productController);
app.use("/ticket", ticketController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
