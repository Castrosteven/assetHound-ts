import express from "express";
import computerRoutes from "./routes/computerRoutes";
// rest of the code remains same
const app = express();
const PORT = 8000;

//
app.set("trust proxy", true);

//Return all information
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

app.use(computerRoutes);
