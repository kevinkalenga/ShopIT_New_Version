import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import { MDBDataTable } from 'mdbreact';
import { Link} from 'react-router-dom';
import MetaData from '../layout/MetaData';
import AdminLayout from '../layout/AdminLayout';
import { useGetAdminOrdersQuery, useDeleteOrderMutation } from '../../redux/api/orderApi';



const ListOrders = () => {
  
  const { data, isLoading, error } = useGetAdminOrdersQuery();
  console.log(data)
  const [deleteOrder, {error:deleteError, isLoading: isDeleteLoading, isSuccess}] = useDeleteOrderMutation()
 
 

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }
    if (isSuccess) {
      toast.error("Order Deleted");
    }
   
   
  }, [error, deleteError, isSuccess]);

const deleteOrderHandler = async (id) => {
  try {
     await deleteOrder(id).unwrap(); // unwrap permet de récupérer l’erreur si elle existe
    } catch (err) {
     toast.error(err?.data?.message || "Delete failed");
   }
};

  
  
  const setOrders = () => {
    const orders = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Payment Status", field: "paymentStatus", sort: "asc" },
        { label: "Order Status", field: "orderStatus", sort: "asc" },
       
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    data?.orders?.forEach(order => {
      orders.rows.push({
        id: order?._id,
        paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
       
        actions: (
         <>
          <Link to={`/admin/orders/${order?._id}`} className="btn btn-outline-primary btn-sm">
            <i className='fa fa-pencil'></i>
          </Link>
          
          <Link  className="btn btn-outline-danger btn-sm ms-2" 
                 onClick={() => deleteOrderHandler(order?._id)} 
                 disabled={isDeleteLoading}
                 >
            <i className='fa fa-trash'></i>
          </Link>
         </>
        )
      });
    });

    return orders;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
       <MetaData title={'All Orders'} />
      <h1 className='my-5'>{data?.orders?.length} Orders</h1>
      <MDBDataTable
        data={setOrders()}
        className='px-3'
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default ListOrders;
