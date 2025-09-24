// validações para dados de lead
import { body, validationResult } from "express-validator";

// validação para criação de lead
export const validateLeadData = [
  body("nome").notEmpty().withMessage("Nome é obrigatório"),
  body("email").isEmail().withMessage("Email deve ser válido"),
  body("telefone").notEmpty().withMessage("Telefone é obrigatório"),
];

export const validateStatusUpdate = [
  body("status")
    .isIn(["NOVO", "EM_CONTATO", "CONVERTIDO"])
    .withMessage("Status deve ser: NOVO, EM_CONTATO ou CONVERTIDO"),
];

// middleware para tratar erros de validação
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
