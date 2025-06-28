import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";


// Charger les variables d'environnement
dotenv.config({ path: path.resolve('./backend/config/config.env') });


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Supprimer cette ligne !
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session => /api/v1/payment/checkout_session 
export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Stripe instancié au bon moment
  console.log("Stripe key (checkout):", process.env.STRIPE_SECRET_KEY);

  const body = req?.body;

  const line_items = body?.orderItems?.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item?.name,
        images: [item?.image],
        metadata: { productId: item?.product },
      },
      unit_amount: item?.price * 100,
    },
    tax_rates: ["txr_1RUH0VRwCsWNJmL3ZnsZyCyW"],
    quantity: item?.quantity,
  }));

  const shippingInfo = body?.shippingInfo;

  const FREE_SHIPPING_RATE = "shr_1RUGnHRwCsWNJmL3LbBxeJvW";
  const STANDARD_SHIPPING_RATE = "shr_1RUI9vRwCsWNJmL3A0iQUijz";
  const shipping_rate = body?.itemsPrice >= 200 ? FREE_SHIPPING_RATE : STANDARD_SHIPPING_RATE;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/me/orders`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    customer_email: req?.user?.customer_email,
    client_reference_id: req?.user?._id.toString(),
    mode: "payment",
    metadata: {
      ...shippingInfo,
      itemsPrice: body?.itemsPrice,
    },
    shipping_options: [{ shipping_rate }],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "FR"],
    },
    line_items,
  });

  res.status(200).json({
    url: session.url,
  });
});

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // 🔐 Clé secrète Stripe



export const stripeWebhookHandler = (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Erreur webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('✅ Paiement terminé pour session :', session.id);
    // TODO: Ajoute ton traitement ici
  }

  res.status(200).json({ received: true });
};