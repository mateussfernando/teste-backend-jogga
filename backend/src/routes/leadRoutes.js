import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadsStats,
  getWhatsAppUrl,
} from "../controllers/leadController.js";
import {
  validateLeadData,
  handleValidationErrors,
} from "../middleware/validation.js";

const router = Router();

router.post("/", validateLeadData, handleValidationErrors, createLead);
router.get("/", getLeads);
router.get("/stats", getLeadsStats);
router.get("/whatsapp", getWhatsAppUrl);

export default router;
