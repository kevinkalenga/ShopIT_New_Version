import { configureStore} from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi"
import userReducer from "./features/userSlice";
import { userApi } from "./api/userApi"
import cartReducer from "./features/cartSlice"
import { orderApi } from "./api/orderApi";


// create store which is going to be use in our entry point (index.js)

export const store = configureStore({
    reducer: {
        auth: userReducer,
        cart: cartReducer,
        [productApi.reducerPath]: productApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
    },
    
     middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware().concat([productApi.middleware, authApi.middleware, userApi.middleware, orderApi.middleware]),
})