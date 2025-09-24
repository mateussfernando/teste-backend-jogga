import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadsStats,
  getWhatsAppUrl,
  updateLeadStatus,
} from "../controllers/leadController.js";
import {
  validateLeadData,
  validateStatusUpdate,
  handleValidationErrors,
} from "../middleware/validation.js";

const router = Router();

router.post("/", validateLeadData, handleValidationErrors, createLead);
router.get("/", getLeads);
router.get("/stats", getLeadsStats);
router.get("/whatsapp", getWhatsAppUrl);
router.put(
  "/:id/status",
  validateStatusUpdate,
  handleValidationErrors,
  updateLeadStatus
);

export default router;
