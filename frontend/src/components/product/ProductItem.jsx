import React from 'react';
import { Link } from "react-router-dom";
// import ReactStars from "react-rating-stars-component";
import renderStars from '../../utils/renderStars'; 

const ProductItem = ({ product}) => {
    
  
    
    return (

            <div className="col-sm-12 col-md-6 col-lg-3 my-3">
                <div className="card p-3 rounded">
                  <img
                    className="card-img-top mx-auto"
                    src={product?.images[0] ? product?.images[0]?.url : '/images/default_product.png'}
                    alt={product.name}
                  />
                  <div
                    className="card-body ps-3 d-flex justify-content-center flex-column"
                  >
                    <h5 className="card-title">
                      <Link to={`/product/${product?._id}`}>{product?.name}</Link>
                    </h5>
                    <div className="ratings mt-auto d-flex align-items-center">
                       {renderStars(product?.ratings)}  
                        <span className="ps-2 pt-1 text-muted">({product?.numOfReviews || 0})</span>
                     
                    </div>
                    <p className="card-text mt-2">${product?.price}</p>
                     <Link to={`/product/${product?._id}`} id="view_btn" className="btn btn-block">
                        View Details
                    </Link>
                  </div>
                </div>
              </div>
    )
}

export default ProductItem 





