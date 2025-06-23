import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userApi } from './userApi';



export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),

  endpoints: (builder) => ({
     register: builder.mutation({
      query(body) {
        return {
          url: '/register',
          method: 'POST',
          body,
        };
      },

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Stocke le token dans Redux ici si nécessaire
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),
   
    login: builder.mutation({
      query(body) {
        return {
          url: '/login',
          method: 'POST',
          body,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Stocke le token dans Redux ici si nécessaire
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
      
    }),
      logout: builder.query({
      query: () => '/logout',
    }),
    
  }),
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery} = authApi;


// create api 
// export const authApi = createApi({
//     reducerPath: "authApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: "/api/v1",
//          credentials: 'include',  // <--- ajoute ça !
//     }),

//     endpoints: (builder) => ({

//         register: builder.mutation({
//             query(body) {
//                 return {
//                     url: "/register",
//                     method: 'POST',
//                     body,
//                 }
//             }
//         }),
//         login: builder.mutation({
//             query(body) {
//                 return {
//                     url: "/login",
//                     method: 'POST',
//                     body,
//                 }
//             },
//             async onQueryStarted(args, { dispatch, queryFulfilled }) {
//                 try {
//                     await queryFulfilled;
//                     await dispatch(userApi.endpoints.getMe.initiate(null))
//                 } catch (error) {
//                     console.log(error)
//                 }
//             }
//         }),
//         logout: builder.query({
//             query: () => "/logout"
//         })

//     }),
// });

// export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApi;