import { config } from "dotenv";
import express from "express";
import morgan from "morgan";

// populate the variables
config();

const app = express();

app.set("view engine", "pug");
app.set("views", "./src/views");

function morganMiddleware() {
  if (process.env.NODE_ENV === "production") {
    return morgan("combined");
  } else {
    return morgan("dev");
  }
}

app.use(morganMiddleware());

app.get("/", (_req, res) => {
  return res.render("hello", { timestamp: new Date().toDateString() });
});

// this route gives the user a random number
// but the user has to give the min and max query params
app.get("/random-no", (req, res) => {
  const { min: _min, max: _max } = req.query;

  if (_min instanceof Array || !_min) {
    return res.status(400).json({ error: "invalid minimum value" });
  }

  if (_max instanceof Array || !_max) {
    return res.status(400).json({ error: "invalid maximum value" });
  }

  const min = +_min;
  const max = +_max;

  const rand = Math.round(Math.random() * (max - min) + min);
  return res.json({ number: rand });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Express server started at port ${port}`);
});
