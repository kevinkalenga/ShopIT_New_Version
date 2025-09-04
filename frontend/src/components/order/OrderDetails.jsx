

import React, { useEffect } from 'react'
import MetaData from '../layout/MetaData'
import { useParams, Link } from 'react-router-dom'
import { useOrderDetailsQuery } from '../../redux/api/orderApi'
import toast from 'react-hot-toast'
import Loader from '../layout/Loader'

const OrderDetails = () => {
  const params = useParams()
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id)

  const order = data?.order || {}
  // from th the order i collecte all the value
  const { shippingInfo, orderItems, paymentInfo, user, totalAmount, orderStatus } = order
  console.log(order)
 
  const userName = typeof user === 'object' ? user?.name : user

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Erreur lors du chargement de la commande")
    }
  }, [error])

  if (isLoading) return <Loader />

  return (
    <>
      <MetaData title={'Order Details'} />
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-lg-9 mt-5 order-details">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-5 mb-4">Your Order Details</h3>
            {/* <a className="btn btn-success" href="/invoice/order/order-id">
              <i className="fa fa-print"></i> Invoice
            </a> */}
            <a className="btn btn-success" href={`/invoice/order/${order?._id}`}>
              <i className="fa fa-print"></i> Invoice
            </a>

          </div>

          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{order?._id}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td className={String(orderStatus).includes("Delivered") ? "greenColor" : "redColor"}>
                  <b>{orderStatus}</b>
                </td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{new Date(order?.createdAt).toLocaleString('en-US')}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Shipping Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{userName}</td>
              </tr>
              <tr>
                <th>Phone No</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>
                  {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.zipCode}, {shippingInfo?.country}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Payment Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th>Status</th>
                <td className="greenColor">
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th>Method</th>
                <td>{order?.paymentMethod}</td>
              </tr>
              <tr>
                <th>Stripe ID</th>
                <td>{paymentInfo?.id || "Nill"}</td>
              </tr>
              <tr>
                <th>Amount Paid</th>
                <td>${totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Order Items:</h3>
          <hr />

          <div className="cart-item my-1">
            {orderItems && orderItems.length > 0 ? (
              orderItems.map((item, index) => (
                <div className="row my-5" key={item._id || index}>
                  <div className="col-4 col-lg-2">
                    <img src={item.image} alt={item.name} height="45" width="65" />
                  </div>

                  <div className="col-5 col-lg-5">
                    <Link to={`/products/${item._id}`}>{item.name}</Link>
                  </div>

                  <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                    <p>${item.price}</p>
                  </div>

                  <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                    <p>{item.quantity}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No items found in this order.</p>
            )}
          </div>

          <hr />
        </div>
      </div>
    </>
  )
}

export default OrderDetails
