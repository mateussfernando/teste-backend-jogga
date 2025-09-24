import express from "express";
import cors from "cors";
import leadRoutes from "./routes/leadRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);

app.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});
