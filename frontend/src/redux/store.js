import { configureStore} from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi"


// create store which is going to be use in our entry point (index.js)

export const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    
     middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware().concat([productApi.middleware, authApi.middleware]),
})