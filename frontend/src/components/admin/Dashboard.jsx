import React, {useState, useEffect} from 'react'
import AdminLayout from '../layout/AdminLayout'
import DatePicker from "react-datepicker";
import SalesChart from '../charts/SalesChart'
import { useGetDashboardSalesQuery } from '../../redux/api/orderApi';
import toast from 'react-hot-toast'
import Loader from '../layout/Loader'


import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  
  const [startDate, setStartDate] = useState(() => {
  const d = new Date();
  d.setDate(1);   // first day of month
  return d;
});

const [endDate, setEndDate] = useState(new Date());

const { data, isLoading, error, refetch } = useGetDashboardSalesQuery({
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString()
});

    useEffect(() => {
          
           if (error) {
               toast.error(error?.data?.message)
           }
      }, [error])


   const submitHandler = () => {
     refetch()
   }

   console.log(data)
   if(isLoading) return <Loader />
    return (
    <AdminLayout>
     <div className="d-flex justify-content-start align-items-center">
      <div className="mb-3 me-4">
        <label className="form-label d-block">Start Date</label>
        <DatePicker 
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className='form-control'
        />
      </div>
      <div className="mb-3">
        <label className="form-label d-block">End Date</label>
        <DatePicker 
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className='form-control'
        />
      </div>
      <button onClick={submitHandler} className="btn fetch-btn ms-4 mt-3 px-5">Fetch</button>
     </div>
       
         
    <div className="row pr-4 my-5">
      <div className="col-xl-6 col-sm-12 mb-3">
        <div className="card text-white bg-success o-hidden h-100">
          <div className="card-body">
            <div className="text-center card-font-size">
              Sales
              <br />
              <b>${data?.totalSales?.toFixed(2)}</b>
              
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-6 col-sm-12 mb-3">
        <div className="card text-white bg-danger o-hidden h-100">
          <div className="card-body">
            <div className="text-center card-font-size">
              Orders
              <br />
              <b>0</b>
            </div>
          </div>
        </div>
      </div>
    </div>
     <SalesChart salesData={data?.salesData} />
    <div className="mb-5"></div>
    </AdminLayout>
  )
}

export default Dashboard