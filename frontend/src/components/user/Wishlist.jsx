import React from "react";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation
} from "../../redux/api/wishlistApi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Wishlist = () => {
  const { data, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { user } = useSelector(state => state.auth);

  if (isLoading) return <p>Loading...</p>;

  const wishlist = data?.wishlist || [];

  if (!user) {
    return <p className="bg-danger">You must be logged in to see your wishlist</p>;
  }

  return (
    <div>
      <h2>My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <ul>
          {wishlist.map((product) => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>
                {product.name}
              </Link>

              <button
                onClick={() => removeFromWishlist(product._id)}
                className="btn btn-sm btn-danger ms-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
