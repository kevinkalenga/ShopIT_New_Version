import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { stripeCheckoutSession, stripeWebhookHandler } from "../controllers/paymentController.js";
import bodyParser from "body-parser"; // NE PAS utiliser express.json ici

const router = express.Router();

// Checkout session route (authentifiée)
router.post("/payment/checkout_session", isAuthenticatedUser, stripeCheckoutSession);

// Webhook Stripe (⚠️ sans authentification, avec bodyParser.raw)
router.post(
  "/payment/webhook",
  bodyParser.raw({ type: 'application/json' }),
  stripeWebhookHandler
);

export default router;

