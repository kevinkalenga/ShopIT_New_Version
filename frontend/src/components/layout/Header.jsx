
// import React from 'react'
// import Search from './Search'
// import { useSelector, useDispatch } from 'react-redux';
// import { useGetMeQuery } from '../../redux/api/userApi';
// import { useLazyLogoutQuery } from '../../redux/api/authApi';
// import { logoutUser } from '../../redux/features/userSlice'
// import { Link, useNavigate} from 'react-router-dom';
// import { useGetWishlistQuery } from '../../redux/api/wishlistApi'; // <- import du hook wishlist
// import { wishlistApi } from '../../redux/api/wishlistApi';
// import { userApi } from '../../redux/api/userApi';


//  const Header = () => {
  
//     const { isLoading } = useGetMeQuery()
//       const [logout] = useLazyLogoutQuery()
//    const { user } = useSelector(state => state.auth)
//     const { cartItems } = useSelector(state => state.cart)

//     const { data, isLoading: isWishlistLoading } = useGetWishlistQuery(undefined, {skip: !user,  refetchOnMountOrArgChange: true,}); // hook wishlist

//     const wishlistCount = user ? data?.wishlist?.length || 0 : 0;


 
 
//  const navigate = useNavigate()
//    const dispatch = useDispatch();

//       const logoutHandler = async () => {
//          try {
//                  await logout().unwrap() // appelle la mutation logout de RTK
//                  dispatch(logoutUser()) // nettoie le state Redux
//                     // 🔥 RESET RTK QUERY CACHE
//                  dispatch(wishlistApi.util.resetApiState());
//                  dispatch(userApi.util.resetApiState());
                 
//                  navigate('/login')
//     } catch (err) {
//         console.error('Erreur de déconnexion:', err)
//     }
//     }
  
//   return (
    
//      <nav className="navbar row">
//             <div className="col-12 col-md-3 ps-5">
//                 <div className="navbar-brand">
//                     <Link to="/">
//                         <img src="/images/shopit_logo.png" alt="ShopIT Logo" />
//                     </Link>
//                 </div>
//             </div>
//             <div className="col-12 col-md-6 mt-2 mt-md-0">
//                 <Search />
//             </div>
//             <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
//                 <a href="/cart" style={{ textDecoration: "none" }}>
//                     <span id="cart" className="ms-3"> Cart </span>
//                     <span className="ms-1" id="cart_count">
//                         {cartItems?.length}
//                     </span>
//                 </a>
                
//                 {/* Wishlist */}
//                 <Link to="/wishlist" style={{ textDecoration: "none" }} className="ms-3">
//                     <span id="wishlist"> <i className="fa fa-heart"></i> Wishlist </span>
//                     <span className="ms-1" id="wishlist_count">
//                        {wishlistCount}
//                     </span>
//                 </Link>
                
                
                
//                 {
//                     user ? (
//                         <div className="ms-4 dropdown">
//                             <button
//                                 className="btn dropdown-toggle text-white"
//                                 type="button"
//                                 id="dropDownMenuButton"
//                                 data-bs-toggle="dropdown"
//                                 aria-expanded="false"
//                             >
//                                 <figure className="avatar avatar-nav">
//                                     <img
//                                         src={user?.avatar ? user?.avatar.url : "/images/default_avatar.jpg"}
//                                         alt="User Avatar"
//                                         class="rounded-circle"
//                                     />
//                                 </figure>
//                                 <span>{user?.name}</span>
//                             </button>
//                             <div className="dropdown-menu w-100" aria-labelledby="dropDownMenuButton">
//                                 {
//                                     user?.role === 'admin' && (
//                                         <Link className="dropdown-item" to="/admin/dashboard"> Dashboard </Link>
//                                     )
//                                 }

//                                 <Link className="dropdown-item" to="/me/orders"> Orders </Link>

//                                 <Link className="dropdown-item" to="/me/profile"> Profile </Link>

//                                 <Link onClick={logoutHandler} className="dropdown-item text-danger" to="/"> Logout </Link>
//                             </div>
//                         </div>

//                     ) : (
//                         !isLoading && (
//                             <Link to="/login" className="btn ms-4" id="login_btn"> Login </Link>
//                         )
//                     )}




//             </div>
//         </nav>
    
  
//   )
// }

// export default Header 


import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useGetWishlistQuery } from '../../redux/api/wishlistApi';
import { wishlistApi } from '../../redux/api/wishlistApi';
import { userApi } from '../../redux/api/userApi';
import { useLazyLogoutQuery } from '../../redux/api/authApi';
import { logoutUser } from '../../redux/features/userSlice'
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';

const Header = () => {
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const [wishlistCount, setWishlistCount] = useState(0) // <-- state local
    const { data, isLoading: isWishlistLoading } = useGetWishlistQuery(undefined, {
        skip: !user,
    });
    
    const [logout] = useLazyLogoutQuery()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Mettre à jour le compteur chaque fois que les données changent
    useEffect(() => {
        setWishlistCount(data?.wishlist?.length || 0)
    }, [data])

    const logoutHandler = async () => {
        try {
            await logout().unwrap()
            dispatch(logoutUser())
            dispatch(wishlistApi.util.resetApiState());
            dispatch(userApi.util.resetApiState());
            
            setWishlistCount(0) // <-- vider immédiatement le compteur
            navigate('/login')
        } catch (err) {
            console.error('Erreur de déconnexion:', err)
        }
    }

    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3 ps-5">
                <div className="navbar-brand">
                    <Link to="/"><img src="/images/shopit_logo.png" alt="ShopIT Logo" /></Link>
                </div>
            </div>
            <div className="col-12 col-md-6 mt-2 mt-md-0"><Search /></div>
            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                <Link to="/cart" style={{ textDecoration: "none" }}>
                    <span id="cart"> Cart </span>
                    <span id="cart_count">{cartItems?.length}</span>
                </Link>
                <Link to="/wishlist" style={{ textDecoration: "none" }} className="ms-3">
                    <span id="wishlist"> <i className="fa fa-heart"></i> Wishlist </span>
                    <span id="wishlist_count">{wishlistCount}</span>
                </Link>

                {user ? (
                    <div className="ms-4 dropdown">
                        <button className="btn dropdown-toggle text-white" type="button" data-bs-toggle="dropdown">
                            <figure className="avatar avatar-nav">
                                <img src={user?.avatar?.url || "/images/default_avatar.jpg"} alt="User Avatar" className="rounded-circle"/>
                            </figure>
                            <span>{user?.name}</span>
                        </button>
                        <div className="dropdown-menu w-100">
                            {user?.role === 'admin' && <Link className="dropdown-item" to="/admin/dashboard"> Dashboard </Link>}
                            <Link className="dropdown-item" to="/me/orders"> Orders </Link>
                            <Link className="dropdown-item" to="/me/profile"> Profile </Link>
                            <Link onClick={logoutHandler} className="dropdown-item text-danger" to="/"> Logout </Link>
                        </div>
                    </div>
                ) : (
                    !isWishlistLoading && <Link to="/login" className="btn ms-4" id="login_btn"> Login </Link>
                )}
            </div>
        </nav>
    )
}

export default Header
