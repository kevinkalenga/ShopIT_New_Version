
import dotenv from 'dotenv'
import path from 'path';
dotenv.config({path: './backend/config/config.env'})
import express from 'express' 

import  {connectedDatabase}  from './config/dbConnect.js';

const app = express()



// Connecter à la base de données
connectedDatabase();

app.use(express.json())
// import des routes
import productRoutes from './routes/productRoutes.js';

// Importer toutes les routes restantes
app.use('/api/v1', productRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})