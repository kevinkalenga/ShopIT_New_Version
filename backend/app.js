import express from 'express' 
import dotenv from 'dotenv'
dotenv.config({path: 'backend/config/config.env'})
const app = express()

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT}`)
})