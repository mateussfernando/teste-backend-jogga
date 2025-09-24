import express from "express";
import cors from "cors";
import {
  createLead,
  getLeads,
  getLeadsStats,
  getWhatsAppUrl,
  validateLeadData,
} from "./leadController.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.post("/api/leads", validateLeadData, createLead);
app.get("/api/leads/stats", getLeadsStats);
app.get("/api/leads", getLeads);
app.get("/api/whatsapp", getWhatsAppUrl);

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API Backend Leads funcionando!",
    version: "1.0.0",
    endpoints: [
      "POST /api/leads",
      "GET /api/leads",
      "GET /api/leads/stats",
      "GET /api/whatsapp",
    ],
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    message: `A rota ${req.method} ${req.path} não existe`,
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error("Erro no servidor:", error);
  res.status(500).json({
    error: "Erro interno do servidor",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
