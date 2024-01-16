import express from "express";
import { client } from "./utils/db.js";
import questionRouter from "./apps/questions.js";

async function init() {
  try {
    await client.connect();
  } catch {
    console.log("Cannot connect database");
  }
  const app = express();
  const port = 4000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/questions", questionRouter);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
