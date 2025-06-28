import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js"
import { stripeCheckoutSession} from "../controllers/paymentController.js";
import bodyParser from "body-parser"; // NE PAS utiliser express.json ici

const router = express.Router();

router.post("/payment/checkout_session", isAuthenticatedUser, stripeCheckoutSession);

// ⚠️ Cette route DOIT utiliser bodyParser.raw()
router.post(
  "/payment/webhook",
  bodyParser.raw({ type: 'application/json' }),

);

export default router;
