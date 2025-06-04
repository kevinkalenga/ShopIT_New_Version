import express from 'express' 
import dotenv from 'dotenv'
dotenv.config({path: 'backend/config/config.env'})
const app = express()

// import des routes
import productRoutes from './routes/productRoutes.js';

// Importer toutes les routes restantes
app.use('/api/v1', productRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})