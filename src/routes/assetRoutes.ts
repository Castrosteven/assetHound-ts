import express from "express";
const router = express.Router();

router.get("/assets/", async (req, res) => {
    res.send([{}]);
  });