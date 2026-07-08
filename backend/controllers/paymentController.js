import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
// import { getOrderDetails } from './orderControllers.js';
import Order from '../models/orderModel.js';


// Charger les variables d'environnement
dotenv.config({ path: path.resolve('./backend/config/config.env') });


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;



export const stripeCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  // Initialise Stripe avec la clé secrète stockée dans les variables d’environnement
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
   // Récupère les données envoyées dans le body de la requête
  const { orderItems, shippingInfo, itemsPrice } = req.body;

  // Crée les line items attendus par Stripe à partir des produits commandés
  const line_items = orderItems.map((item) => ({
     // Données de prix du produit
    price_data: {
      // Devise utilisée pour le paiement
      currency: "usd",
       // Informations du produit affichées sur la page Stripe
      product_data: {
        name: item.name, // Nom du produit
        images: [item.image],  // Image du produit (URL)
        metadata: { productId: item.product }, // ID du produit pour référence interne
      },
       // Prix unitaire en centimes (Stripe travaille en plus petite unité)
      unit_amount: item.price * 100,
    },
      // Quantité du produit commandé
    quantity: item.quantity,
  }));

  // Création d'une session Stripe Checkout
  const session = await stripe.checkout.sessions.create({
     // Définit les moyens de paiement autorisés (ici carte bancaire)
    payment_method_types: ["card"],
     // Liste des produits à payer (créée précédemment)
    line_items,
      // Type de paiement : "payment" = paiement unique (pas abonnement)
    mode: "payment",
      // Email du client (pré-rempli automatiquement sur la page Stripe)
    customer_email: req.user.email,
     // Identifiant interne de l'utilisateur
  // Sert à relier le paiement à l'utilisateur lors du traitement des webhooks
    client_reference_id: req.user._id.toString(), // userId pour webhook
    // success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
     // URL de redirection après paiement réussi
  // {CHECKOUT_SESSION_ID} est remplacé automatiquement par Stripe
     success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      // URL de redirection si le client annule le paiement
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
     // Métadonnées personnalisées stockées dans Stripe
  // Utiles pour retrouver les informations de commande via les webhooks
    metadata: {
      shippingInfo: JSON.stringify(shippingInfo),
      itemsPrice,
      orderItems: JSON.stringify(orderItems),
    },
  });

  res.status(200).json({ url: session.url });
});



// export const stripeWebhookHandler = async (req, res) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//   const sig = req.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.error("❌ Webhook Error:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     console.log("✅ Paiement terminé pour session :", session.id);

//     try {
//       const orderItems = JSON.parse(session.metadata.orderItems);
//       const shippingInfo = JSON.parse(session.metadata.shippingInfo);

//       const totalAmount = session.amount_total / 100;
//       const paymentInfo = {
//         id: session.payment_intent,
//         status: session.payment_status,
//       };

//       await Order.create({
//         user: session.client_reference_id, // Mongoose ObjectId
//         orderItems,
//         shippingInfo,
//         itemsPrice: session.metadata.itemsPrice,
//         taxAmount: 0, // à ajuster si tu calcules taxe
//         shippingAmount: 0, // à ajuster selon ta logique
//         totalAmount,
//         paymentMethod: "Card",
//         paymentInfo,
//       });

//       console.log("✅ Order créée en DB");
//     } catch (err) {
//       console.error("Erreur création order via webhook :", err.message);
//       return res.status(500).send("Erreur interne du serveur");
//     }
//   }

//   res.status(200).json({ received: true });
// };


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
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const orderItems = JSON.parse(session.metadata.orderItems);
      const shippingInfo = JSON.parse(session.metadata.shippingInfo);

      const orderData = {
        user: session.client_reference_id,
        orderItems,
        shippingInfo,
        itemsPrice: session.metadata.itemsPrice,
        taxAmount: 0,
        shippingAmount: 0,
        totalAmount: session.amount_total / 100,
        paymentMethod: "Card",
        paymentInfo: {
          id: session.payment_intent,
          status: session.payment_status,
        },
      };

      await Order.create(orderData);

      console.log("✅ Order créée :", session.id);
    } catch (err) {
      console.error("Erreur création order :", err.message);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  res.status(200).json({ received: true });
};
