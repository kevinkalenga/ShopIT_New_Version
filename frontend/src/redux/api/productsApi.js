import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// create api 
export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1"
    }),

    endpoints: (builder) => ({
        getProducts: builder.query({
            // params for all the params that we will pass like filter, etc.
            query: (params) => ({
                url: "/products",
                params: {
                    page: params?.page,
                    keyword: params.keyword,
                }
            }),

        }),
         getProductDetails: builder.query({
            query: (id) => `/products/${id}`,

        }),
        

    }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productApi;