import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { getOrderDetails } from './orderControllers.js';
import Order from '../models/orderModel.js';


// Charger les variables d'environnement
dotenv.config({ path: path.resolve('./backend/config/config.env') });


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Supprimer cette ligne !
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session => /api/v1/payment/checkout_session 
// export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Stripe instancié au bon moment
//   console.log("Stripe key (checkout):", process.env.STRIPE_SECRET_KEY);

//   const body = req?.body;

//   const line_items = body?.orderItems?.map((item) => ({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: item?.name,
//         images: [item?.image],
//         metadata: { productId: item?.product },
//       },
//       unit_amount: item?.price * 100,
//     },
//     tax_rates: ["txr_1RUH0VRwCsWNJmL3ZnsZyCyW"],
//     quantity: item?.quantity,
//   }));

//   const shippingInfo = body?.shippingInfo;

//   const FREE_SHIPPING_RATE = "shr_1RUGnHRwCsWNJmL3LbBxeJvW";
//   const STANDARD_SHIPPING_RATE = "shr_1RUI9vRwCsWNJmL3A0iQUijz";
//   const shipping_rate = body?.itemsPrice >= 200 ? FREE_SHIPPING_RATE : STANDARD_SHIPPING_RATE;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     success_url: `${process.env.FRONTEND_URL}/me/orders`,
//     cancel_url: `${process.env.FRONTEND_URL}`,
//     customer_email: req?.user?.customer_email,
//     client_reference_id: req?.user?._id.toString(),
//     mode: "payment",
//     metadata: {
//       ...shippingInfo,
//       itemsPrice: body?.itemsPrice,
//     },
//     shipping_options: [{ shipping_rate }],
//     shipping_address_collection: {
//       allowed_countries: ["US", "CA", "FR"],
//     },
//     line_items,
//   });

//   res.status(200).json({
//     url: session.url,
//   });
// });

export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { orderItems, shippingInfo, itemsPrice } = req.body;

  // Crée les line items pour Stripe
  const line_items = orderItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image],
        metadata: { productId: item.product },
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(), // userId pour webhook
    // success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
     success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
    metadata: {
      shippingInfo: JSON.stringify(shippingInfo),
      itemsPrice,
      orderItems: JSON.stringify(orderItems),
    },
  });

  res.status(200).json({ url: session.url });
});

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // 🔐 Clé secrète Stripe



// export const stripeWebhookHandler = (req, res) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//   const sig = req.headers['stripe-signature'];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error('❌ Erreur webhook:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     console.log('✅ Paiement terminé pour session :', session.id);
//     // TODO: Ajoute ton traitement ici
//   }

//   res.status(200).json({ received: true });
// };

export const stripeWebhookHandler = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Paiement terminé pour session :", session.id);

    try {
      const orderItems = JSON.parse(session.metadata.orderItems);
      const shippingInfo = JSON.parse(session.metadata.shippingInfo);

      const totalAmount = session.amount_total / 100;
      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      await Order.create({
        user: session.client_reference_id, // Mongoose ObjectId
        orderItems,
        shippingInfo,
        itemsPrice: session.metadata.itemsPrice,
        taxAmount: 0, // à ajuster si tu calcules taxe
        shippingAmount: 0, // à ajuster selon ta logique
        totalAmount,
        paymentMethod: "Card",
        paymentInfo,
      });

      console.log("✅ Order créée en DB");
    } catch (err) {
      console.error("Erreur création order via webhook :", err.message);
      return res.status(500).send("Erreur interne du serveur");
    }
  }

  res.status(200).json({ received: true });
};


const getOrderItems = async (line_items) => {
  const cartItems = line_items.data.map((item) => {
    const product = item.price.product; // déjà un objet complet grâce à expand
    return {
      product: product.metadata.productId,
      name: product.name,
      price: item.price.unit_amount / 100,
      quantity: item.quantity,
      image: product.images[0],
    };
  });

  return cartItems;
};


// Create new order after payment => /api/v1/payment/webhook 

export const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(' Erreur webhook Stripe :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const line_items = await stripe.checkout.sessions.listLineItems(session.id);
      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id 

      const totalAmount = session.amount_total / 100
      const taxAmount = session.total_details.amount_tax / 100
      const shippingAmount = session.total_details.amount_shipping / 100
      const itemsPrice = session.metadata.itemsPrice

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
        
      };
      const paymentInfo = {
         id: session.payment_intent,
         status: session.payment_status,
      }

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: 'Card',
        user,
      }

      await Order.create(orderData)

      console.log("✅ Paiement terminé. Produits :", orderItems);

      // TODO: Créer une commande ici dans ta DB (ex: MongoDB)

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("Erreur pendant le traitement :", err.message);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  res.status(200).json({ received: true });
};
