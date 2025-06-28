

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";
import Order from "../models/orderModel.js";

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

const getOrderItems = async (line_items) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Ajouté ici aussi si besoin
  const cartItems = await Promise.all(
    line_items.data.map(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      return {
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      };
    })
  );

  return cartItems;
};

