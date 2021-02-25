import express from "express";
import scanner from "./services/scanner";
// rest of the code remains same
const app = express();
const PORT = 8000;

//
app.set("trust proxy", true);

//Return all information
app.get("/computer", (req, res) => res.send("Express + TypeScript Server"));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

//Return OS Information
// Object || string
app.get("/computer/os", async (req, res) => {
  const ip = req.ip.replace("::ffff:", "");
  const Scanner = new scanner(ip);
  const osInfo = await Scanner.getOs();
  res.send(osInfo);
});

app.get("/computer/hw", async (req, res) => {
  const ip = req.ip.replace("::ffff:", "");
  const Scanner = new scanner(ip);
  const hwInfo = await Scanner.getHw();
  res.send(hwInfo);
});

app.get("/computer/bios", async (req, res) => {
  const ip = req.ip.replace("::ffff:", "");
  const Scanner = new scanner(ip);
  const biosInfo = await Scanner.getBios();
  res.send(biosInfo);
});

app.get("/computer/net", async (req, res) => {
  const ip = req.ip.replace("::ffff:", "");
  const Scanner = new scanner(ip);
  const networkInfo = await Scanner.getNetworkAdpaterInfo();
  res.send(networkInfo);
});
