import express from "express";
import dotenv from "dotenv";

dotenv.config();

export default function web() {
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("Hello from the backend server adsfasdf!");
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}
