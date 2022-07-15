const PORT = process.argv[2] || 5000;

const express = require("express"),
  session = require("express-session");

const app = express();

app.set("view engine", "ejs");

const viewsRouter = require("./routes/views"),
  UploadRouter = require("./routes/upload"),
  apiRouter = require("./routes/api");

app.use(
  session({
    secret: "keyforvalidation",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/upload", UploadRouter);
app.use("/api", apiRouter);
app.use("/", viewsRouter);

app.listen(PORT, (err) => {
  if (!err) console.log(`Server Running on Port: ${PORT}`);
  else throw err;
});
