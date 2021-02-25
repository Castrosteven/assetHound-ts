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
app.get("/computer/os", async (req, res) => {
  const ip = req.ip.replace("::ffff:", "");
  const Scanner = new scanner(ip);
  const osInfo = await Scanner.getOs();
  res.send(osInfo);
});
