import express from "express";
import cors from "cors";
import {
  createLead,
  getLeads,
  getLeadsStats,
} from "./controllers/leadsController.js";

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());


// rotas de leads
app.post("/api/leads", createLead);
app.get("/api/leads", getLeads);
app.get("/api/leads/stats", getLeadsStats);

// rota não encontrada
app.use("*", (req, res) => {
  res.status(404).json({ error: "endpoint não encontrado" });
});

// middleware de erro global
app.use((error, req, res, next) => {
  console.error("erro interno:", error);
  res.status(500).json({ error: "erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
