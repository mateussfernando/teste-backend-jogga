import { body, validationResult } from "express-validator";

export const validateLeadData = [
  body("nome").notEmpty().withMessage("Nome é obrigatório"),
  body("email").isEmail().withMessage("Email deve ser válido"),
  body("telefone").notEmpty().withMessage("Telefone é obrigatório"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
