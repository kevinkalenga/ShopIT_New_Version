import { useEffect } from "react";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { calculateOrderCost } from "../../helpers/helpers";
import { clearCart } from "../../redux/features/cartSlice";

const PaymentSuccess = () => {
  const [createNewOrder] = useCreateNewOrderMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, shippingInfo } = useSelector(state => state.cart);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) return; // sécurité si pas de session

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderCost(cartItems);

    const orderData = {
      shippingInfo,
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product || item._id,
      })),
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      totalAmount: totalPrice,
      paymentMethod: "Card",
      paymentInfo: { id: sessionId, status: "succeeded" },
    };

    createNewOrder(orderData)
      .unwrap()
      .then(() => {
        dispatch(clearCart()); // ✅ vide le panier
        navigate("/me/orders"); // redirige vers la page des commandes
      })
      .catch(err => {
        console.error("Erreur création order :", err);
      });
  }, [cartItems, shippingInfo, createNewOrder, dispatch, navigate]);

  return <div>Processing payment...</div>;
};

export default PaymentSuccess;

