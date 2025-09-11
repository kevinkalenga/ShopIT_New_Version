import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// create api 
export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1",
        prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.user?.token;
         console.log("User token in prepareHeaders:", token);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      return headers;
    },
    }),

    endpoints: (builder) => ({
        createNewOrder: builder.mutation({
           query(body) {
             return {
                url: "/orders/new",
                method: "POST",
                body,
             }
           }
        }),
        myOrders: builder.query({
           query: () => `/me/orders`,
        }),
        orderDetails: builder.query({
           query: (id) => `/orders/${id}`,
        }),

        stripeCheckoutSession: builder.mutation({
           query(body) {
             return {
                url: "/payment/checkout_session",
                method: "POST",
                body,
             }
           }
        }),
       
        getDashboardSales: builder.query({
          query: ({startDate, endDate}) => `/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`
        })
       
        

    }),
});

 export const { 
     useCreateNewOrderMutation, 
     useStripeCheckoutSessionMutation, 
     useMyOrdersQuery, 
     useOrderDetailsQuery,
     useGetDashboardSalesQuery
} = orderApi;


