import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import { MDBDataTable } from 'mdbreact';
import { Link} from 'react-router-dom';
import MetaData from '../layout/MetaData';
import AdminLayout from '../layout/AdminLayout';
import { useGetAdminUsersQuery} from "../../redux/api/userApi"




const ListUsers = () => {
  
  const { data, isLoading, error } = useGetAdminUsersQuery();
  console.log(data)
  
 
 

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    // if (deleteError) {
    //   toast.error(deleteError?.data?.message);
    // }
    // if (isSuccess) {
    //   toast.error("Order Deleted");
    // }
   
   
  }, [error]);

// const deleteOrderHandler = async (id) => {
//   try {
//      await deleteOrder(id).unwrap(); // unwrap permet de récupérer l’erreur si elle existe
//     } catch (err) {
//      toast.error(err?.data?.message || "Delete failed");
//    }
// };

  
  
  const setUsers = () => {
    const users = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Name", field: "name", sort: "asc" },
        { label: "Email", field: "email", sort: "asc" },
        { label: "Role", field: "role", sort: "asc" },
       
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    data?.users?.forEach(user => {
      users.rows.push({
        id: user?._id,
        name:user?.name,
        email:user?.email,
        role:user?.role,
       
        actions: (
         <>
          <Link to={`/admin/users/${user?._id}`} className="btn btn-outline-primary btn-sm">
            <i className='fa fa-pencil'></i>
          </Link>
          
          <Link  className="btn btn-outline-danger btn-sm ms-2" 
                //  onClick={() => deleteOrderHandler(order?._id)} 
                //  disabled={isDeleteLoading}
                 >
            <i className='fa fa-trash'></i>
          </Link>
         </>
        )
      });
    });

    return users;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
       <MetaData title={'All Users'} />
      <h1 className='my-5'>{data?.users?.length} Users</h1>
      <MDBDataTable
        data={setUsers()}
        className='px-3'
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default ListUsers;
