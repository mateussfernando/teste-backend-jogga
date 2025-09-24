import express from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const router = express.Router();
const prisma = new PrismaClient();

// Validações do formulário
const validateLead = [
  body("nome").notEmpty().withMessage("Nome é obrigatório"),
  body("email").isEmail().withMessage("Email inválido"),
  body("telefone").notEmpty().withMessage("Telefone é obrigatório"),
];

// POST /api/leads - Cadastrar novo lead
router.post("/", validateLead, async (req, res) => {
  try {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, telefone } = req.body;

    // Verifica se já existe lead com mesmo email nos últimos 60 minutos
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const existingLead = await prisma.lead.findFirst({
      where: {
        email: email,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (existingLead) {
      return res.status(400).json({
        error: "Já existe um lead com este email cadastrado na última hora",
      });
    }

    // Cria o novo lead
    const newLead = await prisma.lead.create({
      data: {
        nome,
        email,
        telefone,
      },
    });

    res.status(201).json({
      message: "Lead cadastrado com sucesso!",
      lead: newLead,
    });
  } catch (error) {
    console.error("Erro ao cadastrar lead:", error);

    if (error.code === "P2002") {
      // Erro de email único do Prisma
      return res.status(400).json({
        error: "Este email já está cadastrado no sistema",
      });
    }

    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/", async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar leads" });
  }
});

export default router;
