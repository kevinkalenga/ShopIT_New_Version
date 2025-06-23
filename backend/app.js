
import dotenv from 'dotenv'
import path from 'path';
dotenv.config({path: './backend/config/config.env'})
import express from 'express' 
import cookieParser from 'cookie-parser';
import  {connectedDatabase}  from './config/dbConnect.js';
import errorMiddleware from './middlewares/errors.js';
const app = express()


// Import des routes 



// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`ERROR: ${err}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1);
});

// Connecter à la base de données
connectedDatabase();

app.use(express.json({limit: '10mb' }))
app.use(cookieParser());
// import des routes
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Importer toutes les routes restantes
app.use('/api/v1', productRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', orderRoutes);

// Middleware gestion erreurs
app.use(errorMiddleware);

// Démarrage du serveur
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
}); 

// Gestion des promesses non gérées
process.on('unhandledRejection', (err) => {
  console.log('ERROR:', err);
  console.error('Stack trace:', err.stack);
  server.close(() => {
    process.exit(1);
  });
});