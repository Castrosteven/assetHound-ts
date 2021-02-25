import express from "express";
import computerRoutes from "./routes/computerRoutes";
const app = express();
const PORT = 8000;

app.set("trust proxy", true);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.use(computerRoutes);
