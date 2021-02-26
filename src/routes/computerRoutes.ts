import express from "express";
import scanner from "../services/scanner";
import addToDatabase from "../database/db";
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded());

router.use(bodyParser.json());

router.get("/computer", async (req, res) => {
  const ip =
    Object.keys(req.query).length === 0
      ? req.ip.replace("::ffff:", "")
      : req.query.host;
  const Scanner = new scanner(ip);
  const hostInfo = await Scanner.hostInfo();
  const osInfo = await Scanner.getOs();
  const hwInfo = await Scanner.getHw();
  const biosInfo = await Scanner.getBios();
  const networkInfo = await Scanner.getNetworkAdpaterInfo();

  const response = {
    hostInfo: hostInfo,
    osInfo: osInfo,
    hwInfo: hwInfo,
    biosInfo: biosInfo,
    networkInfo: networkInfo,
  };
  res.send(response);
});

router.get("/computer/os", async (req, res) => {
  const ip =
    Object.keys(req.query).length === 0
      ? req.ip.replace("::ffff:", "")
      : req.query.host;
  const Scanner = new scanner(ip);
  const osInfo = await Scanner.getOs();
  res.send(osInfo);
});

router.get("/computer/host", async (req, res) => {
  const ip =
    Object.keys(req.query).length === 0
      ? req.ip.replace("::ffff:", "")
      : req.query.host;

  const Scanner = new scanner(ip);
  const hostInfo = await Scanner.hostInfo();
  res.send(hostInfo);
});
router.get("/computer/hw", async (req, res) => {
  const ip =
    Object.keys(req.query).length === 0
      ? req.ip.replace("::ffff:", "")
      : req.query.host;

  const Scanner = new scanner(ip);
  const hwInfo = await Scanner.getHw();
  res.send(hwInfo);
});

router.get("/computer/bios", async (req, res) => {
  const ip =
    Object.keys(req.query).length === 0
      ? req.ip.replace("::ffff:", "")
      : req.query.host;

  const Scanner = new scanner(ip);
  const biosInfo = await Scanner.getBios();
  res.send(biosInfo);
});

router.get("/computer/net", async (req, res) => {
  const ip =
    Object.keys(req.query).length === 0
      ? req.ip.replace("::ffff:", "")
      : req.query.host;

  const Scanner = new scanner(ip);
  const networkInfo = await Scanner.getNetworkAdpaterInfo();
  res.send(networkInfo);
});

router.post("/computer/register", cors(), async (req, res) => {
  const ip =
    Object.keys(req.query).length === 0
      ? req.ip.replace("::ffff:", "")
      : req.query.host;
  const Scanner = new scanner(ip);
  console.log(req.body);
  const computerInfo = await Scanner.allInfo();
  const data = {
    ...computerInfo,
    cwid: req.body.cwid,
  };

  const response = await addToDatabase(data);

  res.send(response);
});

export default router;
