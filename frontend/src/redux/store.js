import { configureStore} from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";


// create store which is going to be use in our entry point (index.js)

export const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer
    },
    
     middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware().concat([productApi.middleware]),
})