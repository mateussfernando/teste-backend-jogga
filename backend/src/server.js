// configuração do servidor express
import express from "express";
import cors from "cors";
import leadRoutes from "./routes/leadRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(cors());
app.use(express.json());

// rotas
app.use("/api/leads", leadRoutes);

// iniciar servidor
app.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});
