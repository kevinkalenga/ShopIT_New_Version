// Create token and save in the cookie

export default (user, statusCode, res) => {
    // Create JWT Token 
    const token = user.getJwtToken()

  

    // Option for cookie and it will expire after seven days
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        
    };

    // Set the cookie
    res.status(statusCode).cookie("token", token, options).json({
        token,
       
    })
}