
export const getPriceQueryParams = (searchParams, key, value) => {
    const newParams = new URLSearchParams(searchParams); // clone proprement

    if (key === "min") {
        // Update the key to match query structure
        key = "price[gte]";
    } else if (key === "max") {
        key = "price[lte]";
    }

    if (value) {
        // add the new value
        newParams.set(key, value);
    } else {
        newParams.delete(key);
    }

    return newParams;
} 

export const calculateOrderCost = (cartItems) => {
   const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
   )

   const shippingPrice = itemsPrice > 200 ? 0 : 25 
   const taxPrice = Number((0.15 * itemsPrice).toFixed(2)) 
   const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

   return {
    itemsPrice: Number(itemsPrice).toFixed(2),
    shippingPrice,
    taxPrice,
    totalPrice
   }
}






