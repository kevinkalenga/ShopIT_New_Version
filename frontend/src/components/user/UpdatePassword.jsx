import { useState, useEffect } from "react"
import {useUpdatePasswordMutation} from '../../redux/api/userApi'
import { useNavigate } from "react-router-dom"
import {toast} from 'react-hot-toast'
import UserLayout from "../layout/UserLayout"
import MetaData from "../layout/MetaData"


const UpdatePassword = () => {
  
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
  
      const navigate = useNavigate()
      
          const [updatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation()
      
          useEffect(() => {
              
              if (error) {
                  toast.error(error?.data?.message)
              }
              if (isSuccess) {
                  toast.success("Password updated")
                  navigate("/me/profile")
              }
          }, [error, isSuccess])
      
          const submitHandler = (e) => {
              e.preventDefault()
      
              const userData = { oldPassword, password }
      
              updatePassword(userData)
          }
      
    
    
    
    
    
    
    return (
    <UserLayout>
         <MetaData title={'Update Password'} />
     <div className="row wrapper">
      <div className="col-10 col-lg-8">
        <form 
        onSubmit={submitHandler}
          className="shadow rounded bg-body"
        >
          <h2 className="mb-4">Update Password</h2>
          <div className="mb-3">
            <label htmlFor="old_password_field" className="form-label">
              Old Password
            </label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="new_password_field" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
             disabled={isLoading}
             type="submit" className="btn update-btn w-100">
                 {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
   </UserLayout>

  )
}

export default UpdatePassword