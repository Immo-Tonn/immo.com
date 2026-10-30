import express, { Application, Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDb from './config/db';
import './models'; // models/index.ts
import authRoutes from './routes/authRoutes';
import realEstateRoutes from './routes/realEstateObjectsRoutes';
import imagesRoutes from './routes/imagesRoutes';
import apartmentRoutes from './routes/apartmentsRoutes';
import commercial_NonResidentialBuildingsRoutes from './routes/commercial_NonResidentialBuildingsRoutes';
import landPlotRoutes from './routes/landPlotsRoutes';
import residentialHousesRoutes from './routes/residentialHousesRoutes';
import emailRoutes from './routes/emailRoutes';
import videosRoutes from './routes/videosRoutes';
import mongoose from 'mongoose';
import { startRebuildReconciler } from './utils/rebuildReconciler';
import {
  errorLogger,
  errorHandler,
  setupUncaughtErrorHandlers,
} from './middleware/errorMiddleware';

setupUncaughtErrorHandlers();
const app: Application = express();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
 // Test route without use MongoDB
 app.get("/api/test", (req, res) => {
   console.log("Test route hit");
   res.json({ message: "API работает" });
 });

//Route for debugging database connection
app.get("/api/debug/db", (req, res) => {
  const dbInfo: {
    database: string;
    collections: string[];
    connectionStatus: string;
  } = {
    database: mongoose.connection.db?.databaseName || "unknown",
    collections: [],
    connectionStatus:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  if (mongoose.connection.db) {
    mongoose.connection.db
      .listCollections()
      .toArray()
      .then((collections) => {
        //  correct modus to get collection name
        dbInfo.collections = collections.map((c) => c.name);
        res.json(dbInfo);
      })
      .catch((err: Error) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(500).json({ error: "Database connection not established" });
  }
});

app.get('/api/test-mongo', async (req, res) => {
  try {
    console.log("Testing MongoDB connection...");
    
    // test connection without actually requesting
    const isConnected = mongoose.connection.readyState === 1;
    
    console.log("MongoDB connection state:", 
      isConnected ? "Connected" : "Disconnected");
    
    res.json({ 
      connected: isConnected,
      state: mongoose.connection.readyState 
    });
  } catch (error) {
    console.error("Error testing MongoDB:", error);
    res.status(500).json({ error: String(error) });
  }
});

app.use("/api/auth", authRoutes); //маршруты аутентификации
app.use("/api/objects", realEstateRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use(
  '/api/commercial_NonResidentialBuildings',
  commercial_NonResidentialBuildingsRoutes,
);
app.use('/api/landPlots', landPlotRoutes);
app.use('/api/residentialHouses', residentialHousesRoutes);
app.use('/api/email', emailRoutes);

app.use(errorLogger);
app.use(errorHandler);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Serverfehler', error: err.message });
});

connectDb();

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  // сверка опубликованного сайта с данными (включается только при заданных переменных)
  startRebuildReconciler();
});

export default app;
