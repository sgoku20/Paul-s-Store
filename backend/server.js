import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // <-- Add this

import orderRoutes from './routes/order.route.js';
import productRoutes from "./routes/product.route.js";

import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// ✅ Add this CORS setup before your routes
const allowedOrigins = ['https://your-frontend-domain.com']; // Replace with actual deployed frontend URL
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});
