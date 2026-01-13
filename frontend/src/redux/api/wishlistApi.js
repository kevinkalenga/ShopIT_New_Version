import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser } from '../features/userSlice'; // optionnel si tu veux mettre à jour l'user

export const wishlistApi = createApi({
    reducerPath: 'wishlistApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.user?.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        }
    }),
    tagTypes: ['Wishlist'],
    endpoints: (builder) => ({
        getWishlist: builder.query({
            query: () => '/me/wishlist',
            providesTags: ['Wishlist'],
        }),
        addToWishlist: builder.mutation({
            query: (productId) => ({ url: '/me/wishlist/add', method: 'PUT', body: { productId } }),
            invalidatesTags: ['Wishlist'],
        }),
        removeFromWishlist: builder.mutation({
            query: (productId) => ({ url: '/me/wishlist/remove', method: 'PUT', body: { productId } }),
            invalidatesTags: ['Wishlist'],
        }),
    }),
});

export const { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } = wishlistApi;



