import { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { setCredentials } from "../../redux/features/userSlice";

const Login = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading, error, data }] = useLoginMutation();

  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials(data.user));
    }

    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  }, [data, isAuthenticated, error, dispatch, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <MetaData title="Login" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow rounded bg-body">
            <h2 className="mb-4">Login</h2>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Link to="/password/forgot" className="float-end mb-4">Forgot Password?</Link>

            <button
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>

            <div className="my-3">
              <Link to="/register" className="float-end">New User?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;



// import { useEffect, useState } from "react";
// import { useLoginMutation } from "../../redux/api/authApi"
// import toast from 'react-hot-toast'
// import { useSelector } from "react-redux";
// import { Link, useNavigate} from "react-router-dom"
// import MetaData from '../layout/MetaData'


// const Login = () => {
//      const { isAuthenticated } = useSelector((state) => state.auth)
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("")
//      const navigate = useNavigate()

//     const [login, { isLoading, error, data }] = useLoginMutation()
//     // console.log(login)
//     useEffect(() => {
//        if (isAuthenticated) {
//             navigate('/')
//         }
//         if (error) {
//             toast.error(error?.data?.message)
//         }
//     }, [isAuthenticated, error])

//     const submitHandler = (e) => {
//         e.preventDefault()

//         const loginData = { email, password }

//         login(loginData)
//     }


//     return (
//         <>
//          <MetaData title={'Login'} />
//         <div className="row wrapper">
//             <div className="col-10 col-lg-5">
//                 <form
//                     onSubmit={submitHandler}
//                     className="shadow rounded bg-body"

//                 >
//                     <h2 className="mb-4">Login</h2>
//                     <div className="mb-3">
//                         <label htmlFor="email_field" className="form-label">Email</label>
//                         <input
//                             type="email"
//                             id="email_field"
//                             className="form-control"
//                             name="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label htm="password_field" className="form-label">Password</label>
//                         <input
//                             type="password"
//                             id="password_field"
//                             className="form-control"
//                             name="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>

//                     <Link to="/password/forgot" className="float-end mb-4">Forgot Password?</Link>

//                     <button
//                         disabled={isLoading}
//                         id="login_button"
//                         type="submit" className="btn w-100 py-2">
//                         {isLoading ? "Authenticating..." : "Login"}
//                     </button>

//                     <div className="my-3">
//                         <Link to="/register" className="float-end">New User?</Link>
//                     </div>
//                 </form>
//             </div>
//         </div>
//        </>
//     )
// }

// export default Login