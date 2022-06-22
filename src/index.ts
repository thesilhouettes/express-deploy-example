import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import { DataSource } from "typeorm";
import { RandomNumbers } from "./models/RandomNumber";

const main = async () => {
  // populate the variables
  config();

  console.log("Received values: ");
  console.log(
    `DB_NAME: ${process.env.DB_NAME}\nDB_USERNAME: ${process.env.DB_USERNAME}\nDB_PORT: ${process.env.DB_PORT}\nDB_PASSWORD: ${process.env.DB_PASSWORD}\nDB_HOST: ${process.env.DB_HOST}`
  );

  const conn = new DataSource({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD,
    type: "postgres",
    entities: [RandomNumbers],
    synchronize: true,
    logging: true,
  });
  await conn.initialize();

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
  app.get("/random-no", async (req, res) => {
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
    // persist in database
    await RandomNumbers.save({
      generated: rand,
    });
    return res.json({ number: rand });
  });

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Express server started at port ${port}`);
  });
};

main();
