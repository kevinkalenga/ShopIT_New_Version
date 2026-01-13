import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { wishlistApi } from '../../redux/api/wishlistApi';

import { useAddToWishlistMutation, useRemoveFromWishlistMutation,  useGetWishlistQuery  } from '../../redux/api/wishlistApi';
// import ReactStars from "react-rating-stars-component";
import renderStars from '../../utils/renderStars'; 

const ProductItem = ({ product, columnSize}) => {
         const [addToWishlist] = useAddToWishlistMutation();
        const [removeFromWishlist] = useRemoveFromWishlistMutation();
        const { user } = useSelector(state => state.auth);
        const { data } =  useGetWishlistQuery(undefined, {
    skip: !user
});
      // S'assurer que c'est un tableau
          const wishlistItems = data?.wishlist || [];
       
        
        // Vérifier si le produit est déjà dans la wishlist
        const isInWishlist = wishlistItems?.some(item => item._id === product._id);



      // Gérer clic sur wishlist   
 
     
      const handleWishlist = async () => {
        if (!user) return alert("You must be logged in to use the wishlist");

        try {
            if (isInWishlist) await removeFromWishlist(product._id).unwrap();
            else await addToWishlist(product._id).unwrap();
        } catch (error) {
            console.error("Wishlist error:", error);
        }
    };



    
    
    return (

            <div className={`col-sm-12 col-md-6 col-lg-${columnSize} my-3`}>
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

                      {/* Bouton Wishlist */}
                           {user && (
                        <button
                            onClick={handleWishlist}
                            className={`btn btn-sm mt-2 border ${isInWishlist ? "btn-danger" : "btn-outline-danger"}`}
                            style={{ borderWidth: '1px' }}
                        >
                            <i className="fa fa-heart"></i>
                        </button>
                    )}
                  </div>
                </div>
              </div>
    )
}

export default ProductItem 





