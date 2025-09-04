import React, { useEffect } from 'react'
import { useMyOrdersQuery } from '../../redux/api/orderApi'
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import { MDBDataTable } from 'mdbreact';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import { useSelector} from 'react-redux';


const MyOrders = () => {
  
  const { data, isLoading, error } = useMyOrdersQuery();
  console.log(data)
  console.log("User token:", useSelector(state => state.auth?.user?.token));



  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
   
  }, [error]);

  const setOrders = () => {
    const orders = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Amount Paid", field: "amount", sort: "asc" },
        { label: "Payment Status", field: "status", sort: "asc" },
        { label: "Order Status", field: "orderStatus", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    data?.orders?.forEach(order => {
      orders.rows.push({
        id: order._id,
        amount: `$${order.totalAmount.toFixed(2)}`,
        status: order.paymentInfo?.status.toUpperCase() || "N/A",
        orderStatus: order.orderStatus,
        actions: (
         <>
          <Link to={`/me/order/${order?._id}`} className="btn btn-primary btn-sm">
            <i className='fa fa-eye'></i>
          </Link>
          <Link to={`/invoice/order/${order?._id}`} className="btn btn-success btn-sm ms-2">
            <i className='fa fa-print'></i>
          </Link>
         </>
        )
      });
    });

    return orders;
  };

  if (isLoading) return <Loader />;

  return (
    <div>
       <MetaData title={'My Orders'} />
      <h1 className='my-5'>{data?.orders?.length} Orders</h1>
      <MDBDataTable
        data={setOrders()}
        className='px-3'
        bordered
        striped
        hover
      />
    </div>
  );
};

export default MyOrders;
