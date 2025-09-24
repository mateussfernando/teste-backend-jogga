import express from "express";
import cors from "cors";
import leadRoutes from "./leadController.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// endopoint para leads
app.use("/api/leads", leadRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
