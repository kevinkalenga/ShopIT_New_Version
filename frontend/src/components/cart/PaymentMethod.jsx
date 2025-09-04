import MetaData from "../layout/MetaData"
import { useSelector } from "react-redux"
import CheckoutSteps from "./CheckoutSteps"
import { useEffect, useState } from "react"
import { calculateOrderCost } from "../../helpers/helpers"
 import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation} from "../../redux/api/orderApi"
 import {toast} from 'react-hot-toast'
 import { useNavigate } from "react-router-dom"

const PaymentMethod = () => {
  
   const [method, setMethod] = useState("") 
   
   const {shippingInfo, cartItems} = useSelector((state) => state.cart) 

    const [createNewOrder, {error, isSuccess}] = useCreateNewOrderMutation()
    const [stripeCheckoutSession, {data: checkoutData, error: checkoutError, isLoading}] = useStripeCheckoutSessionMutation() 
    
   
    const navigate = useNavigate()
   
    
      useEffect(() => {
      if(checkoutData) {
       window.location.href = checkoutData?.url
      }

      if(checkoutError) {
          toast.error(checkoutError?.data?.message)
      }
    }, [checkoutData, checkoutError])
    
    
    useEffect(() => {
      if(error) {
        toast.error(error?.data?.message)
      }

      if(isSuccess) {
        // navigate("/")
        navigate("/me/orders?order_success=true")
      }
    }, [error, isSuccess, navigate])


    const submitHandler = (e) => {
  e.preventDefault();

    if (!method) {
    toast.error("Merci de sélectionner une méthode de paiement.");
    return;
  }
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderCost(cartItems);

  // Toujours formater correctement les items
  // const orderItems = cartItems.map((item) => ({
  //   name: item.name,
  //   quantity: item.quantity,
  //   image: item.image,
  //   price: item.price,
  //   product: item.product || item._id,

  // }));


  const orderItems = cartItems.map((item, index) => {
  const productId = item.product || item._id;

  if (!productId) {
    console.warn(`⚠️ Aucun product ID trouvé pour cartItem[${index}] :`, item);
  } else {
    console.log(`✅ cartItem[${index}] - product ID :`, productId);
  }

  return {
    name: item.name,
    quantity: item.quantity,
    image: item.image,
    price: item.price,
    product: productId,
  };
});


  if (method === "COD") {
    const orderData = {
      shippingInfo,
      orderItems,
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      totalAmount: totalPrice,
      paymentInfo: {
        status: "Not Paid",
      },
      paymentMethod: "COD",
    };

    createNewOrder(orderData);
  }
  console.log("Méthode sélectionnée :", method);
  console.log("🛒 OrderItems prêt à l'envoi :", orderItems);



  if (method === "Card") {
    const orderData = {
      shippingInfo,
      orderItems,
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      totalAmount: totalPrice,
    };

    console.log("Envoi à Stripe avec orderData :", orderData);
    console.log("🛒 OrderItems prêt à l'envoi :", orderItems);



    stripeCheckoutSession(orderData);
  }
};

   
   
  //  const submitHandler = (e) => {
  //    e.preventDefault() 
  //     const {itemsPrice, shippingPrice, taxPrice,totalPrice } = calculateOrderCost(cartItems)
  //    if(method === "COD") {
  //       // Create COD Order 
  //       const orderData = {
  //          shippingInfo,
  //          orderItems: cartItems,
  //          itemsPrice,
  //          shippingAmount:shippingPrice, 
  //          taxAmount:taxPrice,
  //          totalAmount:totalPrice,
  //          paymentInfo: {
  //            status: "Not Paid",

  //          },
  //          paymentMethod: "COD"
  //       }
  //        createNewOrder(orderData)
  //    } 

  //    if(method === "Card") {
  //         const orderData = {
  //          shippingInfo,
  //          orderItems: cartItems,
  //          itemsPrice,
  //          shippingAmount:shippingPrice, 
  //          taxAmount:taxPrice,
  //          totalAmount:totalPrice,
           
  //       };
  //       stripeCheckoutSession(orderData)
  //    }
  //  }
  
  return (
    <>
     <MetaData title={"Payment Method"} />
     <CheckoutSteps shipping confirmOrder payment />
     <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={(e) => setMethod("COD")}
            />
            <label className="form-check-label" htmlFor="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
              onChange={(e) => setMethod("Card")}
            />
            <label className="form-check-label" htmlFor="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
            CONTINUE
          </button>
        </form>
      </div>
    </div>
   </>
  )
}

export default PaymentMethod