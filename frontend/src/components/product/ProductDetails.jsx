import { useEffect, useState } from "react";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../../redux/api/productsApi";
import toast from "react-hot-toast";
import { useParams} from "react-router-dom";
import MetaData from "../layout/MetaData";
import renderStars from "../../utils/renderStars";
import Loader from "../layout/Loader";
import { setCartItem } from "../../redux/features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import UserAvatar from "../UserAvatar";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, error, isError, refetch } = useGetProductDetailsQuery(params?.id);
  const [createReview] = useCreateReviewMutation();
  const product = data?.product;

  useEffect(() => {
    setActiveImg(product?.images[0]?.url || "/images/default_product.png");
  }, [product]);

  useEffect(() => {
    if (isError) toast.error(error?.data?.message || "Failed to fetch product");
  }, [isError]);

  const increseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= product.stock) return;
    setQuantity(count.valueAsNumber + 1);
  };

  const decreseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;
    setQuantity(count.valueAsNumber - 1);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };
    dispatch(setCartItem(cartItem));
    toast.success("Item added to Cart");
  };

  const submitReview = () => {
    if (!rating || !comment.trim()) {
      toast.error("Please provide rating and comment");
      return;
    }

    createReview({ productId: product._id, rating, comment })
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Review submitted successfully");
        setRating(0);
        setComment("");
        refetch();
        // ✅ product sera refetch automatiquement si RTK Query invalidatesTags est configuré
      })
      .catch((err) => toast.error(err?.data?.message || "Failed to submit review"));
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={product.name} />

      <div className="row d-flex justify-content-around">
        {/* Images */}
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-3">
            <img className="d-block w-100" src={activeImg} alt={product?.name} width="340" height="390" />
          </div>
          <div className="row justify-content-start mt-5">
            {product?.images?.map((img) => (
              <div className="col-2 ms-4 mt-2" key={img._id}>
                <a role="button">
                  <img
                    className={`d-block border rounded p-3 cursor-pointer ${img.url === activeImg ? "border-warning" : ""}`}
                    height="100"
                    width="100"
                    src={img?.url}
                    alt={img?.url}
                    onClick={() => setActiveImg(img.url)}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-12 col-lg-5 mt-5">
          <h3>{product?.name}</h3>
          <p id="product_id">Product # {product?._id}</p>

          <hr />

          <div className="d-flex">
            {renderStars(product?.ratings || 0)}
            <span id="no-of-reviews" className="pt-1 ps-2">
              ({product?.numOfReviews || 0} Reviews)
            </span>
          </div>

          <hr />

          <p id="product_price">${product?.price}</p>
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus" onClick={decreseQty}>-</span>
            <input type="number" className="form-control count d-inline" value={quantity} readOnly />
            <span className="btn btn-primary plus" onClick={increseQty}>+</span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={product?.stock <= 0}
            onClick={setItemToCart}
          >
            Add to Cart
          </button>

          <hr />

          <p>
            Status:{" "}
            <span id="stock_status" className={product?.stock > 0 ? "greenColor" : "redColor"}>
              {product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <hr />

          <h4 className="mt-2">Description:</h4>
          <p>{product?.description}</p>
          <hr />

          <p id="product_seller mb-3">
            Sold by: <strong>{product?.seller}</strong>
          </p>

          {/* Formulaire review */}
          {user ? (
            <div className="mt-5">
              <h4>Post Your Review</h4>
              <select className="form-select mb-3" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={0}>Select Rating</option>
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>

              <textarea
                className="form-control mb-3"
                rows={3}
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              <button className="btn btn-primary" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          ) : (
            <div className="alert alert-danger my-5">Login to post your review.</div>
          )}

          {/* Liste des reviews */}
          <hr />
          <h4 className="mt-4">Customer Reviews</h4>
          {product?.reviews?.length === 0 && <p>No reviews yet.</p>}

          {product?.reviews?.map((rev) => (
            <div key={rev._id} className="mt-3 p-3 border rounded">
           
              <UserAvatar user={rev.user} size={40} className="me-2" />

              <strong className="me-1">{rev.user?.name || "Anonymous"}</strong>
               
              <div className="d-flex align-items-center">
                {renderStars(rev.rating)}
                <span className="ms-2 text-muted">{rev.rating}/5</span>
              </div>
              <p className="mt-2">{rev.comment}</p>
               <small className="text-muted">
  {rev.createdAt
    ? new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(rev.createdAt))
    : "Date inconnue"}
</small>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;

