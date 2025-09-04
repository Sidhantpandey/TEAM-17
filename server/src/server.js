import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import indexRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import searchRoutes from "./routes/search.js";
import moderationRoutes from "./routes/moderation.js";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

// Import database connection
import prisma from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // React dev server
      "http://localhost:4173", // Vite preview
      "http://localhost:3000", // Your backend
      process.env.FRONTEND_URL, // Production frontend URL
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP, please try again later.",
      details: {},
    },
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/moderation", moderationRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection test
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log(
      "💡 Make sure PostgreSQL is running and DATABASE_URL is configured correctly"
    );
  }
}

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    await testDatabaseConnection();
  });
} else {
  // For testing, just test the database connection
  testDatabaseConnection();
}

export default app;
