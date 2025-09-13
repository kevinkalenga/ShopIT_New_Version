import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// create api 
export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1",
        prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.user?.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
     },
    }),
    tagTypes: ["Product", "AdminProducts"],

    endpoints: (builder) => ({
        getProducts: builder.query({
            // params for all the params that we will pass like filter, etc.
            query: (params) => ({
                url: "/products",
                params: params, // <-- tout est déjà bien structuré
            }),

        }),
         getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }],

        }),

        createReview: builder.mutation({
            query: ({ productId, rating, comment }) => ({
                url: `/products/${productId}/reviews`,
                method: "POST",
                body: { rating, comment },
            }),
             invalidatesTags: (result, error, { productId }) => [
                { type: "Product", id: productId }, // ⚡ force le refetch du produit concerné
             ],
        }),
        getAdminProducts: builder.query({
            query: () => `/admin/products`,
            providesTags: ["AdminProducts"]
        }),
        createProduct: builder.mutation({
            query(body) {
                return {
                    url: "/admin/products",
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: ["AdminProducts"],
        }),
        updateProduct: builder.mutation({
            query({id, body}) {
                return {
                    url: `/products/${id}`,
                    method: "PUT",
                    body,
                }
            },
            invalidatesTags: ["Product", "AdminProducts"],
        })
        

    }),
});

export const { 
    useGetProductsQuery, 
    useGetProductDetailsQuery, 
    useCreateReviewMutation, 
    useGetAdminProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation
} = productApi;