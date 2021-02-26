import express from "express";
import computerRoutes from "./routes/computerRoutes";
import scanner from "./services/scanner";
const app = express();
const PORT = 4000;

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//
app.set("trust proxy", true);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

//root endpoint
app.get("/", async (req, res) => {
  const remoteIP = req.ip.replace("::ffff:", "");
  console.log(remoteIP);
  const Scanner = new scanner(remoteIP);
  const rcpStatus = await Scanner.checkRcp();
  const hostname = await Scanner.resolveHostname();

  const result = {
    ip: remoteIP,
    hostname: hostname.replace(/(\r\n|\n|\r)/gm, ""),
    rcpStatus: rcpStatus
  };
  res.send(result);
});

app.use(computerRoutes);
